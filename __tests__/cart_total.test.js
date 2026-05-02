const { cart_total } = require('../javascript/utils/cart_total.js');

describe('cart_total', () => {

    test('sums price * quantity for each line', () => {
        let items = [
            { price: 10, quantity: 2 },
            { price: 5.5, quantity: 4 }
        ];
        expect(cart_total(items)).toBe(42);
    });

    test('defaults missing quantity to 1', () => {
        expect(cart_total([{ price: 9.99 }])).toBe(9.99);
    });

    test('rounds to two decimals', () => {
        expect(cart_total([{ price: 0.1, quantity: 3 }])).toBe(0.3);
    });

    test('returns 0 for empty or non-array input', () => {
        expect(cart_total([])).toBe(0);
        expect(cart_total(null)).toBe(0);
        expect(cart_total('nope')).toBe(0);
    });

    test('skips items with non-numeric price', () => {
        let items = [
            { price: 'abc', quantity: 1 },
            { price: 7, quantity: 2 }
        ];
        expect(cart_total(items)).toBe(14);
    });

    test('handles null entries inside the array', () => {
        expect(cart_total([null, { price: 3, quantity: 2 }])).toBe(6);
    });
});
