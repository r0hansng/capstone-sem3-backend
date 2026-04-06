import { registerUser, loginUser, getUserById, getUserResumes } from '../../controllers/user.controller.js';
import User from '../../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock dependencies
jest.mock('../../models/user.model.js');
jest.mock('../../models/resume.model.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('User Controller - registerUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    test('should register user successfully', async () => {
        const hashedPassword = 'hashed_password_123';
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword
        };

        bcrypt.hash.mockResolvedValue(hashedPassword);
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('test-jwt-token');

        await registerUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(User.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'User registered successfully',
                token: 'test-jwt-token'
            })
        );
    });

    test('should return 400 when required fields are missing', async () => {
        req.body = { name: 'John Doe' }; // Missing email and password

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    test('should return 400 when email is missing', async () => {
        req.body = { name: 'John Doe', password: 'password123' };

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    test('should return 400 when password is missing', async () => {
        req.body = { name: 'John Doe', email: 'john@example.com' };

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    test('should return 400 when user already exists', async () => {
        User.findOne.mockResolvedValue({ email: 'john@example.com' });

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });

    test('should handle database errors', async () => {
        User.findOne.mockRejectedValue(new Error('Database connection failed'));

        await registerUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database connection failed' });
    });

    test('should exclude password from response', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed_password'
        };

        bcrypt.hash.mockResolvedValue('hashed_password');
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('token');

        await registerUser(req, res);

        const callArgs = res.json.mock.calls[0][0];
        expect(callArgs.user.password).toBeUndefined();
    });

    test('should generate valid JWT token for new user', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const mockUser = {
            _id: userId,
            name: 'John Doe',
            email: 'john@example.com'
        };

        bcrypt.hash.mockResolvedValue('hashed');
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('generated-token');

        await registerUser(req, res);

        expect(jwt.sign).toHaveBeenCalledWith(
            { userId },
            'test-secret',
            { expiresIn: '7d' }
        );
    });
});

describe('User Controller - loginUser', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                email: 'john@example.com',
                password: 'password123'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    test('should login user successfully', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed_password',
            comparePassword: jest.fn().mockReturnValue(true)
        };

        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('login-token');

        await loginUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
        expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'User logged in successfully',
                token: 'login-token'
            })
        );
    });

    test('should return 400 when user not found', async () => {
        User.findOne.mockResolvedValue(null);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    test('should return 400 when password is incorrect', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            email: 'john@example.com',
            comparePassword: jest.fn().mockReturnValue(false)
        };

        User.findOne.mockResolvedValue(mockUser);

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });

    test('should exclude password from login response', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed_password',
            comparePassword: jest.fn().mockReturnValue(true)
        };

        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('token');

        await loginUser(req, res);

        const callArgs = res.json.mock.calls[0][0];
        expect(callArgs.user.password).toBeUndefined();
    });

    test('should handle database errors during login', async () => {
        User.findOne.mockRejectedValue(new Error('Database error'));

        await loginUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('User Controller - getUserById', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should get user by id successfully', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed_password'
        };

        User.findById.mockResolvedValue(mockUser);

        await getUserById(req, res);

        expect(User.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'User retrieved successfully'
            })
        );
    });

    test('should return 404 when user not found', async () => {
        User.findById.mockResolvedValue(null);

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('should exclude password from response', async () => {
        const mockUser = {
            _id: '507f1f77bcf86cd799439011',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'hashed_password'
        };

        User.findById.mockResolvedValue(mockUser);

        await getUserById(req, res);

        const callArgs = res.json.mock.calls[0][0];
        expect(callArgs.user.password).toBeUndefined();
    });

    test('should handle database errors', async () => {
        User.findById.mockRejectedValue(new Error('Database error'));

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});
