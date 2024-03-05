const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({

  image:
    {
      type: String
    }
}, { timestamps: true })

const imageModel = new mongoose.model('Image', imageSchema)

module.exports = imageModel
