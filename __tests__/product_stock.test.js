const { product_stock } = require('../javascript/utils/product_stock.js');

describe('product_stock', () => {

    test('returns numeric stock when set', () => {
        expect(product_stock({ stock: 12 })).toBe(12);
    });

    test('returns "Many In Stock" when stock is missing', () => {
        expect(product_stock({})).toBe('Many In Stock');
    });

    test('returns "Many In Stock" when stock is 0', () => {
        expect(product_stock({ stock: 0 })).toBe('Many In Stock');
    });

    test('handles null and undefined product', () => {
        expect(product_stock(null)).toBe('Many In Stock');
        expect(product_stock(undefined)).toBe('Many In Stock');
    });

    test('uses the fallback string when stock is missing', () => {
        expect(product_stock({}, 'Много в наличии')).toBe('Много в наличии');
        expect(product_stock(null, 'In Stock')).toBe('In Stock');
    });

    test('actual stock wins over the fallback', () => {
        expect(product_stock({ stock: 5 }, 'never used')).toBe(5);
    });

    test('empty fallback -> default English string', () => {
        expect(product_stock({}, '')).toBe('Many In Stock');
    });
});
