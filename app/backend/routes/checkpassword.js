
const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const bcrypt = require('bcrypt');

const uncry = async (entered,stored) => {
    try{
        return bcrypt.compareSync(entered,stored);
    }catch(err){
        console.log(`Error appear when checking password.\nDetails:\n${err}`);
        throw err;
    }
}

router.post('/checkpassword',async (req,res ) => {
    const get_password = password;
    const target_store = stored;
    return res.json({
        get: get_password,
        stored: target_store,
        success : uncry(get_password,target_store)});
});

module.exports = { uncry };