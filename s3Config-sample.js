const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_OBJECT_PREFIX = process.env.S3_OBJECT_PREFIX;
const S3_BUCKET = process.env.S3_BUCKET;

module.exports = {
    AWS: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
    },
    path: S3_OBJECT_PREFIX,
    S3: {
        params: {
            Bucket: S3_BUCKET
        }
    }
};
