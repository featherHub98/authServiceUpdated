const router = require('express').Router();
const authUserService = require('./authUsersService');
const jwtService = require('../services/jwtService');

router.get('/users', async (req, res) => {
    try {
        let users = await authUserService.getAllUsers(req, res);
        return res.json(users);
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

router.get('/users/:id', async (req, res) => {


});

router.post('/users', async (req, res) => {
    const { username,email,password,roles}=req.body;
    let user = {"username":username,"email":email,"password":password,"roles":roles};
    if(!user) res.status(400).json({message : "user data is required"});
    await authUserService.addUser(req,res,user);
});

router.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    await authUserService.updateUser(req,res,id);
});

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    await authUserService.deleteUser(req,res,id);
});
router.post('/login', async (req, res) => {
    
    try {
        let user = await authUserService.loginUser(req, res);
        return res.json({ user });
    } catch (error) {
        
    }})
 router.post('/refresh', async (req, res) => {
    
    try {
        let {refreshToken} = req.body
        console.log(refreshToken);
        
        let data =await jwtService.generateTokenUsingRefreshToken(refreshToken)
        
        
        return res.json({ data });
    } catch (error) {
        
    }})

module.exports = router;