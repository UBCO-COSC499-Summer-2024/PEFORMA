
const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const bcrypt = require('bcrypt');

const encry = async (plain_password) => {
    try{
        const salt = genSalt();
        hashed_password = bcrypt.hashSync(plain_password,salt);
        return hashed_password;
    }catch(err){
        console.log(`Error appear when encrypting password.\nDetails:\n${err}`);
        throw err;
    }
}

router.post('/hashpassword',async (req,res ) => {
    const get_password = password;
    const hashed = encry(get_password);
    return res.json({hashed_password : hashed});
});