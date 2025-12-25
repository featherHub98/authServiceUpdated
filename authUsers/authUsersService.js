const fs=require('fs').promises;
const path=require('path');
const pathDb=path.join(__dirname,'../db.json');

const getAllUsers = async (req,res) => {
    try{
        let data=await fs.readFile(pathDb,'utf-8');
        if(!data){
            throw new Error('ENOENT: no such file or directory');
        }
        let db=JSON.parse(data).authUsers;
        if(db.length===0){
            return [];
        }else if(!db){
            throw new AuthUserExeption("users not found");
        }

        res.status(200).json(db);
    }catch(err){
        if(err.code = 'ENOENT'){
            res.status(500).json({message : "could not reach DB"});
        }else if(err instanceof AuthUserExeption){
            res.status(502).json({message: "users not found"});
        }
    }
}

const getUserById = (id) => {

}

const addUser = (user) => {

}

const updateUser = (id, user) => {

}

const deleteUser = (id) => {

}

module.exports = { getAllUsers, getUserById, addUser, deleteUser, updateUser };

