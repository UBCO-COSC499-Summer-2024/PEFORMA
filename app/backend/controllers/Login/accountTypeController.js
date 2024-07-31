const accountTypeService = require('../../services/Login/accountType');
async function queryAccountType(req,res){
    const accountId = parseInt(req.params.accountId, 10);
    try {
      const accountTypes = await accountTypeService.queryAccountType(accountId);
      res.json({ success: true, accountTypes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
};
  
module.exports = {
    queryAccountType
}