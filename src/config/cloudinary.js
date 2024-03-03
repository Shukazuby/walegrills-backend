const { config, uploader } = require('cloudinary').v2;
const configPath = require('./config');

const cloudinaryConfig = () => {
  config({
    cloud_name: configPath.cloudinary.cloudName,
    api_key: configPath.cloudinary.apiKey,
    api_secret: configPath.cloudinary.apiSecret,
  });

};

module.exports = {
  cloudinaryConfig,
  uploader,
};
