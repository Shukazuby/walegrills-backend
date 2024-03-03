const express = require('express');
const {menuController} = require('../../controllers');
const { multerUploads } = require('../../config/multer');

const router = express.Router();

router.post('/', multerUploads, menuController.addItem);
router.get('/', menuController.getItems);
router.get('/:itemId', menuController.getAnItem);
router.get('/cat/category', menuController.getItemsByCategory);
router.patch('/:itemId', menuController.updateItem);
router.delete('/:itemId', menuController.deleteItem);

module.exports = router