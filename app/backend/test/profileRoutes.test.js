const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const profileRoutes = require('../routes/profileRoutes');
const { getUserProfile } = require('../controllers/profileController');

// 创建Express应用实例
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/instructorProfile', profileRoutes);

// Mock the getUserProfile controller function
jest.mock('../controllers/profileController', () => ({
    getUserProfile: jest.fn()
}));

describe('GET /api/instructorProfile', () => {

    it('should get profile data successfully', async () => {
        const mockProfile = { name: 'John Doe', email: 'john.doe@example.com' };
        getUserProfile.mockImplementation((req, res) => {
            res.status(200).json(mockProfile);
        });

        const response = await request(app).get('/api/instructorProfile');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProfile);
    });

    it('should handle errors in getting profile data', async () => {
        getUserProfile.mockImplementation((req, res) => {
            res.status(500).json({ error: 'Failed to fetch user profile' });
        });

        const response = await request(app).get('/api/instructorProfile');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Failed to fetch user profile');
    });
});
