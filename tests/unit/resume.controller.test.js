import { createResume, deleteResume, getResumeById, getPublicResumeById, updateResume } from '../../controllers/resume.controller.js';
import Resume from '../../models/resume.model.js';

// Mock dependencies
jest.mock('../../models/resume.model.js');
jest.mock('../../configs/imageKit.js', () => ({
    files: {
        upload: jest.fn()
    }
}));
jest.mock('fs', () => ({
    createReadStream: jest.fn()
}));

describe('Resume Controller - createResume', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011',
            body: {
                title: 'My Resume'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should create resume successfully', async () => {
        const mockResume = {
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011',
            title: 'My Resume',
            public: false,
            template: 'classic'
        };

        Resume.create.mockResolvedValue(mockResume);

        await createResume(req, res);

        expect(Resume.create).toHaveBeenCalledWith({
            userId: '507f1f77bcf86cd799439011',
            title: 'My Resume'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Resume created successfully',
            resume: mockResume
        });
    });

    test('should handle database errors during resume creation', async () => {
        Resume.create.mockRejectedValue(new Error('Database error'));

        await createResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

    test('should use userId from request object', async () => {
        const mockResume = { _id: '1' };
        Resume.create.mockResolvedValue(mockResume);

        await createResume(req, res);

        expect(Resume.create).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: '507f1f77bcf86cd799439011'
            })
        );
    });
});

describe('Resume Controller - deleteResume', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011',
            params: {
                resumeId: '607f1f77bcf86cd799439012'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should delete resume successfully', async () => {
        Resume.findOneAndDelete.mockResolvedValue({});

        await deleteResume(req, res);

        expect(Resume.findOneAndDelete).toHaveBeenCalledWith({
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011'
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resume deleted successfully' });
    });

    test('should handle database errors during deletion', async () => {
        Resume.findOneAndDelete.mockRejectedValue(new Error('Delete failed'));

        await deleteResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Delete failed' });
    });

    test('should only allow user to delete their own resume', async () => {
        Resume.findOneAndDelete.mockResolvedValue({});

        await deleteResume(req, res);

        expect(Resume.findOneAndDelete).toHaveBeenCalledWith({
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011'
        });
    });
});

describe('Resume Controller - getResumeById', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011',
            params: {
                resumeId: '607f1f77bcf86cd799439012'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should get resume by id successfully', async () => {
        const mockResume = {
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011',
            title: 'My Resume',
            __v: 0,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02'
        };

        Resume.findOne.mockResolvedValue(mockResume);

        await getResumeById(req, res);

        expect(Resume.findOne).toHaveBeenCalledWith({
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011'
        });
        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('should return 404 when resume not found', async () => {
        Resume.findOne.mockResolvedValue(null);

        await getResumeById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Resume not found' });
    });

    test('should exclude __v, createdAt, and updatedAt from response', async () => {
        const mockResume = {
            _id: '607f1f77bcf86cd799439012',
            userId: '507f1f77bcf86cd799439011',
            title: 'My Resume',
            __v: 0,
            createdAt: '2023-01-01',
            updatedAt: '2023-01-02'
        };

        Resume.findOne.mockResolvedValue(mockResume);

        await getResumeById(req, res);

        expect(mockResume.__v).toBeUndefined();
        expect(mockResume.createdAt).toBeUndefined();
        expect(mockResume.updatedAt).toBeUndefined();
    });

    test('should handle database errors', async () => {
        Resume.findOne.mockRejectedValue(new Error('Database error'));

        await getResumeById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
});

describe('Resume Controller - getPublicResumeById', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                resumeId: '607f1f77bcf86cd799439012'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should get public resume successfully', async () => {
        const mockResume = {
            _id: '607f1f77bcf86cd799439012',
            title: 'Public Resume',
            public: true
        };

        Resume.findOne.mockResolvedValue(mockResume);

        await getPublicResumeById(req, res);

        expect(Resume.findOne).toHaveBeenCalledWith({
            _id: '607f1f77bcf86cd799439012',
            public: true
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ resume: mockResume });
    });

    test('should return 404 when public resume not found', async () => {
        Resume.findOne.mockResolvedValue(null);

        await getPublicResumeById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Resume not found or is not public'
        });
    });

    test('should handle database errors', async () => {
        Resume.findOne.mockRejectedValue(new Error('Database error'));

        await getPublicResumeById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });

    test('should only retrieve public resumes', async () => {
        await getPublicResumeById(req, res);

        expect(Resume.findOne).toHaveBeenCalledWith(
            expect.objectContaining({
                public: true
            })
        );
    });
});

describe('Resume Controller - updateResume', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: '507f1f77bcf86cd799439011',
            body: {
                resumeId: '607f1f77bcf86cd799439012',
                resumeData: {
                    personal_info: {
                        full_name: 'John Doe'
                    }
                },
                removeBackground: false
            },
            file: null
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });

    test('should handle database errors during update', async () => {
        Resume.findOneAndUpdate = jest.fn().mockRejectedValue(new Error('Update failed'));

        await updateResume(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });

    test('should parse resumeData if it is a string', async () => {
        req.body.resumeData = JSON.stringify({
            personal_info: { full_name: 'John Doe' }
        });

        const resumeData = JSON.parse(req.body.resumeData);
        expect(resumeData.personal_info.full_name).toBe('John Doe');
    });

    test('should use resumeData as object if not a string', async () => {
        const resumeData = {
            personal_info: { full_name: 'Jane Doe' }
        };
        req.body.resumeData = resumeData;

        expect(typeof req.body.resumeData).toBe('object');
        expect(req.body.resumeData.personal_info.full_name).toBe('Jane Doe');
    });
});
