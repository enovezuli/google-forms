import React from 'react'

import { Grid, Paper, Typography } from '@material-ui/core'

import formService from '../../services/formService'
// import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import RadioGroup from '@material-ui/core/RadioGroup'
import Divider from '@material-ui/core/Divider'
// import { makeStyles } from '@material-ui/core/styles';
// import Container from '@material-ui/core/Container';

import auth from '../../services/authService'
import PropTypes from 'prop-types'

function UserView (props) {
  // const classes = useStyles();

  const [userId, setUserId] = React.useState('')
  const [formData, setFormData] = React.useState({})
  const [responseData, setResponseData] = React.useState([])
  // console.log(responseData);

  // const [optionValue, setOptionValue] = React.useState([])
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const [questions, setQuestions] = React.useState([])
  const [value, setValue] = React.useState('')

  React.useEffect(() => {
    if (auth?.isAuthenticated()) {
      const user = auth.getCurrentUser()
      console.log(user.id)
      setUserId(user.id)
    } else {
      const anonymousUserId = 'anonymous' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      console.log(anonymousUserId)
      setUserId(anonymousUserId)
    }
  }, [])

  const handleRadioChange = (j, i) => {
    const questionId = questions[i]._id
    const optionId = questions[i].options[j]._id

    const data = {
      questionId, optionId
    }

    setValue(j)

    const fakeRData = [...responseData]

    const indexOfResponse = fakeRData.findIndex(x => x.questionId === questionId)
    if (indexOfResponse === -1) {
      setResponseData(responseData => [...responseData, data])
    } else {
      fakeRData[indexOfResponse].questionId = questionId
      setResponseData(fakeRData)
    }

    // setOptionValue(fakeData);
    //
  }

  React.useEffect(() => {
    UserView.propTypes = {
      match: PropTypes.object.isRequired
    }

    const formId = props.match.params.formId
    console.log(formId)

    formService.getForm(formId)
      .then((data) => {
        console.log(data)

        setFormData(data)
        setQuestions(data.questions)
      },
      error => {
        const resMessage =
               (error.response &&
               error.response.data &&
               error.response.data.message) ||
               error.message ||
               error.toString()
        console.log(resMessage)
      }
      )
  }, [props.match.params.formId])

  function submitResponse () {
    const submissionData = {
      formId: formData._id,
      userId,
      response: responseData
    }
    console.log(submissionData)

    formService.submitResponse(submissionData)
      .then((data2) => {
        setIsSubmitted(true)
        console.log(data2)
      },
      error => {
        const resMessage =
           (error.response &&
           error.response.data &&
           error.response.data.message) ||
           error.message ||
           error.toString()
        console.log(resMessage)
      }
      )
  }

  function reloadForAnotherResponse () {
    window.location.reload(true)
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <div>
        <AppBar position='static' style={{ backgroundColor: 'teal' }}>
          <Toolbar>
            <IconButton edge='start' style={{ marginRight: '10px', marginBottom: '5px' }} color='inherit' aria-label='menu'>
              <MenuIcon />
            </IconButton>
            <Typography variant='h6' style={{}}>
              Velocity Forms
            </Typography>
          </Toolbar>
        </AppBar>
        <br />

        <Grid
          container
          direction='column'
          justifyContent='center'
          alignItems='center'
        >
          <Grid item xs={12} sm={5} style={{ width: '100%' }}>
            <Grid style={{ borderTop: '10px solid teal', borderRadius: 10 }}>
              <div>
                <div>
                  <Paper elevation={2} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '15px', paddingTop: '20px', paddingBottom: '20px' }}>
                      <Typography variant='h4' style={{ fontFamily: 'sans-serif Roboto', marginBottom: '15px' }}>
                        {formData.name}
                      </Typography>
                      <Typography variant='inherit'>{formData.description}</Typography>
                    </div>
                  </Paper>
                </div>
              </div>
            </Grid>

            {!isSubmitted
              ? (
                <div>
                  <Grid>

                    {questions.map((ques, i) => (
                      <div key={i}>
                        <br />
                        <Paper>
                          <div>
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              marginLeft: '6px',
                              paddingTop: '15px',
                              paddingBottom: '15px'
                            }}
                            >
                              <Typography variant='subtitle1' style={{ marginLeft: '10px' }}>{i + 1}. {ques.questionText}</Typography>

                              {ques.questionImage !== ''
                                ? (
                                  <div>
                                    <img src={ques.questionImage} width='80%' height='auto' alt='questionImage' /><br /><br />
                                  </div>
                                )
                                : ''}

                              <div>

                                <RadioGroup aria-label='quiz' name='quiz' value={value} onChange={(e) => { handleRadioChange(e.target.value, i) }}>

                                  {ques.options.map((op, j) => (
                                    <div key={j}>
                                      <div style={{ display: 'flex', marginLeft: '7px' }}>
                                        <FormControlLabel value={j} control={<Radio />} label={op.optionText} />

                                      </div>

                                      <div style={{ display: 'flex', marginLeft: '10px' }}>
                                        {op.optionImage !== ''
                                          ? (
                                            <img src={op.optionImage} width='64%' height='auto' alt='optionImage' />
                                          )
                                          : ''}
                                        <Divider />
                                      </div>
                                    </div>
                                  ))}
                                </RadioGroup>

                              </div>
                            </div>
                          </div>
                        </Paper>
                      </div>
                    ))}
                  </Grid>
                  <Grid>
                    <br />
                    <div style={{ display: 'flex' }}>
                      <Button variant='contained' color='primary' onClick={() => submitResponse()}>
                        Submit
                      </Button>
                    </div>
                    <br />

                    <br />

                  </Grid>
                </div>
              )
              : (
                <div>
                  <Typography variant='body1'>Form submitted</Typography>
                  <Typography variant='body2'>Thanks for submiting form</Typography>

                  <Button onClick={() => reloadForAnotherResponse()}>Submit another response</Button>
                </div>
              )}

          </Grid>

        </Grid>

        {/* //TODO: Add a footer here */}
      </div>
    </div>
  )
}

export default UserView

// const FormControlLabelWrapper = props => {
//   const { radioButton, ...labelProps } = props;
//   return (
//     <FormControlLabel
//       control={<Radio />}
//       label={"Radio " + props.value + props.jIndex}
//       {...labelProps}
//     />
//   );
// };
