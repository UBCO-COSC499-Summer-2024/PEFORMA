const request = require('supertest');
const express = require('express');
const resetPasswordRouter = require('../../app/backend/routes/resetPassword');
const path = require('path');

// Load environment variables from .env file in app/backend directory
require('dotenv').config({ path: path.resolve(__dirname, '../../app/backend/.env') });

// Polyfill for setImmediate
global.setImmediate = (callback) => setTimeout(callback, 0);

describe('POST /api/reset-password', () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use('/api', resetPasswordRouter);
        console.log("GMAIL_USER:", process.env.GMAIL_USER);
        console.log("GMAIL_PASS:", process.env.GMAIL_PASS);
    });

    it('should send a reset password email', async () => {
        const response = await request(app)
            .post('/api/reset-password')
            .send({ email: 'test@example.com' });

        console.log('Response status:', response.status);
        console.log('Response body:', response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Email sent successfully');
    }, 15000); // Increasing timeout to 15000 ms

    it('should handle errors when sending email', async () => {
        const response = await request(app)
            .post('/api/reset-password')
            .send({ email: 'invalid-email' }); // Use an invalid email to trigger an error

        console.log('Response status:', response.status);
        console.log('Response body:', response.body);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error sending email');
    }, 15000); // Increasing timeout to 15000 ms
});
