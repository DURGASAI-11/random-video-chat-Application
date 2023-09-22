import axios from 'axios'

module.exports.updateUser = async (userId, countrySelect, categorySelect) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/api/v1/admin/updateUserModel/${userId}`,
      {
        category: categorySelect,
        country: countrySelect,
      },
    )
    if (response.data.status === 'success') {
      console.log('user data updated successfully')
      window.location.href =
        'http://localhost:3000/api/v1/views/meetRandomPeople'
    }
  } catch (err) {
    console.log(err + 'axios mistake')
  }
}
