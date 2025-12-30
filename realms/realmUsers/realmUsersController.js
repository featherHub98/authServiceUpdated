const router = require('express').Router();
const authUserService = require('./realmUsersService');
const jwtService = require('../../services/jwtService');

router.get('/get', async (req, res) => {
    try {
        await authUserService.getAllUsers(req, res);
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    await authUserService.getUserById(req, res, id);
});

router.post('/', async (req, res) => {
    const { email,username,password,roles,realmId}=req.body;
    let user = {"email":email,"username":username,"password":password,"roles":roles,"realmId":realmId};
    if(!user) res.status(400).json({message : "user data is required"});
    await authUserService.addUser(req,res,user);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    await authUserService.updateUser(req,res,id);
});

router.delete('/:id', async (req, res) => {
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
         let type = "realmUser";
        let data =await jwtService.generateTokenUsingRefreshToken(refreshToken,type)
        
        
        return res.json({ data });
    } catch (error) {
        
    }})

module.exports = router;