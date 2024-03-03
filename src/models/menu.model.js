module.exports = (sequelize, dataType) => {
    const menu = sequelize.define('menu', {
      name: {
        type: dataType.STRING,
        allowNull: false,
        trim: true,
      },
      price: {
        type: dataType.INTEGER,
        allowNull: false,
        trim: true,
      },
      image: {
        type: dataType.STRING,
        trim: true,
      },
      description: {
        type: dataType.STRING,
        trim: true,
      },
      category: {
        type: dataType.ENUM('main', 'grills', 'canapes'),
        allowNull: false,
        trim: true,
      },

    });
  
    return menu;
  };
  