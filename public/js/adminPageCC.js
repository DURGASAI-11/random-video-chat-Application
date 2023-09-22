import axios from 'axios'

module.exports.adminPageCate = async (category) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/v1/admin/adminCate',
      {
        category: category,
      },
    )
    if (response.data.status === 'success') {
      console.log('category added successfully')
      window.location.href = 'http://localhost:3000/api/v1/views/AdminPage'
    }
  } catch (err) {
    console.log(err + 'axios mistake')
  }
}

module.exports.adminPageCoun = async (country) => {
  try {
    console.log(country)
    const response = await axios.post(
      'http://localhost:3000/api/v1/admin/adminCoun',
      {
        country: country,
      },
    )
    console.log(response.data)
    if (response.data.status === 'success') {
      console.log('country added successfully')
      window.location.href = 'http://localhost:3000/api/v1/views/AdminPage'
    }
  } catch (err) {
    console.log(err)
  }
}
