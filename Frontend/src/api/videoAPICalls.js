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

        console.log(res.data)
        return res.data

    } catch(err){
        console.log(err)
        return []
    }
}