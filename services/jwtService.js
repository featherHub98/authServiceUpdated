const jwt = require('jsonwebtoken')

 const verifyAccessToken = (token) => {
     try {
         const decoded = jwt.verify(token, process.env['SECRET-ACCESS']);
            return decoded;
        } catch (err) {
            throw new Error('Invalid token');
        }
    };

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env['SECRET-REFRESH']);
           return decoded;
       } catch (err) {
           throw new Error('Invalid token');
       }
   };