const { searchusers, searchBlogs } = require('../controllers/searchController');
const { user, Blog } = require('../models');
const { Op } = require('sequelize');

jest.mock('../models'); // Mock the models to avoid real DB calls

describe('Search Controller', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe('searchusers', () => {
    it('should return a list of users matching the username query', async () => {
      // Mock user.findAll
      user.findAll.mockResolvedValue([
        { id: 1, username: 'testuser', email: 'test@example.com' }
      ]);

      const req = { query: { username: 'testuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchusers(req, res);

      expect(user.findAll).toHaveBeenCalledWith({
        where: { username: { [Op.like]: '%testuser%' } },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, username: 'testuser', email: 'test@example.com' }]);
    });

    it('should return an empty list if no users match the search query', async () => {
      user.findAll.mockResolvedValue([]);

      const req = { query: { username: 'nonexistentuser' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchusers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('searchBlogs', () => {
    it('should return a list of blogs matching the title query', async () => {
      Blog.findAll.mockResolvedValue([
        { id: 1, title: 'Test Blog Post', content: 'This is content' }
      ]);

      const req = { query: { title: 'Test Blog Post' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchBlogs(req, res);

      expect(Blog.findAll).toHaveBeenCalledWith({
        where: { title: { [Op.like]: '%Test Blog Post%' } },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, title: 'Test Blog Post', content: 'This is content' }]);
    });

    it('should return an empty list if no blogs match the search query', async () => {
      Blog.findAll.mockResolvedValue([]);

      const req = { query: { title: 'Nonexistent Blog' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await searchBlogs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

});
