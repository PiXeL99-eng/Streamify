import axios from "axios";

export const newVideo = async (videoDetails) => {

    try{

        const res = await axios.post(`${import.meta.env.VITE_API_URL}` + "/streamify/newVideo", videoDetails);

        // console.log(res.data)

        return true

    } catch(err){
        console.log(err)
        return false
    }
}

export const getAllVideos = async (query) => {

    try{

        console.log(axios.defaults.headers.common)
        if(query){
            const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/allVideos?search=${query}`);
            return res.data
        }
        else{
            const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/allVideos`);
            return res.data
        }

        // console.log(res.data)

    } catch(err){
        console.log(err)
        return []
    }
}

export const getUserVideos = async (userId) => {

    try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/streamify/userVideos/${userId}`);

        // console.log(res.data)
        return res.data.videos

    } catch(err){
        console.log(err)
        return []
    }
}

//not ready
export const deleteVideo = async (videoID) => {

    try{
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}` + `/streamify/deleteVideo/${videoID}`);

        return 1

    } catch(err){
        console.log(err)
        return 0
    }
}

export const updateVideo = async (videoId, videoDetails) => {

    try{

        const res = await axios.put(`${import.meta.env.VITE_API_URL}` + "/streamify/updateVideo", {videoId: videoId, updateInfo: videoDetails});
        return true

    } catch(err){
        console.log(err)
        return false
    }
}