const FormModel = require('../db/Form')
const UserModel = require('../db/User')
const ResponseModel = require('../db/Response')

module.exports = {
  formsGet: async (req, res) => {
    try {
      const result = await FormModel.find().lean()
      res.send(result)
    } catch (e) {
      res.send(e)
    }
  },

  createForm: async (req, res) => {
    let createdBy
    if (req.user) {
      createdBy = req.user.id
      console.log('Req.User@User:', req.user)
    } else {
      const guestUserBot = await UserModel.findOne({ name: 'Guest User' }).lean()
      console.log(guestUserBot)
      // Sample guest user data
      // const guestUserBotData = {
      //     "_id":{"$oid":"65d2ab748c892a75983aac13"},
      //     "createdForms":[
      //         {"$oid":"65d2acd177176bc32f523ff9"},
      //         {"$oid":"65d2af7888d2e40f49bd6f7a"},
      //         {"$oid":"65d2b061a6951b2635b0e308"},
      //         {"$oid":"65d31799835d6ca6072935a1"}
      //     ],
      //     "name":"Guest User",
      //     "email":"coolboy69@gg.com",
      //     "createdAt":{"$date":{"$numberLong":"1708305268726"}},
      //     "updatedAt":{"$date":{"$numberLong":"1708332953315"}},
      //     "__v":{"$numberInt":"0"}
      // }

      if (!guestUserBot) {
        return res.status(400).send('Guest bot user not found')
      }

      createdBy = guestUserBot._id || guestUserBot.id
      console.log('GuestUserBot:', guestUserBot)
    }
    try {
      const data = {
        createdBy,
        name: req.body.name,
        description: req.body.description
      }

      const newForm = new FormModel(data)
      await newForm.save().then((docs) => {
        UserModel.updateOne(
          { _id: createdBy },
          { $push: { createdForms: docs._id } }
        )
          .then(() => {
            console.log(createdBy)
            console.log('Form id added to user details')
          })
          .catch((error) => {
            console.log('got some error', error)
          })

        res.status(200).json(docs)
      })
    } catch (error) {
      console.error(error)
      if (req.user) console.log(req.user)
      if ((req.body || {}).createdBy) console.log(req.body.createdBy)
      res.status(500).send(error.message || 'Internal Server Error')
    }
  },

  getFormById: async (req, res) => {
    try {
      const formId = req.params.formId

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        if (form == null) {
          res.status(404).send('Form not found')
        } else {
          res.status(200).json(form)
        }
      })
    } catch (error) {
      res.send(error)
    }
  },

  deleteForm: async (req, res) => {
    try {
      const formId = req.params.formId
      const userId = req.params.userId

      console.log(formId)
      console.log(userId)

      await FormModel.findOne({ _id: formId }).then(async (form) => {
        console.log(form)
        if (form === null) {
          res.status(404).send('Form not found or already deleted')
        } else {
          if (form.createdBy === userId) {
            form.remove(function (err) {
              if (err) { return res.status(500).send(err) }
              console.log('Form deleted')
              return res.status(202).send('Form Deleted')
            })
          } else {
            res.status(401).send('You are not the owner of this Form')
          }
        }
      })
    } catch (error) { /* empty */ }
  },

  editForm: async (req, res) => {
    try {
      const formId = req.body.formId
      const data = {
        name: req.body.name,
        description: req.body.description,
        questions: req.body.questions
      }

      console.log('Hi, I am from backend, this is form data that i received from frontend:')

      console.log(data)

      FormModel.findByIdAndUpdate(formId, data, { new: true }, (err, result) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.status(200).json(result)
        }
      })
    } catch (error) {
      res.send(error)
    }
  },

  getAllFormsOfUser: async (req, res) => {
    try {
      const userId = req.params.userId
      console.log(userId)
      await UserModel.findOne({ _id: userId }).then(async (user) => {
        if (user == null) {
          res.status(404).send('User not found')
        } else {
          await FormModel.find().where('_id').in(user.createdForms).exec((err, records) => {
            console.log(records)
            if (err) {
              console.error(err)
            }
            res.status(200).json(records)
          })
        }

        //   res.send(docs.createdForms)
      })
    } catch (error) {
      res.send(error)
    }
  },

  submitResponse: async (req, res) => {
    try {
      const data = {
        formId: req.body.formId,
        userId: req.body.userId,
        response: req.body.response
      }
      console.log(data.formId)
      console.log(data.userId)

      if (data.response.length > 0) {
        const newResponse = new ResponseModel(data)
        // console.log(newResponse);

        await newResponse.save().then((docs) => {
          res.status(200).json(
            docs
          )
        })
      } else {
        res.status(400).send('FIll atleast one field, MF!')
      }
    } catch (error) {
      res.send(error)
    }
  },

  allResponses: async (req, res) => {
    try {
      const result = await ResponseModel.find().lean()
      res.json(result)
    } catch (e) {
      res.send(e)
    }
  },

  getResponse: async (req, res) => {
    try {
      const formId = req.params.formId
      //   console.log(formId);

      await ResponseModel.find({ formId }).then(async (responses) => {
        res.status(200).json(responses)
      })
    } catch (error) {
      res.send(error)
    }
  }

}

// FormId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Form'
//   },

//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },

//   response : [{
//       questionId: String,
//       optionId: String,
//   }],
