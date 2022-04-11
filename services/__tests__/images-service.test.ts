import ImagesService from '../ImagesService';

describe('ImagesService', () => {
    test('upload image', async () => {
        const result = await ImagesService.uploadImage();
        expect(result);
    });
    test('get an image url', async () => {
        const result = await ImagesService.getProfileImageUrl();
        expect(result);
    });
});

