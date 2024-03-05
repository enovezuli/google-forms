const UserModel = require('../db/User')
const jwt = require('jsonwebtoken')
require('dotenv').config()
console.log(process.env)

module.exports = {
  loginGet: async (req, res) => {
    try {
      const result = await UserModel.find().lean()
      res.send(result)
    } catch (e) {
      res.send(e)
    }
  },

  login: async (req, res) => {
    console.log(req.body.email)
    try {
      const result = await UserModel.findOne({ email: req.body.email }).lean()

      if (!result) {
        const gData = {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image
        }
        console.log(gData)

        const newUser = new UserModel(gData)
        newUser.save().then((docs) => {
          const user = {
            id: docs._id,
            name: docs.name,
            email: docs.email,
            image: docs.image
          }
          console.log('User:', user)

          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
          const userData = req.body
          console.log(userData)
          res.json({ accessToken })
        })
      } else {
        const user = {
          id: result._id,
          name: result.name,
          email: result.email,
          image: result.image
        }
        console.log('User:', user)

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        const userData = req.body
        console.log(userData)
        res.json({ accessToken })
      }
    } catch (error) {
      res.send(error)
    }
  },

  verifyToken: (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')?.[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
    })
  }
}
