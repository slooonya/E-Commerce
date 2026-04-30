const { img_src } = require('../javascript/utils/img_src.js')

describe('img_src', () => {

    test('returns first image when images is array', () => {
        const product = {
            images: ['1.jpg', '2.jpg']
        };

        expect(img_src(product)).toBe('1.jpg');
    });

    test('returns image string when images is not array', () => {
        const product = {
            images: '1.jpg'
        };

        expect(img_src(product)).toBe('1.jpg');
    });

    test('returns undefined when array is empty', () => {
        const product = {
            images: []
        };

        expect(img_src(product)).toBeUndefined();
    });

    test('returns undefined when images are missing', () => {
        const product = {};

        expect(img_src(product)).toBeUndefined();
    });

    test('returns null when images is null', () => {
        const product = {
            images: null
        };

        expect(img_src(product)).toBeNull();
    });
});
