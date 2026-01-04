const fs = require('fs').promises;
const path = require('path');
const pathDb = path.join(__dirname, '../db.json');
const hashService = require('../services/hashPasswordService');
const jwt = require('jsonwebtoken')
const jwtService = require('../services/jwtService');





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

        return db;
    } catch (err) {
        if (err.code = 'ENOENT') {
            res.status(500).json({ message: "could not reach DB" });
        } else if (err instanceof AuthUserExeption) {
            res.status(502).json({ message: "users not found" });
        }
    }
}

const getUserById = async (req,res,id) => {
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
    res.status(201).redirect('/auth/users');
}

const updateUser = async (req, res, id) => {
    let data = await fs.readFile(pathDb, 'utf-8');
    if (!data) {
        res.status(500).json({ message: 'no such file or directory' });
    }

    let db = JSON.parse(data);
 const userIndex = db.authUsers.findIndex(user => user.id == id);
        
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
          const updateData = { ...req.body };
           if (typeof updateData.roles === 'string') {
            updateData.roles = updateData.roles.split(',').map(role => role.trim());
        }
          
     db.authUsers[userIndex] = { 
            ...db.authUsers[userIndex], 
            ...updateData 
        };

    await fs.writeFile(pathDb, JSON.stringify(db, null, 2))
    res.status(201).redirect('/auth/users');
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
    res.status(201).redirect('/auth/users');
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
        

        const user = db.authUsers.find(user => user.email === email);
        
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
        return response
        
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser, loginUser };