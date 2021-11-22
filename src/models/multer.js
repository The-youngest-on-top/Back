const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
const BUCKET_NAME = "extreme-cbnu";
AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

const s3 = new AWS.S3();
exports.profile_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `profile_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');

exports.activity_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `activity_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');

exports.account_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `account_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');

exports.travel_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'extreme-cbnu',
    key: (req, file, cb) => {
      cb(null, `travel_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');
