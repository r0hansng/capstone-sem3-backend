// Jest setup file for ES modules
// Set default environment variables for tests
process.env.JWT_SECRET = 'test-secret-key';
process.env.OPENAI_MODEL = 'gpt-4';
process.env.OPENAI_API_KEY = 'test-key';
process.env.IMAGEKIT_PRIVATE_KEY = 'test-key';
process.env.IMAGEKIT_PUBLIC_KEY = 'test-key';
process.env.IMAGEKIT_URL_ENDPOINT = 'https://test.imagekit.io';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.PORT = '3000';
