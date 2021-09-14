
const express = require('express')
const router = express.Router()
const util = require('../util')
const path = require('path')
var multer = require('multer')


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null,  '1' + path.extname(file.originalname));
    }
});
const fileFilter = (req,file,cb)=>{
    var ext = path.extname(file.originalname)
    console.log(ext)
    console.log(path)
    return cb(new Error('Only files of min 25MB size are allowed'))
        {
        cb(null,true);
    }
 };
 const uploads = multer({storage:storage,limits:{
                                         files:1,
                                         fileSize:25*1024*1024*1024,
                                        },
                        fileFilter:fileFilter})

    //VAlidation error handler in case of error in multer
    function makeMulterUploadMiddleware(multerUploadFunction) {
        return (req, res, next) =>
            multerUploadFunction(req, res, err => {
                // handle Multer error
                if (err && err.name && err.name === 'MulterError') {
                    return res.status(500).send({
                        error: err.name,
                        message: `File upload error: ${err.message}`,
                    });
                }
                // handle other errors
                if (err) {
                    return res.status(500).send({
                        error: 'FILE UPLOAD ERROR',
                        message: 'Something wrong ocurred when trying to upload the file, may be you send other than images/videos OR file size gretaer than of 25MB.',
                    });
                }
    
                next();
            });
        }
        const multerMiddleware = makeMulterUploadMiddleware(uploads.single('file'));
 
    //Endpoints-Starts-------------------------

router.get('/',util.testAuthentication)
router.post('/',multerMiddleware,util.pinFileToIPFS)
router.post('/ipfs-get',multerMiddleware,util.ipfsGetByHash)
router.post('/ipfs-get',multerMiddleware,util.saveFileandReturn)
router.post('/ipfs-get',multerMiddleware,util.sendFile)
router.post('/test',uploads.single('file'),(req,res)=>{
    console.log(req.file)
})

module.exports=  router;