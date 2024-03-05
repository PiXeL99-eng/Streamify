require("dotenv").config({path : '../config/config.env'});
const fs = require('fs');
const child_process = require('child_process');
const { EventEmitter } = require('events');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require('../config/serviceAccountKey');

const { createSdpText } = require('../utils/sdp');
const { convertStringToStream } = require('../utils/networkUtil');

const axios = require('axios');

const RECORD_FILE_LOCATION_PATH = process.env.RECORD_FILE_LOCATION_PATH || 'data';

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});


// Class to handle child process used for running FFmpeg
module.exports = class FFmpeg {
    constructor (rtpParameters, streamId) {
        this._rtpParameters = rtpParameters;
        this._processes = [];
        this._filePaths = [];
        this._observer = new EventEmitter();
        this._videoId = streamId;
        this._mediaSources = ['screen', 'cam']
        this._createProcesses();
    }

    _createProcesses() {
        const promises = []; 

        for(let media of this._mediaSources){
            const recordProcessPromise = this._createProcess(this._rtpParameters[media])
            promises.push(recordProcessPromise)
        }

        Promise.all(promises)
        .then(() => {
            this._startVideoOverlay()
        })
        .catch(err => {
            console.error('Error in creating processes:', err);
        })

    }

    _createProcess (rtpParameters) {
        return new Promise((resolve, reject) => {
            const sdpString = createSdpText(rtpParameters);
            const sdpStream = convertStringToStream(sdpString);

            console.log('createProcess() [sdpString:%s]', sdpString);

            const filePath = `${RECORD_FILE_LOCATION_PATH}\\${rtpParameters.fileName}.webm`;
            const recordProcess = child_process.spawn(ffmpegPath, this._getCommandArgs(filePath));
            this._filePaths.push(filePath)
            this._processes.push(recordProcess)

            recordProcess.once('close', () => {
                console.log('ffmpeg::process::close');
                resolve();
            });

            this._logProcess(recordProcess);

            sdpStream.on('error', error =>
                console.error('sdpStream::error [error:%o]', error)
            );

            // Pipe sdp stream to the ffmpeg process
            sdpStream.resume();
            sdpStream.pipe(recordProcess.stdin);
        })
    }

    _startVideoOverlay() {
        const outputVideo = `${Date.now().toString()}.webm`
        const outputPath = `${RECORD_FILE_LOCATION_PATH}\\${outputVideo}`
        const overlayCommand = [
            '-i', `${RECORD_FILE_LOCATION_PATH}\\${this._rtpParameters['screen'].fileName}.webm`,
            '-i', `${RECORD_FILE_LOCATION_PATH}\\${this._rtpParameters['cam'].fileName}.webm`,
            '-filter_complex', '[1:a]volume=1.5[a1];[0:a][a1]amix=inputs=2:duration=first:dropout_transition=2[outa];[0:v][1:v]overlay=10:H-h-10[outv]',
            '-map', '[outv]',
            '-map', '[outa]',
            '-c:v', 'libvpx',
            '-c:a', 'libvorbis',
            '-b:a', '192k',
            outputPath
        ];
        this._filePaths.push(outputPath)
        
        const recordProcess = child_process.spawn(ffmpegPath, overlayCommand)
        recordProcess.on('close', (code) => {
            console.log('ffmpeg::process::close',code);
            
            const bucket = getStorage().bucket();
            const file = bucket.file(outputVideo);

            const readStream = fs.createReadStream(outputPath);
        
            // Create Upload stream for upload to Firebase Storage
            const uploadStream = file.createWriteStream({
                metadata: {
                contentType: 'video/webm',
                },
            });

            readStream.pipe(uploadStream);

            uploadStream.on('error', (err) => {
                console.error('Error uploading video to Firebase:', err);
            });
        
            uploadStream.on('finish', () => {
                console.log('Video uploaded to Firebase Storage.');

                readStream.close();
                this._deleteLocalFiles();

                file.getSignedUrl({ action: 'read', expires: '01-01-2100' }, async (err, url) => {
                    if (err) {
                        console.error('Error getting signed URL:', err);
                        return;
                    }

                    axios.post(`${process.env.BACKEND_URL}/streamify/videos/app-events`,{
                        event: "update",
                        videoID: this._videoId, 
                        updateInfo: {
                            videoUrl : url,
                            live: false
                        }
                    })
                    this._observer.emit('process-close');
                });
            });

        });

        this._logProcess(recordProcess);
    }

    _deleteLocalFiles() {
        // delete all the recorded files
        this._filePaths.forEach(filePath => {
            fs.unlink(filePath, (err) => {
                if(err) {
                    console.error('Error deleting local file:', err);
                    return ;
                }
                console.log("Successfully deleted the file")
            });
        })
    }

    _logProcess(process) {
         if (process.stderr) {
            process.stderr.setEncoding('utf-8');

            process.stderr.on('data', data => {
                console.log('ffmpeg::process::data [data:%o]', data)
            });
        }

        if (process.stdout) {
            process.stdout.setEncoding('utf-8');

            process.stdout.on('data', data => {
                    console.log('ffmpeg::process::data [data:%o]', typeof(data))
            });
        }

        process.on('message', message =>
            console.log('ffmpeg::process::message [message:%o]', message)
        );

        process.on('error', error =>
            console.error('ffmpeg::process::error [error:%o]', error)
        );
    }

    kill () {
        for(const recordProcess of this._processes){
            console.log('kill() [pid:%d]', recordProcess.pid);
            recordProcess.kill('SIGINT')
        }
    }

    _getCommandArgs (filePath) {
        let commandArgs = [
        '-loglevel',
        'debug',
        '-protocol_whitelist',
        'pipe,udp,rtp',
        '-fflags',
        '+genpts',
        '-f',
        'sdp',
        '-i',
        'pipe:0', 
        ];

        commandArgs = commandArgs.concat(this._videoArgs);
        commandArgs = commandArgs.concat(this._audioArgs);

        commandArgs = commandArgs.concat([
        `${filePath}`
        ]);

        console.log('commandArgs:%o', commandArgs);

        return commandArgs;
    }

    get _videoArgs () {
        return [
        '-map',
        '0:v:0',
        '-c:v',
        'copy'
        ];
    }

    get _audioArgs () {
        return [
        '-map',
        '0:a:0',
        '-strict', // libvorbis is experimental
        '-2',
        '-c:a',
        'copy'
        ];
    }
}
