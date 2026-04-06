const swaggerUiOptions = {
    customSiteTitle: 'Resume Builder API Docs',
    swaggerOptions: {
        docExpansion: 'list',
        displayRequestDuration: true,
        filter: true,
        showCommonExtensions: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        persistAuthorization: true,
        syntaxHighlight: {
            activate: true,
            theme: 'github',
        },
    },
};

const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Resume Builder API',
        version: '1.0.0',
        description: 'Swagger UI documentation for the Resume Builder backend APIs.',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server',
        },
    ],
    tags: [
        { name: 'Health', description: 'Server status endpoints' },
        { name: 'Users', description: 'User authentication and profile APIs' },
        { name: 'Resumes', description: 'Resume management APIs' },
        { name: 'AI', description: 'OpenAI-powered resume helpers' },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ErrorResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Unauthorized' },
                },
            },
            HealthResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Server is running' },
                },
            },
            RegisterUserRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', example: 'Aarav Sharma' },
                    email: { type: 'string', example: 'aarav@example.com' },
                    password: { type: 'string', example: 'Password@123' },
                },
            },
            LoginUserRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', example: 'aarav@example.com' },
                    password: { type: 'string', example: 'Password@123' },
                },
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '665f1c7f1f2b4b2d2c1a1234' },
                    name: { type: 'string', example: 'Aarav Sharma' },
                    email: { type: 'string', example: 'aarav@example.com' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            UserResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'User retrieved successfully' },
                    user: { $ref: '#/components/schemas/User' },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'User logged in successfully' },
                    user: { $ref: '#/components/schemas/User' },
                    token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                },
            },
            ResumePersonalInfo: {
                type: 'object',
                properties: {
                    image: { type: 'string', example: 'https://ik.imagekit.io/demo/avatar.png' },
                    full_name: { type: 'string', example: 'Aarav Sharma' },
                    profession: { type: 'string', example: 'Full Stack Developer' },
                    email: { type: 'string', example: 'aarav@example.com' },
                    phone: { type: 'string', example: '+91 9876543210' },
                    location: { type: 'string', example: 'Bengaluru, India' },
                    linkedin: { type: 'string', example: 'https://linkedin.com/in/aarav' },
                    website: { type: 'string', example: 'https://aarav.dev' },
                },
            },
            ResumeExperienceItem: {
                type: 'object',
                properties: {
                    company: { type: 'string', example: 'Tech Corp' },
                    position: { type: 'string', example: 'Software Engineer' },
                    start_date: { type: 'string', example: 'Jan 2023' },
                    end_date: { type: 'string', example: 'Present' },
                    description: { type: 'string', example: 'Built scalable frontend and backend features.' },
                    is_current: { type: 'boolean', example: true },
                },
            },
            ResumeProjectItem: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Portfolio Site' },
                    type: { type: 'string', example: 'Web App' },
                    description: { type: 'string', example: 'A personal portfolio built with React and Node.js.' },
                },
            },
            ResumeEducationItem: {
                type: 'object',
                properties: {
                    institution: { type: 'string', example: 'University of ABC' },
                    degree: { type: 'string', example: 'B.Tech' },
                    graduation_data: { type: 'string', example: '2024' },
                    field: { type: 'string', example: 'Computer Science' },
                    gpa: { type: 'string', example: '8.5/10' },
                },
            },
            Resume: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '665f1c7f1f2b4b2d2c1a5678' },
                    userId: { type: 'string', example: '665f1c7f1f2b4b2d2c1a1234' },
                    title: { type: 'string', example: 'Senior Frontend Resume' },
                    public: { type: 'boolean', example: false },
                    template: { type: 'string', example: 'classic' },
                    accent_color: { type: 'string', example: '#3b82f6' },
                    professional_summary: { type: 'string', example: 'Frontend engineer with 4+ years of experience.' },
                    skills: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['React', 'Node.js', 'MongoDB'],
                    },
                    personal_info: { $ref: '#/components/schemas/ResumePersonalInfo' },
                    experience: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ResumeExperienceItem' },
                    },
                    project: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ResumeProjectItem' },
                    },
                    education: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ResumeEducationItem' },
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            ResumeTitleRequest: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', example: 'Frontend Developer Resume' },
                },
            },
            ResumeCreateRequest: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', example: 'Frontend Developer Resume' },
                },
            },
            ResumeUpdateRequest: {
                type: 'object',
                required: ['resumeId', 'resumeData'],
                properties: {
                    resumeId: { type: 'string', example: '665f1c7f1f2b4b2d2c1a5678' },
                    resumeData: {
                        type: 'string',
                        description: 'Stringified resume JSON object',
                        example: '{"title":"Updated Resume","personal_info":{"full_name":"Aarav Sharma"}}',
                    },
                    removeBackground: { type: 'boolean', example: false },
                    image: { type: 'string', format: 'binary' },
                },
            },
            CreateResumeResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Resume created successfully' },
                    resume: { $ref: '#/components/schemas/Resume' },
                },
            },
            ResumeUpdateResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Resume updated successfully' },
                    resume: { $ref: '#/components/schemas/Resume' },
                },
            },
            ResumeDeleteResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Resume deleted successfully' },
                },
            },
            UserResumesResponse: {
                type: 'object',
                properties: {
                    message: { type: 'string', example: 'Resumes retrieved successfully' },
                    resumes: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Resume' },
                    },
                },
            },
            ResumeDetailResponse: {
                type: 'object',
                properties: {
                    resume: { $ref: '#/components/schemas/Resume' },
                },
            },
            PublicResumeResponse: {
                type: 'object',
                properties: {
                    resume: { $ref: '#/components/schemas/Resume' },
                },
            },
            AIContentRequest: {
                type: 'object',
                required: ['userContent'],
                properties: {
                    userContent: {
                        type: 'string',
                        example: 'Experienced software engineer with strong leadership and frontend skills.',
                    },
                },
            },
            ResumeUploadRequest: {
                type: 'object',
                required: ['resumeText'],
                properties: {
                    resumeText: {
                        type: 'string',
                        example: 'John Doe\nSoftware Engineer\nExperience... ',
                    },
                    title: { type: 'string', example: 'Imported Resume' },
                },
            },
            EnhancedContentResponse: {
                type: 'object',
                properties: {
                    enhancedContent: {
                        type: 'string',
                        example: 'Results-driven software engineer with expertise in ...',
                    },
                },
            },
            ResumeUploadResponse: {
                type: 'object',
                properties: {
                    resumeId: { type: 'string', example: '665f1c7f1f2b4b2d2c1a5678' },
                },
            },
            AIResponse: {
                type: 'object',
                properties: {
                    enhancedContent: {
                        type: 'string',
                        example: 'Results-driven software engineer with expertise in ...',
                    },
                },
            },
        },
    },
    paths: {
        '/': {
            get: {
                tags: ['Health'],
                summary: 'Check server status',
                responses: {
                    200: {
                        description: 'Server is running',
                        content: {
                            'text/plain': {
                                schema: { $ref: '#/components/schemas/HealthResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/register': {
            post: {
                tags: ['Users'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RegisterUserRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'User registered successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/login': {
            post: {
                tags: ['Users'],
                summary: 'Log in a user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginUserRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'User logged in successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid credentials',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/data': {
            get: {
                tags: ['Users'],
                summary: 'Get logged-in user profile',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'User retrieved successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    404: {
                        description: 'User not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/users/resumes': {
            get: {
                tags: ['Users'],
                summary: 'Get resumes for the logged-in user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Resumes retrieved successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserResumesResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/resumes/create': {
            post: {
                tags: ['Resumes'],
                summary: 'Create a new resume',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ResumeCreateRequest' },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Resume created successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/CreateResumeResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Validation error',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/resumes/update/': {
            put: {
                tags: ['Resumes'],
                summary: 'Update a resume',
                description: 'Send resume data as JSON in the resumeData field. image is optional and can be uploaded with multipart/form-data.',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: { $ref: '#/components/schemas/ResumeUpdateRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resume updated successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ResumeUpdateResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/resumes/delete/{resumeId}': {
            delete: {
                tags: ['Resumes'],
                summary: 'Delete a resume',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'resumeId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        example: '665f1c7f1f2b4b2d2c1a5678',
                    },
                ],
                responses: {
                    200: {
                        description: 'Resume deleted successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ResumeDeleteResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/resumes/get/{resumeId}': {
            get: {
                tags: ['Resumes'],
                summary: 'Get a resume by ID',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'resumeId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        example: '665f1c7f1f2b4b2d2c1a5678',
                    },
                ],
                responses: {
                    200: {
                        description: 'Resume retrieved successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ResumeDetailResponse' },
                            },
                        },
                    },
                    401: {
                        description: 'Unauthorized',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                    404: {
                        description: 'Resume not found',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/resumes/public/{resumeId}': {
            get: {
                tags: ['Resumes'],
                summary: 'Get a public resume by ID',
                parameters: [
                    {
                        name: 'resumeId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        example: '665f1c7f1f2b4b2d2c1a5678',
                    },
                ],
                responses: {
                    200: {
                        description: 'Public resume retrieved successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PublicResumeResponse' },
                            },
                        },
                    },
                    404: {
                        description: 'Resume not found or is not public',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/ai/enhance-pro-sum': {
            post: {
                tags: ['AI'],
                summary: 'Enhance a professional summary',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AIContentRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Summary enhanced successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AIResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/ai/enhance-job-desc': {
            post: {
                tags: ['AI'],
                summary: 'Enhance a job description',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AIContentRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Job description enhanced successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AIResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
        '/api/ai/upload-resume': {
            post: {
                tags: ['AI'],
                summary: 'Extract resume data from text and create a resume',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ResumeUploadRequest' },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resume imported successfully',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ResumeUploadResponse' },
                            },
                        },
                    },
                    400: {
                        description: 'Invalid request',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ErrorResponse' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default swaggerDocument;
export { swaggerUiOptions };