const router = require('express').Router();
const appRealmService = require('./appRealmService');
const realmUsersService = require('../realmUsers/realmUsersService');

router.get('/dashboard', async (req, res) => {
    try {
        let realms = await appRealmService.getAllAppRealms(req, res);
        let realmUsers = await realmUsersService.getAllRealmUsers(req, res);
        
        // Organize realm users by realm
        let realmsWithUsers = realms.map(realm => {
            return {
                ...realm,
                users: realmUsers.filter(user => user.realmId == realm.id)
            };
        });
        
        return res.render('realms', { 
            realms: realmsWithUsers,
            title: 'Realms Management'
        });
    } catch (err) {
        switch (err.status) {
            case 500:
            case 502: return res.status(500).json({ message: "could not reach DB" });   
        }
    }
});

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
    try {
        const { name, description}=req.body;
        let realm = {"name":name,"description":description};
        if(!realm) return res.status(400).json({message : "realm data is required"});
        await appRealmService.addAppRealm(req,res,realm);
        res.redirect('/realms/dashboard');
    } catch (err) {
        res.status(500).json({ message: "Error creating realm" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description} = req.body;
        let realm = {"id":id,"name":name,"description":description};
        await appRealmService.updateAppRealm(req,res,realm);
        res.redirect('/realms/dashboard');
    } catch (err) {
        res.status(500).json({ message: "Error updating realm" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await appRealmService.deleteAppRealm(req,res,id);
        res.redirect('/realms/dashboard');
    } catch (err) {
        res.status(500).json({ message: "Error deleting realm" });
    }
});


module.exports = router;