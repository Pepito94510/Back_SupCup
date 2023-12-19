const jwt = require('jsonwebtoken');


function createTokenFromData(jsonData, options = {}) {
    try {
        const secretKey = process.env.SECRETKEY;
        const token = jwt.sign(jsonData, secretKey, options)
        return token;
    } catch (error) {
        console.lof('Error: ' + error);
        return null;
    }
}

function checkToken(token) {
        const secretKey = process.env.SECRETKEY;
        const decodeToken = jwt.verify(token, secretKey);
        return decodeToken;
}

module.exports = { createTokenFromData, checkToken }