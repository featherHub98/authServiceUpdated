const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../db.json');
const hashService = require('../services/hashPasswordService');
const jwt = require('jsonwebtoken')
let jwtSecret = process.env.JWT_SECRET;
let refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;





const getAllUsers = async (req, res) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).authUsers;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AuthUserExeption("users not found");
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

const getUserById = async (id) => {
    try {
        let data = await fs.readFile(pathDb, 'utf-8');
        if (!data) {
            throw new Error('ENOENT: no such file or directory');
        }
        let db = JSON.parse(data).authUsers;
        if (db.length === 0) {
            return [];
        } else if (!db) {
            throw new AuthUserExeption("users not found");
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

const addUser = async (req, res, user) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    let db = JSON.parse(data);
    let authUsers = db.authUsers || [];
    const hashedPassword = await hashService.hashPassword(user.password);
    const newUser = {
        id: parseInt(db.authUsers[db.authUsers.length - 1].id) + 1,
        email: user.email,
        password: hashedPassword,
        username: user.username,
        roles: user.roles
    }
    authUsers.push(newUser);
    db.authUsers = authUsers;
    await fs.writeFile(pathDb, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'user created successfully' });
}

const updateUser = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }

    let db = JSON.parse(data);

    const userIndex = db.authUsers.findIndex(user => user.id == id);
    db.authUsers[userIndex] = { ...db.authUsers[userIndex], ...req.body.user };

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2))
    res.status(201).json({ message: 'user updated successfully' });
}

const deleteUser = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }
    
    let db = JSON.parse(data);
    
    const users = db.authUsers || [];
    const filteredUsers = users.filter(user => user.id != id);
    db.authUsers = filteredUsers;

    await fs.writeFile('db.json', JSON.stringify(db, null, 2))
    res.status(201).json({ message: 'user deleted successfully' });
}
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log("Login attempt:", username, password);

        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
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

        const user = db.authUsers.find(user => user.username === username);
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        const isPasswordValid = hashService.comparePassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }
        
        console.log("User found:", user.username);

        const payload = { 
            id: user.id, 
            username: user.username 
        };
        
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, refreshTokenSecret, { expiresIn: '7d' });

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            refreshToken: refreshToken,
            user: {
                id: user.id,
                username: user.username
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser, loginUser };