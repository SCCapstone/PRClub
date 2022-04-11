import PostsService from '../PostsService';

describe('PostsService', () => {
    test('', async () => {
        const result = await PostsService.addComment();
        expect(result);
    });

    test('', async () => {
        const result = await PostsService.likePost();
        expect(result);
    });

    test('', async () => {
        const result = await PostsService.removeComment();
        expect(result);
    });

    test('', async () => {
        const result = await PostsService.removePost();
        expect(result);
    });

    test('', async () => {
        const result = await PostsService.unlikePost();
        expect(result);
    });

    test('', async () => {
        const result = await PostsService.upsertPost();
        expect(result);
    });
});