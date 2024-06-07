const multer = require('multer');
const path = require('path');
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req : any, file : any, cb : any) {
    cb(null, 'images/'); // Directory to save the uploaded files
  },
  filename: function (req : any, file : any, cb : any) {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file
  },
});

const upload = multer({ storage: storage });

export default upload;