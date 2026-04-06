import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume } from '../../controllers/ai.controller.js';

// Mock dependencies
jest.mock('../../models/resume.model.js');
jest.mock('../../configs/ai.js', () => ({
    chat: {
        completions: {
            create: jest.fn()
        }
    }
}));

import ai from '../../configs/ai.js';

describe('AI Controller - enhanceProfessionalSummary', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userContent: 'Software engineer with 5 years experience'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        process.env.OPENAI_MODEL = 'gpt-4';
    });

    test('should enhance professional summary successfully', async () => {
        const enhancedText = 'Results-driven software engineer with 5+ years of experience designing and implementing scalable cloud solutions.';

        ai.chat.completions.create.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: enhancedText
                    }
                }
            ]
        });

        await enhanceProfessionalSummary(req, res);

        expect(ai.chat.completions.create).toHaveBeenCalledWith(
            expect.objectContaining({
                model: 'gpt-4',
                messages: expect.any(Array)
            })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ enhancedContent: enhancedText });
    });

    test('should return 400 when userContent is missing', async () => {
        req.body = {};

        await enhanceProfessionalSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Content is required' });
    });

    test('should return 400 when userContent is empty', async () => {
        req.body.userContent = '';

        await enhanceProfessionalSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Content is required' });
    });

    test('should handle AI API errors', async () => {
        ai.chat.completions.create.mockRejectedValue(new Error('API rate limit exceeded'));

        await enhanceProfessionalSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'API rate limit exceeded' });
    });

    test('should send correct system prompt for professional summary', async () => {
        ai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: 'Enhanced summary' } }]
        });

        await enhanceProfessionalSummary(req, res);

        const callArgs = ai.chat.completions.create.mock.calls[0][0];
        expect(callArgs.messages[0].role).toBe('system');
        expect(callArgs.messages[0].content).toContain('professional summary');
    });

    test('should include user content in messages', async () => {
        const userContent = 'My experience summary';
        req.body.userContent = userContent;

        ai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: 'Enhanced' } }]
        });

        await enhanceProfessionalSummary(req, res);

        const callArgs = ai.chat.completions.create.mock.calls[0][0];
        expect(callArgs.messages[1].role).toBe('user');
        expect(callArgs.messages[1].content).toBe(userContent);
    });
});

describe('AI Controller - enhanceJobDescription', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userContent: 'Developed web applications'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        process.env.OPENAI_MODEL = 'gpt-4';
    });

    test('should enhance job description successfully', async () => {
        const enhancedText = 'Designed and developed scalable web applications using React and Node.js, improving performance by 40%.';

        ai.chat.completions.create.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: enhancedText
                    }
                }
            ]
        });

        await enhanceJobDescription(req, res);

        expect(ai.chat.completions.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ enhancedContent: enhancedText });
    });

    test('should return 400 when userContent is missing', async () => {
        req.body = {};

        await enhanceJobDescription(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Content is required' });
    });

    test('should send correct system prompt for job description', async () => {
        ai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: 'Enhanced' } }]
        });

        await enhanceJobDescription(req, res);

        const callArgs = ai.chat.completions.create.mock.calls[0][0];
        expect(callArgs.messages[0].role).toBe('system');
        expect(callArgs.messages[0].content).toContain('job description');
    });

    test('should handle AI API errors', async () => {
        ai.chat.completions.create.mockRejectedValue(new Error('Service unavailable'));

        await enhanceJobDescription(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Service unavailable' });
    });
});

describe('AI Controller - uploadResume', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011',
            body: {
                resumeText: 'John Doe\nSoftware Engineer\nEmail: john@example.com',
                title: 'My Resume'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
        process.env.OPENAI_MODEL = 'gpt-4';
    });

    test('should extract resume data successfully', async () => {
        const mockExtractedData = {
            professional_summary: 'Experienced software engineer',
            skills: ['JavaScript', 'React', 'Node.js'],
            personal_info: {
                full_name: 'John Doe',
                profession: 'Software Engineer',
                email: 'john@example.com'
            }
        };

        ai.chat.completions.create.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: JSON.stringify(mockExtractedData)
                    }
                }
            ]
        });

        await uploadResume(req, res);

        expect(ai.chat.completions.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should return 400 when resumeText is missing', async () => {
        req.body = { title: 'My Resume' };

        await uploadResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resume text is required' });
    });

    test('should return 400 when resumeText is empty', async () => {
        req.body.resumeText = '';

        await uploadResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resume text is required' });
    });

    test('should use userId from request', async () => {
        ai.chat.completions.create.mockResolvedValue({
            choices: [
                {
                    message: {
                        content: '{}'
                    }
                }
            ]
        });

        await uploadResume(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    test('should handle AI API errors during resume extraction', async () => {
        ai.chat.completions.create.mockRejectedValue(new Error('Invalid request'));

        await uploadResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid request' });
    });

    test('should request JSON format in the prompt', async () => {
        ai.chat.completions.create.mockResolvedValue({
            choices: [{ message: { content: '{}' } }]
        });

        await uploadResume(req, res);

        const callArgs = ai.chat.completions.create.mock.calls[0][0];
        const userMessage = callArgs.messages[1].content;
        expect(userMessage).toContain('JSON format');
    });
});
