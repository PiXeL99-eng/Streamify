import axios from "axios";

export const newVideo = async (videoDetails) => {

    try{

        const res = await axios.post(`${import.meta.env.VITE_API_URL}` + "/Streamify/newVideo", videoDetails);

        // console.log(res.data)

        return true

    } catch(err){
        console.log(err)
        return false
    }
}

export const getAllVideos = async () => {

    try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}` + "/Streamify/allVideos");

        // console.log(res.data)
        return res.data

    } catch(err){
        console.log(err)
        return []
    }
}

export const getUserVideos = async (userId) => {

    try{
        const res = await axios.get(`${import.meta.env.VITE_API_URL}` + `/Streamify/userVideos/${userId}`);

        // console.log(res.data)
        return res.data

    } catch(err){
        console.log(err)
        return []
    }
}

//not ready
export const deleteVideo = async (videoID) => {

    try{
        const res = await axios.delete(`${import.meta.env.VITE_API_URL}` + `/Streamify/deleteVideo/${videoID}`);

        return 1

    } catch(err){
        console.log(err)
        return 0
    }
}

export const updateVideo = async (videoDetails) => {

    try{

        const res = await axios.put(`${import.meta.env.VITE_API_URL}` + "/Streamify/updateVideo", videoDetails);
        return true

    } catch(err){
        console.log(err)
        return false
    }
}