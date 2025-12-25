const router = require('express').Router();
const authUserService = require('./authUsersService');


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

});

router.delete('/users/:id', async (req, res) => {

});

router.put('/users/:id', async (req, res) => {

});


module.exports = router;