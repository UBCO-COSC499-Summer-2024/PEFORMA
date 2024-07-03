const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const courseHistoryRoutes = require('../../app/backend/routes/courseHistoryRoutes');
const courseHistoryController = require('../../app/backend/controllers/courseHistoryController');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/courseHistory', courseHistoryRoutes);

// Mock the entire courseHistoryController
jest.mock('../controllers/courseHistoryController', () => ({
    getCourseHistory: jest.fn()
}));

describe('GET /api/courseHistory', () => {
    it('should get course history data successfully', async () => {
        const mockProfile = {
            currentPage: 1,
            perPage: 10,
            courseID: 1,
            entryCount: 2,
            courseCode: 'COSC 111',
            courseName: 'Computer Programming I',
            courseDescription: 'Introduction to the design, implementation, and understanding of computer programs. Topics include problem solving, algorithm design, and data and procedural abstraction, with emphasis on the development of working programs.',
            division: 'Computer Science',
            avgScore: 24,
            history: [
                {
                    instructorID: 2,
                    instructorName: 'Jane Allison Smith',
                    session: '2024S',
                    term: '2',
                    score: 28.81
                },
                {
                    instructorID: 1,
                    instructorName: 'John Doe',
                    session: '2023W',
                    term: '1',
                    score: 19.15
                }
            ]
        };

        courseHistoryController.getCourseHistory.mockImplementation((req, res) => res.status(200).json(mockProfile));

        const courseId = 1;  // 
        const response = await request(app).get(`/api/courseHistory?courseId=${courseId}`);
        console.log(response.body); 
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProfile);
    });

    it('should handle errors in getting course history', async () => {
        courseHistoryController.getCourseHistory.mockImplementation((req, res) => {
            res.status(500).json({ error: 'Failed to fetch course history' });
        });

        const response = await request(app).get('/api/courseHistory?courseId=1');
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Failed to fetch course history');
    });
});
