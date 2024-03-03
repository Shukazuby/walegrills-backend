const multer = require('multer');
const Datauri = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('file');

const dataUri = (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    const dUri = new Datauri();
    const ext = path.extname(file.originalname).toString();
    return dUri.format(ext,file.buffer)
  } catch (error) {
    console.error('Error converting file to data URI:', error);
    throw error;
  }
};

module.exports = { multerUploads, dataUri };
