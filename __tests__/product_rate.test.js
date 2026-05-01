const { product_rate } = require('../javascript/utils/product_rate.js');

describe('product_rate', () => {

    test('returns the rating when present', () => {
        expect(product_rate({ rating: 4.5 })).toBe(4.5);
    });

    test('falls back to 4 when rating is missing', () => {
        expect(product_rate({})).toBe(4);
    });

    test('falls back to 4 when rating is 0 (treated as missing)', () => {
        expect(product_rate({ rating: 0 })).toBe(4);
    });

    test('falls back to 4 when product is null or undefined', () => {
        expect(product_rate(null)).toBe(4);
        expect(product_rate(undefined)).toBe(4);
    });
});
