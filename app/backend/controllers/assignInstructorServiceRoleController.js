const express = require('express');
const assignServiceRoleService = require('../services/assignServiceRole');

async function assignServiceRole (req, res) {
    const { profileId, serviceRole, year, division } = req.body;
    try {
        const result = await assignServiceRoleService.assignServiceRole(profileId, serviceRole, year, division);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error assigning service role:', error.message);
        res.status(500).send('Error assigning service role');
    }
};

module.exports = {
    assignServiceRole
}