const jwt = require('jsonwebtoken');
const { type } = require('os');
const path = require('path');
const fs = require('fs').promises;
const pathDb = path.join(__dirname, '../db.json');

const getRealmData = async(tokenUser,type) => {
    let data = await fs.readFile(pathDb, 'utf-8');
         if (!data) {
        throw new Error('ENOENT: no such file or directory');
            }
    let db = JSON.parse(data).realms;
    let users
    if (type==="authUser"){
          users = JSON.parse(data).authUsers;
     
    } else if (type==="realmUser"){
          users = JSON.parse(data).realmUsers;
     
    }
    let user =Object.values(users).find(u=> u.email== tokenUser.email );
    console.log("the user ",user);
    
    let realm = db.find(r => user.realmId === r.id);
    let secrets = JSON.parse(data).secrets;
    let realmData = Object.values(secrets).find(s=> s.realmId== user.realmId  );
    return {realmData,user};
}

 const verifyAccessToken = async(token) => {
     try {
        let tokenUser = jwt.decode(token);
        let data = await getRealmData(tokenUser);
         const decoded = jwt.verify(token,data.realmData.realmSecret);
            return decoded;
        } catch (err) {
            throw new Error('Invalid token');
        }
    };

const verifyRefreshToken = async(token,type) => {
   
         try {
            let tokenUser = jwt.decode(token);
        let data = await getRealmData(tokenUser,type);
        console.log("the data ",data);
        
        return jwt.verify(token,data.realmData.realmSecret); 
       } catch (err) {
           throw new Error('Invalid token');
       }
   };

const generateRealmUserToken = async(user) => {
    
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        throw new Error('ENOENT: no such file or directory');
    }
    let db = JSON.parse(data).realms;
    let realm = db.find(r => user.realmId === r.id);
    let secrets = JSON.parse(data).secrets;
    let realmData = Object.values(secrets).find(s=> s.realmId== user.realmId  );  
    const payload = {  
        email: user.email,
        username: user.username,
        roles: user.roles,
        realm: realm.name,
        allowedRealms: user.allowedRealms,
        allowedDomains: user.allowedDomains
    }
   
    
    const accessToken = jwt.sign(payload, realmData.realmSecret, { expiresIn: '10m', issuer: process.env.ISSUER });
    const refreshToken = jwt.sign({email:user.email,username: user.username,type:type}, realmData.realmSecret, { expiresIn: '1d' });
    console.log("generated tokens ",accessToken,refreshToken);
    console.log("user found : ",user);
    return { accessToken: accessToken, refreshToken: refreshToken };
    
}

const generateTokenUsingRefreshToken = async (refreshToken,type) => {
    
    let isVerified = verifyRefreshToken(refreshToken,type);
    if(!isVerified){
        throw new Error('Invalid refresh token');
    }

     let tokenUser = jwt.decode(refreshToken);
     let data = await getRealmData(tokenUser,type);
     let newTokens = await generateRealmUserToken(data.user);
     console.log("new tokens ",newTokens);
     return newTokens;
     
    
}
 
module.exports = {
    verifyAccessToken,
    verifyRefreshToken,
    generateRealmUserToken,
    generateTokenUsingRefreshToken
}