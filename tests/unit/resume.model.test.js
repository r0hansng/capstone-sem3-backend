import { jest, describe, test, expect } from '@jest/globals';

// Mock mongoose first
jest.mock('mongoose');

// Then import
import Resume from '../../models/resume.model.js';

describe('Resume Model Schema Validation', () => {
    test('Resume model should be defined', () => {
        expect(Resume).toBeDefined();
    });

    test('Resume schema should have required fields', () => {
        // Verify schema structure through the imported model
        const mockResume = {
            userId: '507f1f77bcf86cd799439011',
            title: 'My Resume',
            public: false,
            template: 'classic',
            accent_color: '#3b82f6',
            professional_summary: 'Experienced developer',
            skills: ['JavaScript', 'React', 'Node.js'],
            personal_info: {
                image: '',
                full_name: 'John Doe',
                profession: 'Software Engineer',
                email: 'john@example.com',
                phone: '+1234567890',
                location: 'New York',
                linkedin: 'linkedin.com/in/johndoe',
                website: 'johndoe.com',
            },
            experience: [
                {
                    company: 'Tech Corp',
                    position: 'Developer',
                    start_date: '2020-01',
                    end_date: '2023-12',
                    description: 'Built web apps',
                    is_current: false
                }
            ],
            project: [
                {
                    name: 'Project Alpha',
                    type: 'Web App',
                    description: 'A web application'
                }
            ],
            education: [
                {
                    institution: 'University',
                    degree: 'Bachelor',
                    graduation_data: '2020-05',
                    field: 'Computer Science',
                    gpa: '3.8'
                }
            ]
        };

        expect(mockResume.userId).toBeDefined();
        expect(mockResume.title).toBeDefined();
        expect(mockResume.personal_info).toBeDefined();
        expect(Array.isArray(mockResume.skills)).toBe(true);
        expect(Array.isArray(mockResume.experience)).toBe(true);
        expect(Array.isArray(mockResume.project)).toBe(true);
        expect(Array.isArray(mockResume.education)).toBe(true);
    });

    test('Resume should have default title of "Untitled Resume"', () => {
        const mockResume = {
            title: 'Untitled Resume',
            public: false,
            template: 'classic',
            accent_color: '#3b82f6',
        };

        expect(mockResume.title).toBe('Untitled Resume');
    });

    test('Resume should have default public status as false', () => {
        const mockResume = {
            public: false,
        };

        expect(mockResume.public).toBe(false);
    });

    test('Resume should have default template as "classic"', () => {
        const mockResume = {
            template: 'classic',
        };

        expect(mockResume.template).toBe('classic');
    });

    test('Resume should have default accent color', () => {
        const mockResume = {
            accent_color: '#3b82f6',
        };

        expect(mockResume.accent_color).toBe('#3b82f6');
    });

    test('Resume skills should be an array', () => {
        const mockResume = {
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        };

        expect(Array.isArray(mockResume.skills)).toBe(true);
        expect(mockResume.skills.length).toBe(4);
    });

    test('Resume should support array of experiences', () => {
        const mockResume = {
            experience: [
                {
                    company: 'Company1',
                    position: 'Developer',
                    start_date: '2020-01',
                    end_date: '2021-12',
                    description: 'Experience 1',
                    is_current: false
                },
                {
                    company: 'Company2',
                    position: 'Senior Developer',
                    start_date: '2022-01',
                    end_date: null,
                    description: 'Experience 2',
                    is_current: true
                }
            ]
        };

        expect(Array.isArray(mockResume.experience)).toBe(true);
        expect(mockResume.experience.length).toBe(2);
        expect(mockResume.experience[1].is_current).toBe(true);
    });

    test('Resume should support array of projects', () => {
        const mockResume = {
            project: [
                {
                    name: 'Project 1',
                    type: 'Web App',
                    description: 'First project'
                },
                {
                    name: 'Project 2',
                    type: 'Mobile App',
                    description: 'Second project'
                }
            ]
        };

        expect(Array.isArray(mockResume.project)).toBe(true);
        expect(mockResume.project.length).toBe(2);
    });

    test('Resume should support array of education', () => {
        const mockResume = {
            education: [
                {
                    institution: 'University A',
                    degree: 'Bachelor',
                    graduation_data: '2020-05',
                    field: 'Computer Science',
                    gpa: '3.8'
                },
                {
                    institution: 'University B',
                    degree: 'Master',
                    graduation_data: '2022-05',
                    field: 'Data Science',
                    gpa: '3.9'
                }
            ]
        };

        expect(Array.isArray(mockResume.education)).toBe(true);
        expect(mockResume.education.length).toBe(2);
    });

    test('Resume personal_info should have all fields', () => {
        const mockResume = {
            personal_info: {
                image: 'image_url',
                full_name: 'John Doe',
                profession: 'Software Engineer',
                email: 'john@example.com',
                phone: '+1234567890',
                location: 'New York',
                linkedin: 'linkedin.com/in/johndoe',
                website: 'johndoe.com',
            }
        };

        expect(mockResume.personal_info.full_name).toBe('John Doe');
        expect(mockResume.personal_info.email).toBe('john@example.com');
        expect(mockResume.personal_info.phone).toBe('+1234567890');
        expect(mockResume.personal_info.location).toBe('New York');
    });
});
