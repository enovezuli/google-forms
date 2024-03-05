import axios from 'axios'

export default {
  uploadImage (data) {
    return axios
      .post('http://localhost:3002/', data, {
      }).then(res => {
        console.log(res.data)

        return res.data
      })
  }
}
