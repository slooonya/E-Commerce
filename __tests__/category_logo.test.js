const { category_logo } = require('../javascript/utils/category_logo.js');

const logos = [
    { name: 'laptops', src: 'images/laptops.jpg' },
    { name: 'shoes', src: 'images/shoes.png' },
    { name: 'broken' } // missing src on purpose
];

describe('category_logo', () => {

    test('returns the src for a known category', () => {
        expect(category_logo('laptops', logos)).toBe('images/laptops.jpg');
        expect(category_logo('shoes', logos)).toBe('images/shoes.png');
    });

    test('returns null for an unknown category', () => {
        expect(category_logo('phones', logos)).toBeNull();
    });

    test('returns null when the matching entry has no src', () => {
        expect(category_logo('broken', logos)).toBeNull();
    });

    test('returns null when the name is empty', () => {
        expect(category_logo('', logos)).toBeNull();
        expect(category_logo(null, logos)).toBeNull();
    });

    test('returns null when logos is not an array', () => {
        expect(category_logo('laptops', null)).toBeNull();
        expect(category_logo('laptops', 'not an array')).toBeNull();
    });
});
