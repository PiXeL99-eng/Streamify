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

export const userSetup = async (getToken) => {

    try{

        await setAxiosToken(getToken);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}` + "/streamify/users/newUser");

        // console.log(res.data)

        return true

    } catch(err){
        console.log(err)
        return false
    }
}