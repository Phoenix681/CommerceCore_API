import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js'; 

describe('User API Validation Endpoints', () => {

    // Test 1: Trying to register with a fake email
    it('should block registration with an invalid email and return status 400', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                name: 'Test User',
                email: 'not-an-email',
                password: 'password123'
            });

        expect(response.statusCode).toBe(400);
        
        expect(response.body.errors).toBeDefined();
    });

    // Test 2: Trying to login without a password
    it('should block login attempts with missing fields and return status 400', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'test@example.com'
                //No Password
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});