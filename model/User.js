
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  "name": {
    "required": true,
    "unique": false
  },
  "email": {
    "required": true,
    "unique": true
  },
  "age": {
    "required": false,
    "unique": false
  },
  "createdAt": {
    "required": false,
    "unique": false
  }
});
module.exports = mongoose.model('User', UserSchema);
