// __tests__/authRoutes.test.js
const request = require('supertest');
const app = require('../server'); // Make sure the server is correctly exported
const { User } = require('../models'); // Your User model to interact with the database
const jwt = require('jsonwebtoken');

// Dummy data for testing
const testUser = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'password123',
};

let token;

beforeAll(async () => {
  // Creating a test user before running tests
  await User.create(testUser);

  // Logging in the user to get a token for authentication
  const response = await request(app)
    .post('/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  token = response.body.token; // Save the token to use in protected routes
});

afterAll(async () => {
  // Clean up the test user after tests are done
  await User.destroy({ where: { email: testUser.email } });
});

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'newpassword123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user and return a token', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('GET /auth/profile', () => {
    it('should return profile data for an authenticated user', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`); // Pass the token for authentication

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', testUser.username);
    });

    it('should return 401 for unauthenticated users', async () => {
      const response = await request(app).get('/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('PUT /auth/profile', () => {
    it('should update the user profile for an authenticated user', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Name');
    });

    it('should return 401 for unauthenticated users', async () => {
      const response = await request(app)
        .put('/auth/profile')
        .send({ name: 'New Name' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
