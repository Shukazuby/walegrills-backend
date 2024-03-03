const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { dataUri } = require("../config/multer");
const { uploader } = require("../config/cloudinary");

const addItem = async (data, file) => {
    const fileUri = dataUri(file);

    const uploadImage = await uploader.upload(fileUri.content);
    
    const menu = await db.menus.create({
      ...data,
      image: uploadImage.secure_url, 
    });
    return menu;
  };

  const getItems = async () => {
    const menu = db.menus.findAll();
    if (!menu) {
      throw new ApiError(httpStatus.NOT_FOUND, "menu not found");
    }
    return menu;
  };

  const updateItem = async (itemId, body) => {
    const menu = db.menus.findOne({
      where:{id:itemId}
    });
    if (!menu) {
      throw new ApiError(httpStatus.NOT_FOUND, "menu lists not found");
    }
    await menu.update({
      id: itemId,
      ...body
    })
    return menu;
  };

  const getItemsByCategory = async (filter) => {
    const menu = db.menus.findAll({
      where: filter
    });
    if (!menu) {
      throw new ApiError(httpStatus.NOT_FOUND, `Category not found`);
    }
    
    if(!['main', 'grills', 'canapes'].includes(filter.category)){
      throw new ApiError(httpStatus.BAD_REQUEST, "Category has to be main, grills, or canapes");
    }
    return menu;
  };

  // const getAnItemByCategory = async (itemId, filter) => {
  //   const menu = db.menus.findAll({
  //     where:{
  //       id: itemId,
  //     },
  //     filter
  //   });
  //   if (!menu) {
  //     throw new ApiError(httpStatus.NOT_FOUND,`Category not found`);
  //   }
  //   return menu;
  // };


  const getAnItem = async (itemId) => {
    const menu = db.menus.findOne({
      where:{id:itemId}
    });
    if (!menu) {
      throw new ApiError(httpStatus.NOT_FOUND, "menu not found");
    }
    return menu;
  };

  const deleteAnItem = async (itemId) => {
    const menu = db.menus.findOne({
      where:{id:itemId}
    });
    if (!menu) {
      throw new ApiError(httpStatus.NOT_FOUND, "menu not found");
    }
    await menu.destroy({where:{id:itemId}})
    return menu;
  };



  
  module.exports ={
    addItem,
    getItems,
    updateItem,
    getAnItem,
    deleteAnItem,
    getItemsByCategory,
  }