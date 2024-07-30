const queryAccountService = require('../../services/Login/queryAccount');

async function queryAccount(req,res){
    try{
        const data = await queryAccountService.queryAccount();
        res.send(data);
    }
    catch(error){
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }

}
module.exports = {
    queryAccount
}