const express = require('express');
const instructorFetchService = require('../services/instructorFetch');
async function instructorFetch (req, res) {
    try {
        const result = await instructorFetchService.instructorFetch();
        res.send(result);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    instructorFetch
}
