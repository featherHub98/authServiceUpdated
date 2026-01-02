const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../../db.json');
const hashService = require('../../services/hashPasswordService');
const jwt = require('jsonwebtoken')
const jwtService = require('../../services/jwtService');





const getAllUsers = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).realmUsers;
        console.log("this is the user data ", db);
        
        if (!db) {
            return res.status(404).json({ message: "users not found" });
        }

        res.status(200).json(db);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthUserExeption) {
            res.status(502).json({ message: "users not found" });
        }
    }
}

const getAllRealmUsers = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).realmUsers;
        
        if (!db) {
            return [];
        }

        return db;
    } catch (err) {
        return [];
    }
}

const getUserById = async (req, res, id) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).realmUsers;
        const user = db.find(u => u.id == id);
        
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        
        res.status(200).json(user);
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthUserExeption) {
            res.status(502).json({ message: "users not found" });
        }
    }
}

const addUser = async (req, res, user) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    let db = JSON.parse(data);
    let realmUsers = db.realmUsers || [];
    const hashedPassword = await hashService.hashPassword(user.password);

    const newUser = {
        id: db.realmUsers.length > 0 ? parseInt(db.realmUsers[db.realmUsers.length - 1].id) + 1 : 1,
        email: user.email,
        username: user.username,
        password: hashedPassword,
        roles: user.roles,
        realmId: user.realmId
    }
    realmUsers.push(newUser);
    db.realmUsers = realmUsers;
    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'user created successfully' });
}

const updateUser = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }

    let db = JSON.parse(data);
    console.log("Updating user with ID:", req.body);
    
    const userIndex = db.realmUsers.findIndex(user => user.id == id);
    db.realmUsers[userIndex] = { ...db.realmUsers[userIndex], ...req.body };

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2))
    res.status(201).json({ message: 'user updated successfully' });
}

const deleteUser = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    
    let db = JSON.parse(data);
    
    const users = db.realmUsers || [];
    const filteredUsers = users.filter(user => user.id != id);
    db.realmUsers = filteredUsers;

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2))
    res.status(201).json({ message: 'user deleted successfully' });
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log("Login attempt:", email, password);

        if (!email || !password) {
            return res.status(400).json({ 
                error: 'email and password are required' 
            });
        }

        let data;
        try {
            data = await fs.readFile(pathDb, 'utf-8');
        } catch (error) {
            console.error('Database read error:', error);
            return res.status(500).json({ 
                error: 'Database error' 
            });
        }

        let db;
        try {
            db = JSON.parse(data);
        } catch (error) {
            return res.status(500).json({ 
                error: 'Database corrupted' 
            });
        }

        const user = db.realmUsers.find(user => user.email === email);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }

        const isPasswordValid = hashService.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid email or password' 
            });
        }
        
        console.log("User found:", user.email);
        
        
        const token = await jwtService.generateRealmUserToken(user);
        console.log("generated token", token);
        
        let response = {
            token: token.accessToken,
            refreshToken: token.refreshToken,
        }
        return res.status(200).json({
            response
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = { getAllUsers, getAllRealmUsers, getUserById, addUser, deleteUser, updateUser, loginUser };