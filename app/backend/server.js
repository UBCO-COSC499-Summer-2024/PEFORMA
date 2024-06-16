const express = require('express');
const cors = require('cors');
const { testDB } = require('./config/db.js');
const courseRoutes = require('./routes/courses.js');  

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
testDB();

app.get('/', (req, res) => {
    res.send('Welcome to the Home Page!');
});

app.use('/api/courses', courseRoutes); // Mount course routes

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
