const router = require('express').Router();
const appRealmService = require('./appRealmService');


router.get('/', async (req, res) => {
    try {
        let realms = await appRealmService.getAllAppRealms(req, res);
        return res.json(realms);
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
        let realms = await appRealmService.getAppRealmById(req, res, id);
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
    await appRealmService.addAppRealm(req,res,realm);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description} = req.body;
    let realm = {"id":id,"name":name,"description":description};
    await appRealmService.updateAppRealm(req,res,realm);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    await appRealmService.deleteAppRealm(req,res,id);
});


module.exports = router;