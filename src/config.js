import dotenv from 'dotenv'
dotenv.config()

export default {
  development: {
    CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    CLIENT_SECRET: process.env.REACT_APP_CLIENT_SECRET,
    REDIRECT_URI: process.env.REACT_APP_REDIRECT_URI,
    BASE_URL: process.env.REACT_APP_BASE_URL,
    REACT_APP_SECRET_TOKEN: process.env.REACT_APP_SECRET_TOKEN
  }
}
