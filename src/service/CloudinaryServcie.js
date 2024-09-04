import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import dotenv from 'dotenv';

const {parsed} = dotenv.config();

// Configuration
cloudinary.config({
    cloud_name: parsed.CLOUDINARY_CLOUDNAME,
    api_key: parsed.CLOUDINARY_APIKEY,
    api_secret: parsed.CLOUDINARY_APISECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return "no file given";
        // we know its return the response after file upload.
        const uplaodResponse = await cloudinary.uploader.upload(localFilePath,
            {
                resource_type: "auto"
                // it means which type of file.
            }
        );
        console.log("File has been successfully uploaded!");
        // unlink -> it means it removes the files from the local machine so that storage not to be full. That's why we use this and its available in fs.
        fs.unlinkSync(localFilePath);  
        return uplaodResponse;
    }
    catch(err){
        // unlinksync -> if we get any error during uploading file in cloudinary so we will remove the file again from the localServer and will send response try again later. So that no file will be saved.
        fs.unlinkSync(localFilePath); //sync means schronize first it will complete then it will send response. That's why we used this.
        console.log("error at upload image on cloudinary ->", err.message);
    }
}

export {uploadOnCloudinary};