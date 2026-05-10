const { category_matches } = require('../javascript/utils/category_matches.js');

describe('category_matches', () => {

    test('same string -> true', () => {
        expect(category_matches('laptops', 'laptops')).toBe(true);
    });

    test('different categories -> false', () => {
        expect(category_matches('laptops', 'phones')).toBe(false);
    });

    test('1 == "1" because we use ==', () => {
        expect(category_matches(1, '1')).toBe(true);
        expect(category_matches('2', 2)).toBe(true);
    });

    test('null and undefined are loosely equal', () => {
        expect(category_matches(null, undefined)).toBe(true);
    });

    test('only one side null -> false', () => {
        expect(category_matches('laptops', null)).toBe(false);
        expect(category_matches(null, 'laptops')).toBe(false);
    });

    test('two empty strings still match', () => {
        expect(category_matches('', '')).toBe(true);
    });
});
