const axios = require('axios')

let accessToken = null
let tokenExpiry = null

exports.getAccessToken = async () => {

    if (accessToken && tokenExpiry > Date.now()) {
        return accessToken
    }

    try {

        const response = await axios.post(
            process.env.SN_TOKEN_URL,
            new URLSearchParams({
                grant_type: 'password',
                client_id: process.env.SN_CLIENT_ID,
                client_secret: process.env.SN_CLIENT_SECRET,
                username: process.env.SN_USERNAME,
                password: process.env.SN_PASSWORD
            })
        )

        accessToken = response.data.access_token
        tokenExpiry = Date.now() + (response.data.expires_in * 1000)

        return accessToken

    } catch (err) {
        console.error("OAuth Error:", err.response?.data || err.message)
        throw err
    }
}