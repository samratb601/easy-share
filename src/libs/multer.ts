import multer from 'multer';


// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to include the timestamp
    },
});
const uploadFile = multer({ storage: storage });

export default uploadFile