const router = require('express').Router();
const secretService = require('./secretService');


router.get('/', async (req, res) => {
    try {
        let secrets = await secretService.getAllSecrets(req, res);
        return res.json(secrets);
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        let secrets = await secretService.getSecretById(req, res, id);
        return res.json(secrets);
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

router.post('/', async (req, res) => {
    const {realmSecret}=req.body;
    let secret = {"realmSecret":realmSecret};
    if(!secret) res.status(400).json({message : "secret data is required"});
    await secretService.addSecret(req,res,secret);
});

router.put('/:id', async (req, res) => {
    const realmId = req.params.id;
       const {realmSecret}=req.body;
    let secret = {"realmId":realmId,"realmSecret":realmSecret};
    await secretService.updateSecret(req,res,secret);
});



module.exports = router;