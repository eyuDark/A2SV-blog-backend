// __tests__/searchRoutes.test.js
const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const { User, Blog } = require('../models'); // Models for interacting with the DB
const jwt = require('jsonwebtoken');

let token;
let testUser;
let testBlog;

beforeAll(async () => {
  // Create a test user
  testUser = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });

  // Log in the user to get a token
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'testuser@example.com', password: 'password123' });

  token = response.body.token;

  // Create a test blog post for testing
  testBlog = await Blog.create({
    userId: testUser.id,
    title: 'Test Blog Post',
    content: 'This is a test blog post content.',
  });
});

afterAll(async () => {
  // Clean up the test data after the tests
  await Blog.destroy({ where: { id: testBlog.id } });
  await User.destroy({ where: { email: 'testuser@example.com' } });
});

describe('Search Routes', () => {
  describe('GET /search/users', () => {
    it('should return a list of users matching the search query', async () => {
      const response = await request(app)
        .get('/search/users')
        .query({ username: 'testuser' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('username', 'testuser');
    });

    it('should return an empty list if no users match', async () => {
      const response = await request(app)
        .get('/search/users')
        .query({ username: 'nonexistentuser' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /search/blogs', () => {
    it('should return a list of blogs matching the search query', async () => {
      const response = await request(app)
        .get('/search/blogs')
        .query({ title: 'Test Blog Post' });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('title', 'Test Blog Post');
    });

    it('should return an empty list if no blogs match', async () => {
      const response = await request(app)
        .get('/search/blogs')
        .query({ title: 'Nonexistent Blog' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
