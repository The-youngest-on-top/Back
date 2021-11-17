const multerS3 = require('multer-s3');
const multer = require('multer');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: "AKIA3KTIC4SMAPUUNQHQ",
    secretAccessKey: "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",
    region: 'ap-northeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: 'extreme-cbnu',
    key(req, file, cb) {
      cb(null, `account-images/${Date.now()}_${path.basename(file.originalname)}`);
    },
  })
});