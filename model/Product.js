
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  "title": {
    "required": true,
    "unique": false
  },
  "price": {
    "required": true,
    "unique": false
  },
  "description": {
    "required": false,
    "unique": false
  },
  "inStock": {
    "required": false,
    "unique": false
  }
});
module.exports = mongoose.model('Product', ProductSchema);
