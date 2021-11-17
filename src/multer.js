const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');
AWS.config.loadFromPath(__dirname+ '../../aws.json');

const s3 = new AWS.S3();
exports.profile_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'extreme-cbnu',
    key: (req, file, cb) => {
      cb(null, `profile_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');

exports.activity_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'extreme-cbnu',
    key: (req, file, cb) => {
      cb(null, `activity_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');

exports.account_upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'extreme-cbnu',
    key: (req, file, cb) => {
      cb(null, `account_images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
}, 'NONE');
