import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Product API Endpoints', () => {
    
    // Test Case 1: Fetching all products
    it('should return a 200 OK and an array of products when GET /api/products is called', async () => {
        const response = await request(app).get('/api/products');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});