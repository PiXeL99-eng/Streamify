import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, FormLabel, HStack, Image } from '@chakra-ui/react'
import { UploadImage } from '../assets'
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react"

const UploadWidget = (props) => {

    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    // const imageSrc = useRef()
    const [publicId, setPublicId] = useState("");

    const cld = new Cloudinary({
        cloud: {
            cloudName: `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`
        }
    });
    const myImage = cld.image(publicId);

    useEffect(() => {

        // imageSrc.current = UploadImage
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: `${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}`,
            uploadPreset: `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`,
            multiple: false
        }, function (error, result) {

            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                // console.log(result.info.secure_url)
                props.setImageUrl(result.info.secure_url)
                setPublicId(result.info.public_id);
            }

        })

    }, [])
    return (
        <Box>
            <FormLabel opacity={"0.7"}>Preview Image</FormLabel>

            <Box border={"2px dotted #b8b8b8"} padding={"2"} width={"14rem"} height={"12rem"}>
                <AdvancedImage
                    style={{ width: "13rem", height: "11rem"}}
                    cldImg={myImage}
                    plugins={[responsive(), placeholder()]}
                />

            </Box>

            <HStack marginTop={"2"}>

                <Button colorScheme='cyan' onClick={() => widgetRef.current.open()} marginX={"auto"}> 
                    Upload
                </Button>

            </HStack>

        </Box>
    )
}

export default UploadWidget