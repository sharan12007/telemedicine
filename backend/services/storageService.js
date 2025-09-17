const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer for file uploads
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'private',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const extension = path.extname(file.originalname);
      cb(null, `uploads/${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only specific file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'));
    }
  }
});

// Generate signed URL for downloading a file
const getSignedUrl = (key) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

// Delete a file from S3
const deleteFile = async (key) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key
  };

  return s3.deleteObject(params).promise();
};

module.exports = {
  upload,
  getSignedUrl,
  deleteFile
};