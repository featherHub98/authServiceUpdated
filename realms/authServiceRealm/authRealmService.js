const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../db.json');

const getAuthRealm = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).authRealms;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AuthRealmException("realm not found");
        }

        res.status(200).json(db);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthRealmException) {
            res.status(502).json({ message: "realms not found" });
        }
    }
}

const addAuthRealm = async (req, res, realm) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    let db = JSON.parse(data);
    let realms = db.authRealms || [];
    const newrealm = {
        id: parseInt(db.authRealms[db.authRealms.length - 1].id) + 1,
        name: realm.name,
        description: realm.description
    }
    realms.push(newrealm);
    db.authRealms = realms;
    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'realm created successfully' });
}

module.exports = { getAuthRealm, addAuthRealm };

