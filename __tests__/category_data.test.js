const { category_data } = require('../javascript/utils/category_data.js');

const logos = [
    { name: 'laptops', src: 'images/laptops.jpg', label: 'Laptops' },
    { name: 'shoes', src: 'images/shoes.png', label: 'Footwear' },
    { name: 'no-src' }
];

describe('category_data', () => {

    test('finds a category and returns the whole object', () => {
        expect(category_data('laptops', logos)).toEqual({
            name: 'laptops',
            src: 'images/laptops.jpg',
            label: 'Laptops'
        });
    });

    test('still returns the entry when src is missing', () => {
        expect(category_data('no-src', logos)).toEqual({ name: 'no-src' });
    });

    test('unknown category -> null', () => {
        expect(category_data('phones', logos)).toBeNull();
    });

    test('empty or null name -> null', () => {
        expect(category_data('', logos)).toBeNull();
        expect(category_data(null, logos)).toBeNull();
        expect(category_data(undefined, logos)).toBeNull();
    });

    test('logos is not an array -> null', () => {
        expect(category_data('laptops', null)).toBeNull();
        expect(category_data('laptops', undefined)).toBeNull();
        expect(category_data('laptops', 'oops')).toBeNull();
    });

    test("doesn't crash on null entries inside logos", () => {
        const messy = [null, undefined, { name: 'x', src: 'x.png' }];
        expect(category_data('x', messy)).toEqual({ name: 'x', src: 'x.png' });
    });

    test('1 and "1" should match (we use ==)', () => {
        const numeric = [{ name: 1, label: 'One' }, { name: '2', label: 'Two' }];
        expect(category_data('1', numeric)).toEqual({ name: 1, label: 'One' });
        expect(category_data(2, numeric)).toEqual({ name: '2', label: 'Two' });
    });
});
