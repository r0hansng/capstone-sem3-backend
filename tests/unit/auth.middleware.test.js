import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock jwt BEFORE importing the middleware
jest.mock('jsonwebtoken');

// Then import
import protect from '../../middleware/auth.middleware.js';
import jwt from 'jsonwebtoken';

// Set up mock methods for jwt
jwt.verify = jest.fn();

describe('Auth Middleware - protect', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Clear all mocks before each test
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret-key';
    });

    test('should return 401 when no authorization header is provided', () => {
        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should extract token from Bearer format', () => {
        const testToken = 'test-jwt-token';
        const userId = '507f1f77bcf86cd799439011';

        req.headers.authorization = `Bearer ${testToken}`;
        jwt.verify.mockReturnValue({ userId });

        protect(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key');
        expect(req.userId).toBe(userId);
        expect(next).toHaveBeenCalled();
    });

    test('should handle token without Bearer prefix', () => {
        const testToken = 'test-jwt-token';
        const userId = '507f1f77bcf86cd799439011';

        req.headers.authorization = testToken;
        jwt.verify.mockReturnValue({ userId });

        protect(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key');
        expect(req.userId).toBe(userId);
        expect(next).toHaveBeenCalled();
    });

    test('should return 401 when token is invalid', () => {
        req.headers.authorization = 'Bearer invalid-token';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid token');
        });

        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should return 401 when token is expired', () => {
        req.headers.authorization = 'Bearer expired-token';
        const error = new Error('jwt expired');
        jwt.verify.mockImplementation(() => {
            throw error;
        });

        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should handle decoded token with id field (alternative format)', () => {
        const testToken = 'test-jwt-token';
        const userId = '507f1f77bcf86cd799439011';

        req.headers.authorization = `Bearer ${testToken}`;
        jwt.verify.mockReturnValue({ id: userId }); // Using 'id' instead of 'userId'

        protect(req, res, next);

        expect(req.userId).toBe(userId);
        expect(next).toHaveBeenCalled();
    });

    test('should call next middleware on successful verification', () => {
        const testToken = 'valid-token';
        const userId = '507f1f77bcf86cd799439011';

        req.headers.authorization = `Bearer ${testToken}`;
        jwt.verify.mockReturnValue({ userId });

        protect(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('should handle Bearer prefix case sensitivity correctly', () => {
        const testToken = 'test-jwt-token';
        const userId = '507f1f77bcf86cd799439011';

        req.headers.authorization = `Bearer ${testToken}`;
        jwt.verify.mockReturnValue({ userId });

        protect(req, res, next);

        // Extract token from auth header
        const token = req.headers.authorization.slice(7);
        expect(token).toBe(testToken);
        expect(jwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key');
    });

    test('should handle empty authorization header', () => {
        req.headers.authorization = '';

        protect(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
        expect(next).not.toHaveBeenCalled();
    });

    test('should attach userId to request object', () => {
        const testToken = 'valid-token';
        const userId = 'user-123-456';

        req.headers.authorization = `Bearer ${testToken}`;
        jwt.verify.mockReturnValue({ userId });

        protect(req, res, next);

        expect(req.userId).toBe('user-123-456');
    });
});
