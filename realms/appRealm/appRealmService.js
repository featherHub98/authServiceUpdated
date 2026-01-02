const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../../db.json');
const AppRealmExeption = require('../../exeptions/AppRealmException');

const getAllAppRealms = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        console.log("the db file",data);
        
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).realms;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AppRealmExeption("realms not found");
        }

        return db;
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AppRealmExeption) {
            res.status(502).json({ message: "realms not found" });
        }
    }
}

const getAppRealmById = async (req, res, id) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).realms;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AppRealmExeption("realms not found");
        }
        const realm = db.find(realm => realm.id == id);
        res.status(200).json(realm);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AppRealmExeption) {
            res.status(502).json({ message: "realms not found" });
        }
    }
}

const addAppRealm = async (req, res, realm) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        throw new Error('no such file or directory');
    }
    let db = JSON.parse(data);
    let realms = db.realms || [];
    const newrealm = {
        id: db.realms.length > 0 ? parseInt(db.realms[db.realms.length - 1].id) + 1 : 1,
        name: realm.name,
        description: realm.description
    }
    realms.push(newrealm);
    db.realms = realms;
    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
}

const updateAppRealm = async (req, res, realm) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        throw new Error('no such file or directory');
    }

    let db = JSON.parse(data);

    const realmIndex = db.realms.findIndex(r => r.id == realm.id);
    db.realms[realmIndex] = { ...db.realms[realmIndex], ...realm };

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
}

const deleteAppRealm = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        throw new Error('no such file or directory');
    }
    
    let db = JSON.parse(data);
    
    const realms = db.realms || [];
    const filteredRealms = realms.filter(realm => realm.id != id);
    db.realms = filteredRealms;

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
}

module.exports = { getAllAppRealms, getAppRealmById, addAppRealm, deleteAppRealm, updateAppRealm };

