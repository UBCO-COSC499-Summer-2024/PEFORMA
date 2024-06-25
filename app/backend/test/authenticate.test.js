/*
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authenticateRouter = require('../Manager/authenticate');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', authenticateRouter);

describe('POST /api/authenticate', () => {
    it('should authenticate successfully', async () => {
        const response = await request(app)
            .post('/api/authenticate')
            .send({ email: '15601654187@163.com', password: 'p@55word' });

        expect(response.status).toBe(200);
        // Add more assertions based on the response structure
    });

    it('should handle authentication error', async () => {
        const authenticateRouterMock = jest.spyOn(authenticateRouter, 'post').mockImplementation((req, res) => {
            res.status(500).send('Internal server error');
        });

        const response = await request(app)
            .post('/api/authenticate')
            .send({ email: 'test@example.com', password: 'password' });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal server error');

        authenticateRouterMock.mockRestore();
    });
});
*/
// __tests__/authenticate.test.js
const express = require('express');
const request = require('supertest');
const authenticate = require('../Manager/authenticate');
const jwtManager = require('../Manager/jwtManager');

jest.mock('../Manager/jwtManager'); // Mock jwtManager

const app = express();

app.use(express.json());

// 使用 authenticate 中间件
app.get('/protected', authenticate, (req, res) => {
    res.status(200).json({ message: 'Protected route accessed', user: req.user });
});

describe('Authenticate Middleware', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Authentication token required' });
    });

    it('should return 401 if token is invalid', async () => {
        jwtManager.verifyToken.mockReturnValue(null);

        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'invalidtoken');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid or expired token' });
    });

    it('should call next if token is valid', async () => {
        const mockUser = { id: 1, name: 'Test User' };
        jwtManager.verifyToken.mockReturnValue(mockUser);

        const response = await request(app)
            .get('/protected')
            .set('Authorization', 'validtoken');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Protected route accessed', user: mockUser });
    });

});
