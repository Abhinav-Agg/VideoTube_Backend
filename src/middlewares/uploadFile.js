import multer from 'multer';

const uplaod = multer({storage});

// storage will upload the file with given name.
const storage = multer.diskStorage({
    // here, in destination give the path where to store the path file.
    destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
    // this is filename that means what type of name you will store the file in the disk storeage. That's why we use the filename.
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now());
    }
});

export default uplaod;
/*
-> Upload means what type of image will upload single, array(multiple) this type of methods are in upload. Now its middleware only pass this in a function.
upload.single() and we add this in a route which means its a middleware then go for next method.
We know we get the image from multer that's why we use this.
*/



