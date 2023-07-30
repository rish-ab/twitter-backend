const multer = require('multer');
const GET_EXT = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

let img = "";
let error;
const config = multer.diskStorage({
    destination: (req, file, cb) => {
        let erAuthenticateRequestr = "";
        if (!(GET_EXT[file.mimetype]))
            error = new Error("Image not detected");

        cb(error, 'images');
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.split(".");
        const ext = GET_EXT[file.mimetype];
        img = filename[0] + Date.now() + "." + ext;
        cb(null, img);
    }
});

module.exports = multer({ storage: config }).single('image')