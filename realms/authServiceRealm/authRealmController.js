const router = require('express').Router();
const authRealmService = require('./authRealmService');

router.get('/', async (req, res) => {
    try {
        let realms = await authRealmService.getAuthRealm(req, res);
        return res.json(realms);
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

router.post('/', async (req, res) => {
    const { name, description}=req.body;
    let realm = {"name":name,"description":description};
    if(!realm) res.status(400).json({message : "realm data is required"});
    await authRealmService.addAuthRealm(req,res,realm);
});

module.exports = router;