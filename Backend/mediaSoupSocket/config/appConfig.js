module.exports = {
    mediaSoup : {
        numWorkers : 1,
        rtcMinPort : 2000,
        rtcMaxPort : 2100,
        mediaCodecs : [
            {
              kind: 'audio',
              mimeType: 'audio/opus',
              clockRate: 48000,
              channels: 2,
            },
            {
              kind: 'video',
              mimeType: 'video/VP8',
              clockRate: 90000,
              parameters: {
                'x-google-start-bitrate': 1000,
              },
            },
        ],
        webRtcTransport_options : {
          listenIps: [
            { ip: '0.0.0.0', announcedIp: '127.0.0.1' }
          ],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        },
    },
    chat : {
      messageBuffer : 10,
    },
};