const axios = require('axios')
const jwt = require('jsonwebtoken')
const {
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_PURL,
  JWT_SECRET,
} = process.env
const { User } = require('../models/userModel')

module.exports.getLoginPage = async (req, res) => {
  try {
    const linkedinAuthUrl =
      'https://www.linkedin.com/oauth/v2/authorization' +
      `?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${process.env.LINKEDIN_PURL}` +
      `&scope=openid%20profile%20email`

    res.redirect(linkedinAuthUrl)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error initiating LinkedIn authentication' })
  }
}

exports.linkedinCallback = async (req, res) => {
  try {
    const { code } = req.query // authorization code

    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: code,
          client_id: LINKEDIN_CLIENT_ID,
          client_secret: LINKEDIN_CLIENT_SECRET,
          redirect_uri: LINKEDIN_PURL,
        },
      },
    )

    const accessToken = tokenResponse.data.access_token

    // request to LinkedIn's API to get the user's info
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 200) {
      const linkedinUserData = response.data

      // Check if the user is already registered in your MongoDB
      const existingUser = await User.findOne({
        linkedinId: linkedinUserData.sub,
      })
      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      }

      if (existingUser) {
        let token = generateJWT(existingUser)
        res.cookie('jwt', token, cookieOptions)
        if (existingUser.country != null && existingUser.role === 'user') {
          return res.redirect(
            `http://localhost:3000/api/v1/views/meetRandomPeople`,
          )
        } else if (existingUser.role === 'admin') {
          return res.redirect(`http://localhost:3000/api/v1/views/AdminPage`)
        }
      } else {
        const newUser = await User.create({
          linkedinId: linkedinUserData.sub,
          name: linkedinUserData.name,
          email: linkedinUserData.email,
        })

        if (newUser) {
          let token = generateJWT(newUser)
          res.cookie('jwt', token, cookieOptions)
          return res.redirect(
            `http://localhost:3000/api/v1/views/userSelections`,
          )
        }
      }
    } else {
      console.error('LinkedIn API Error - Status:', response.status)
      return res
        .status(response.status)
        .json({ message: 'Error with LinkedIn API' })
    }
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: 'Error authenticating with LinkedIn' })
  }
}

function generateJWT(user) {
  const token = jwt.sign({ user }, JWT_SECRET, { expiresIn: '30d' })
  return token
}
