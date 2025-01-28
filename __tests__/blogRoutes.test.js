// __tests__/blogRoutes.test.js
const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported from server.js
const { user, Blog, Comment, BlogRating } = require('../models'); // Models for interacting with the DB
const jwt = require('jsonwebtoken');

let token;
let testuser;
let testBlog;
let testComment;
let testRating;

beforeAll(async () => {
  // Create a test user
  testuser = await user.create({
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
    userId: testuser.id,
    title: 'Test Blog Post',
    content: 'This is a test blog post.',
  });

  // Create a test comment and rating for testing
  testComment = await Comment.create({
    userId: testuser.id,
    blogId: testBlog.id,
    content: 'This is a test comment.',
  });

  testRating = await BlogRating.create({
    userId: testuser.id,
    blogId: testBlog.id,
    ratingValue: 5,
  });
});

afterAll(async () => {
  // Clean up the test data after the tests
  await Comment.destroy({ where: { blogId: testBlog.id } });
  await BlogRating.destroy({ where: { blogId: testBlog.id } });
  await Blog.destroy({ where: { id: testBlog.id } });
  await user.destroy({ where: { email: 'testuser@example.com' } });
});

describe('Blog Routes', () => {
  describe('POST /blogs', () => {
    it('should create a new blog post', async () => {
      const response = await request(app)
        .post('/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Blog Post',
          content: 'This is a new blog post.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'New Blog Post');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post('/blogs').send({
        title: 'New Blog Post',
        content: 'This is a new blog post.',
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /blogs', () => {
    it('should get all blog posts', async () => {
      const response = await request(app).get('/blogs');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /blogs/:id', () => {
    it('should get a single blog post by ID', async () => {
      const response = await request(app).get(`/blogs/${testBlog.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Blog Post');
    });

    it('should return 404 if blog does not exist', async () => {
      const response = await request(app).get('/blogs/9999'); // Invalid ID

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /blogs/:id', () => {
    it('should update a blog post', async () => {
      const response = await request(app)
        .put(`/blogs/${testBlog.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated content for the blog post.' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content', 'Updated content for the blog post.');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .put(`/blogs/${testBlog.id}`)
        .send({ content: 'Updated content for the blog post.' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /blogs/:id', () => {
    it('should delete a blog post', async () => {
      const response = await request(app)
        .delete(`/blogs/${testBlog.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Blog deleted successfully');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).delete(`/blogs/${testBlog.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /blogs/:id/rating', () => {
    it('should create or update a rating for a blog post', async () => {
      const response = await request(app)
        .post(`/blogs/${testBlog.id}/rating`)
        .set('Authorization', `Bearer ${token}`)
        .send({ ratingValue: 4 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ratingValue', 4);
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post(`/blogs/${testBlog.id}/rating`).send({ ratingValue: 4 });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /blogs/:id/comments', () => {
    it('should create a comment for a blog post', async () => {
      const response = await request(app)
        .post(`/blogs/${testBlog.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'This is a new comment.' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', 'This is a new comment.');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post(`/blogs/${testBlog.id}/comments`).send({ content: 'This is a new comment.' });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /comments/:id', () => {
    it('should update a comment', async () => {
      const response = await request(app)
        .put(`/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'Updated comment.' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('content', 'Updated comment.');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).put(`/comments/${testComment.id}`).send({ content: 'Updated comment.' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should delete a comment', async () => {
      const response = await request(app)
        .delete(`/comments/${testComment.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).delete(`/comments/${testComment.id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /blogs/:id/likes', () => {
    it('should toggle like/unlike for a blog post', async () => {
      const response = await request(app)
        .post(`/blogs/${testBlog.id}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Like toggled successfully');
    });

    it('should return 401 if not authenticated', async () => {
      const response = await request(app).post(`/blogs/${testBlog.id}/likes`);

      expect(response.status).toBe(401);
    });
  });
});
