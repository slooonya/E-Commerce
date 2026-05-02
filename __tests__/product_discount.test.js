const { product_discount } = require('../javascript/utils/product_discount.js');

describe('product_discount', () => {

    test('renders "<n> %" when discountPercentage is set', () => {
        expect(product_discount({ discountPercentage: 15 })).toBe('15 %');
    });

    test('returns empty when discountPercentage is missing', () => {
        expect(product_discount({})).toBe('');
    });

    test('returns empty for falsy discountPercentage', () => {
        expect(product_discount({ discountPercentage: 0 })).toBe('');
    });

    test('returns empty when product is null or undefined', () => {
        expect(product_discount(null)).toBe('');
        expect(product_discount(undefined)).toBe('');
    });
});
