// Mock ImageKit client
export default {
    files: {
        upload: async () => Promise.resolve({ url: 'https://test.imagekit.io/test.jpg' })
    }
};
