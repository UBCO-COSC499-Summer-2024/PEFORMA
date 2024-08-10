const benchmarkService = require('../../services/Performance/benchmark'); 

async function getBenchmark(req, res) {
    try {
        const benchmark = await benchmarkService.getBenchmark();//Execute service
        res.json(benchmark);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).json({ error: 'An error occurred' });
    }
}

module.exports = {
    getBenchmark
}
