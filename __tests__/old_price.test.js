const { old_price } = require('../javascript/utils/old_price.js');

describe('old_price', () => {

    test('back-calculates from discountPercentage', () => {
        // 80 with 20% off => was 100
        expect(old_price({ discountPercentage: 20 }, 80)).toBe('100.00');
    });

    test('uses old_price field when no discountPercentage', () => {
        expect(old_price({ old_price: '199.00' }, 99)).toBe('199.00');
    });

    test('returns empty when neither discount info is available', () => {
        expect(old_price({}, 50)).toBe('');
    });

    test('returns empty for null product', () => {
        expect(old_price(null, 50)).toBe('');
    });

    test('returns empty when current_price is not numeric', () => {
        expect(old_price({ discountPercentage: 25 }, 'oops')).toBe('');
    });

    test('returns empty when discountPercentage is 100 or higher', () => {
        expect(old_price({ discountPercentage: 100 }, 50)).toBe('');
        expect(old_price({ discountPercentage: 150 }, 50)).toBe('');
    });
});
