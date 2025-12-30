const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../../db.json');

const getAllSecrets = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        console.log("the db file",data);
        
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).secrets;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new SecretExeption("secrets not found");
        }

        res.status(200).json(db);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof SecretExeption) {
            res.status(502).json({ message: "realms not found" });
        }
    }
}

const getSecretById = async (req, res, id) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).secrets;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new SecretExeption("secrets not found");
        }
        const secret = db.find(secret => secret.realmId == id);
        res.status(200).json(secret);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof SecretExeption) {
            res.status(502).json({ message: "secrets not found" });
        }
    }
}

const addSecret = async (req, res, secret) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    let db = JSON.parse(data);
    let secrets = db.secrets || [];
    const newSecret = {
        realmId: db.secrets.length > 0 ? parseInt(db.secrets[db.secrets.length - 1].realmId) + 1 : 1,
        realmSecret: secret.realmSecret
    }
    secrets.push(newSecret);
    db.secrets = secrets;
    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'secret created successfully' });
}

const updateSecret = async (req, res, secret) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }

    let db = JSON.parse(data);

    const secretIndex = db.secrets.findIndex(secret => secret.realmId == secret.realmId);
    db.secrets[secretIndex] = { ...db.secrets[secretIndex], ...secret };

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2))
    res.status(201).json({ message: 'secret updated successfully' });
}



module.exports = { getAllSecrets, getSecretById, addSecret, updateSecret };

