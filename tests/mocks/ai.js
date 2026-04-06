// Mock OpenAI client
export default {
    chat: {
        completions: {
            create: async () => Promise.resolve({ choices: [{ message: { content: 'Mocked response' } }] })
        }
    }
};
