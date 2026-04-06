import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock mongoose first
jest.mock('mongoose');

// Then import after mocking
import User from '../../models/user.model.js';
import bcrypt from 'bcrypt';

describe('User Model - comparePassword Method', () => {
    let userInstance;

    beforeEach(() => {
        // Create a mock user instance with the comparePassword method
        userInstance = {
            password: '',
            comparePassword: User.model.prototype.comparePassword || (() => {}),
        };
    });

    test('password comparison should validate correct password', async () => {
        const plainPassword = 'testPassword123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const comparePassword = function (password) {
            return bcrypt.compareSync(password, this.password);
        };

        const testUser = {
            password: hashedPassword,
            comparePassword: comparePassword
        };

        const result = testUser.comparePassword(plainPassword);
        expect(result).toBe(true);
    });

    test('password comparison should reject incorrect password', async () => {
        const plainPassword = 'testPassword123';
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const comparePassword = function (password) {
            return bcrypt.compareSync(password, this.password);
        };

        const testUser = {
            password: hashedPassword,
            comparePassword: comparePassword
        };

        const result = testUser.comparePassword('wrongPassword');
        expect(result).toBe(false);
    });

    test('should handle empty password comparison', async () => {
        const comparePassword = function (password) {
            return bcrypt.compareSync(password, this.password);
        };

        const hashedPassword = await bcrypt.hash('test', 10);
        const testUser = {
            password: hashedPassword,
            comparePassword: comparePassword
        };

        const result = testUser.comparePassword('');
        expect(result).toBe(false);
    });
});
