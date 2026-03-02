const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3 = async (buffer, key, contentType) => {
  if (!process.env.AWS_BUCKET_NAME) {
    // Fallback for local development if S3 is not configured
    const localPath = path.join(__dirname, '../uploads', key);
    if (!fs.existsSync(path.dirname(localPath))) {
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
    }
    fs.writeFileSync(localPath, buffer);
    return `/uploads/${key}`;
  }

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const processAndUploadPanorama = async (file) => {
  const filename = `${Date.now()}-${file.originalname}`;
  const results = {};

  const resolutions = [
    { name: 'low', width: 1024, quality: 60 },
    { name: 'medium', width: 2048, quality: 75 },
    { name: 'high', width: 4096, quality: 90 },
  ];

  for (const res of resolutions) {
    const buffer = await sharp(file.buffer)
      .resize(res.width)
      .jpeg({ quality: res.quality })
      .toBuffer();

    const key = `panoramas/${res.name}/${filename}`;
    results[res.name] = await uploadToS3(buffer, key, 'image/jpeg');
  }

  return results;
};

module.exports = {
  processAndUploadPanorama,
};
