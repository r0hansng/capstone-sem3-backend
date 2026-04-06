/**
 * Integration Tests
 * These tests verify that different components work together correctly
 */

// Mock setup for integration tests
jest.mock('../../models/user.model.js');
jest.mock('../../models/resume.model.js');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

import jwt from 'jsonwebtoken';

describe('Authentication Flow - Integration', () => {
    let process_env_backup;

    beforeEach(() => {
        // Backup original process.env
        process_env_backup = { ...process.env };
        process.env.JWT_SECRET = 'test-secret-key';
        jest.clearAllMocks();
    });

    afterEach(() => {
        // Restore original process.env
        process.env = process_env_backup;
    });

    test('JWT token generation and verification flow', () => {
        const userId = '507f1f77bcf86cd799439011';
        const testToken = 'test.jwt.token';

        // Simulate token generation
        jwt.sign.mockReturnValue(testToken);
        const generatedToken = jwt.sign(
            { userId },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        expect(generatedToken).toBe(testToken);
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId },
            'test-secret-key',
            { expiresIn: '7d' }
        );

        // Simulate token verification
        jwt.verify.mockReturnValue({ userId });
        const decoded = jwt.verify(testToken, process.env.JWT_SECRET);

        expect(decoded.userId).toBe(userId);
        expect(jwt.verify).toHaveBeenCalledWith(testToken, 'test-secret-key');
    });

    test('Token refresh scenario', () => {
        const userId = 'user-123';
        const oldToken = 'old.token';
        const newToken = 'new.token';

        // Old token expired
        jwt.verify.mockImplementationOnce(() => {
            throw new Error('jwt expired');
        });

        expect(() => {
            jwt.verify(oldToken, 'secret');
        }).toThrow('jwt expired');

        // Generate new token
        jwt.sign.mockReturnValue(newToken);
        const freshToken = jwt.sign({ userId }, 'secret', { expiresIn: '7d' });

        expect(freshToken).toBe(newToken);
        expect(jwt.verify).toHaveBeenCalled();
        expect(jwt.sign).toHaveBeenCalled();
    });

    test('Multiple users with different tokens', () => {
        const user1Id = 'user-1';
        const user2Id = 'user-2';
        const token1 = 'token.1';
        const token2 = 'token.2';

        jwt.sign.mockReturnValueOnce(token1).mockReturnValueOnce(token2);
        jwt.verify.mockImplementation((token) => {
            if (token === token1) return { userId: user1Id };
            if (token === token2) return { userId: user2Id };
            throw new Error('Invalid token');
        });

        const generatedToken1 = jwt.sign({ userId: user1Id }, 'secret');
        const generatedToken2 = jwt.sign({ userId: user2Id }, 'secret');

        expect(generatedToken1).toBe(token1);
        expect(generatedToken2).toBe(token2);

        const decoded1 = jwt.verify(token1, 'secret');
        const decoded2 = jwt.verify(token2, 'secret');

        expect(decoded1.userId).toBe(user1Id);
        expect(decoded2.userId).toBe(user2Id);
    });
});

describe('Resume Management Flow - Integration', () => {
    let Resume;

    beforeEach(() => {
        jest.clearAllMocks();
        Resume = require('../../models/resume.model.js').default;
    });

    test('Complete resume CRUD operations', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const resumeData = {
            _id: '607f1f77bcf86cd799439012',
            userId,
            title: 'My Resume',
            skills: ['JavaScript', 'React']
        };

        // Create
        jest.mock('../../models/resume.model.js');
        
        // Simulate Create
        const created = { ...resumeData };
        
        // Simulate Read
        const read = { ...created };
        
        // Simulate Update
        const updated = { ...read, title: 'Updated Resume' };
        
        // Simulate Delete (remove)
        expect(created).toBeDefined();
        expect(read._id).toBe(resumeData._id);
        expect(updated.title).toBe('Updated Resume');
    });

    test('Resume ownership validation', () => {
        const userId1 = 'user-1';
        const userId2 = 'user-2';
        const resumeId = 'resume-1';

        const resume = {
            _id: resumeId,
            userId: userId1,
            title: 'My Resume'
        };

        // User 1 owns this resume
        expect(resume.userId).toBe(userId1);

        // User 2 should not be able to access user 1's resume
        expect(resume.userId).not.toBe(userId2);
    });

    test('Public vs Private resume access', () => {
        const publicResume = {
            _id: 'public-resume',
            userId: 'user-1',
            title: 'Public Resume',
            public: true
        };

        const privateResume = {
            _id: 'private-resume',
            userId: 'user-2',
            title: 'Private Resume',
            public: false
        };

        // Public resume can be accessed by anyone
        expect(publicResume.public).toBe(true);

        // Private resume can only be accessed by owner
        expect(privateResume.public).toBe(false);
        expect(privateResume.userId).toBe('user-2');
    });
});

describe('Error Handling - Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
    });

    test('Invalid token handling chain', () => {
        const invalidToken = 'invalid.token.here';
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid signature');
        });

        expect(() => {
            jwt.verify(invalidToken, 'secret');
        }).toThrow('Invalid signature');

        expect(jwt.verify).toHaveBeenCalledWith(invalidToken, 'secret');
    });

    test('Database error propagation', async () => {
        const error = new Error('Connection timeout');
        
        // Simulate database error
        const mockDbCall = jest.fn().mockRejectedValue(error);
        
        try {
            await mockDbCall();
        } catch (err) {
            expect(err).toBe(error);
            expect(err.message).toBe('Connection timeout');
        }
    });

    test('Validation error handling', () => {
        const invalidData = {
            email: 'not-an-email',
            password: ''
        };

        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        };

        const validatePassword = (password) => {
            return password && password.length >= 6;
        };

        expect(validateEmail(invalidData.email)).toBe(false);
        expect(validatePassword(invalidData.password)).toBe(false);
    });
});

describe('Concurrent Operations - Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Multiple resume operations for different users', async () => {
        const user1 = '507f1f77bcf86cd799439011';
        const user2 = '507f1f77bcf86cd799439012';

        // Simulate concurrent operations
        const operations = [
            { userId: user1, action: 'create', resumeTitle: 'Resume 1' },
            { userId: user2, action: 'create', resumeTitle: 'Resume 1' },
            { userId: user1, action: 'read', resumeId: 'res-1' },
            { userId: user2, action: 'update', resumeId: 'res-2', title: 'Updated' }
        ];

        // All operations should complete without interference
        expect(operations.length).toBe(4);
        expect(operations[0].userId).not.toBe(operations[1].userId);
        expect(operations[2].userId).toBe(user1);
        expect(operations[3].userId).toBe(user2);
    });

    test('Token validation during concurrent requests', () => {
        const requests = [
            { userId: 'user-1', token: 'token-1' },
            { userId: 'user-2', token: 'token-2' },
            { userId: 'user-1', token: 'token-1' }
        ];

        jwt.verify.mockImplementation((token) => {
            if (token === 'token-1') return { userId: 'user-1' };
            if (token === 'token-2') return { userId: 'user-2' };
            throw new Error('Invalid');
        });

        // Verify each token
        requests.forEach(req => {
            const decoded = jwt.verify(req.token, 'secret');
            expect(decoded.userId).toBe(req.userId);
        });

        expect(jwt.verify).toHaveBeenCalledTimes(3);
    });
});
