import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const secretKey = 'Changethissecret';


export function createTokenFromData(jsonData, options = {}) {
    try {
        const token = sign(jsonData, secretKey, options);
        return token;
    } catch (error) {
        console.log('Error: ' + error);
        return null;
    }
}

export function checkToken(token) {
    const decodeToken = verify(token, secretKey);
    return decodeToken;
}
