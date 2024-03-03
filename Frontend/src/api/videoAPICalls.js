import axios from "axios";

async function setAxiosToken(getToken) {

    try {
        const token = await getToken({ template: 'streamify_user' });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // console.log('Token set successfully');
    } catch (error) {
        console.error('Error setting token:', error);
    }
}

export const newVideo = async (getToken, videoDetails) => {

    try{

        await setAxiosToken(getToken);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}` + "/streamify/videos/newVideo", videoDetails);

        // console.log(res.data)

        return true

    } catch(err){
        console.log(err)
        return false
    }
}

export const getAllVideos = async (getToken, query) => {

    try{

        await setAxiosToken(getToken);
        // console.log(axios.defaults.headers.common)
        if(query){
            const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/videos/allVideos?search=${query}`);
            return res.data
        }
        else{
            const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/videos/allVideos`);
            return res.data
        }

        // console.log(res.data)

    } catch(err){
        console.log(err)
        return []
    }
}

export const getUserVideos = async (getToken) => {

    try{

        await setAxiosToken(getToken);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/videos/userVideos/`);

        // console.log(res.data)
        return res.data.videos

    } catch(err){
        console.log(err)
        return []
    }
}

//not ready
export const deleteVideo = async (getToken, videoID) => {

    try{

        await setAxiosToken(getToken);
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}` + `/streamify/videos/deleteVideo/${videoID}`);

        return 1

    } catch(err){
        console.log(err)
        return 0
    }
}

export const updateVideo = async (getToken, videoId, videoDetails) => {

    try{

        await setAxiosToken(getToken);
        const res = await axios.put(`${import.meta.env.VITE_API_URL}` + "/streamify/videos/updateVideo", {videoID: videoId, updateInfo: videoDetails});
        return true

    } catch(err){
        console.log(err)
        return false
    }
}