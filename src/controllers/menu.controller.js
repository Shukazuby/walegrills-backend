const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');
const pick = require('../utils/pick');

const addItem = catchAsync(async (req, res) => {
  const item = await menuService.addItem(req.body, req.file);
  res.status(httpStatus.CREATED).send({
    message: 'item added successfully',
    item,
  });
});

const getItems = catchAsync(async (req, res) => {
  const items = await menuService.getItems();
  res.send(items);
});

const getAnItem = catchAsync(async (req, res) => {
  const item= await menuService.getAnItem(req.params.itemId);
  res.send(item);
});

const updateItem = catchAsync(async (req, res) => {
  const item= await menuService.updateItem(req.params.itemId, req.body);
  res.send(item);
});

const deleteItem = catchAsync(async (req, res) => {
  const item= await menuService.deleteAnItem(req.params.itemId);
  res.send(item);
});


const getItemsByCategory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['category']);
  const items = await menuService.getItemsByCategory(filter);
  res.send(items);
});

// const getAnItemByCategory = catchAsync(async (req, res) => {
//   const filter = pick(req.query, ['category']);
//   const items = await menuService.getAnItemByCategory(req.params.itemId, filter);
//   res.send(items);
// });

module.exports = {
  addItem,
  getAnItem,
  getItems,
  updateItem,
  deleteItem,
  getItemsByCategory,
};
