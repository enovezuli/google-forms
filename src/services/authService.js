import axios from 'axios'
import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'

// const API_URL = "http://192.168.225.23:3002/api/user/"
const API_URL = 'http://localhost:3002/api/user/'
const tokenShit = 'ced10b32b163cfc13a7c4a82c847098a30c8f03da1e722601f83832dd7deb7e310eedf4fc02197ef13dc721af88929f217ee1237e676680e23b8843c79d00307'

export default {

  isAuthenticated () {
    const token = localStorage.getItem('userTicket')
    if (token) {
      // try {
      //   jwt.verify(token, tokenShit)
      //   return true
      // } catch (error) {
      //   console.error('Error in isAuthenticated:', error)
      //   localStorage.removeItem('userTicket')
      //   return false
      // }
      return true
    } else {
      return false
    }
  },

  authenticate (cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },

  signout (cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  },

  loginWithGoogle (res) {
    var data = {
      name: res.profileObj.name,
      email: res.profileObj.email,
      image: res.profileObj.imageUrl
    }

    return axios
      .post(API_URL + 'login', data)
      .then(response => {
        console.log(response.data)
        if (response.data.accessToken) {
          localStorage.setItem('userTicket', JSON.stringify(response.data.accessToken))
        }
        return response.data
      })
  },

  loginAsGuest () {
    var userData = {
      name: 'Guest User',
      id: '65d2ab748c892a75983aac13',
      email: 'coolboy69@gg.com'
    }

    const accessToken = jwt.sign(userData, tokenShit)
    localStorage.setItem('userTicket', JSON.stringify(accessToken))
    return accessToken
  },

  logout () {
    localStorage.removeItem('userTicket')
  },

  getCurrentUser () {
    return jwtDecode(localStorage.getItem('userTicket'))
  }
}
