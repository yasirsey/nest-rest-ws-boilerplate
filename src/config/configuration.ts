export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    mongodb: {
        uri: process.env.MONGODB_URI,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'eu-central-1',
        signatureVersion: process.env.AWS_SIGNATURE_VERSION || 'v4',
        bucketName: process.env.AWS_BUCKET_NAME,
    },
});
