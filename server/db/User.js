const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: { type: String },
  createdForms: []
}, { timestamps: true })

UserSchema.plugin(mongoosePaginate)

const userModel = new mongoose.model('User', UserSchema, 'User')

module.exports = userModel

