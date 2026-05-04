const { format_price } = require('../javascript/utils/format_price.js');

describe('format_price', () => {

    test('multiplies by rate and appends currency name', () => {
        expect(format_price(10, { rate: 1, name: 'USD' })).toBe('10.00 USD');
        expect(format_price(10, { rate: 0.92, name: 'EUR' })).toBe('9.20 EUR');
    });

    test('rounds to two decimals', () => {
        expect(format_price(9.999, { rate: 1, name: 'USD' })).toBe('10.00 USD');
        expect(format_price(7.005, { rate: 1, name: 'USD' })).toMatch(/^7\.0[01] USD$/);
    });

    test('coerces string price and rate', () => {
        expect(format_price('15', { rate: '2', name: 'EGP' })).toBe('30.00 EGP');
    });

    test('returns empty string when price is null or undefined', () => {
        expect(format_price(null, { rate: 1, name: 'USD' })).toBe('');
        expect(format_price(undefined, { rate: 1, name: 'USD' })).toBe('');
    });

    test('returns empty string when currency is missing', () => {
        expect(format_price(10, null)).toBe('');
        expect(format_price(10, undefined)).toBe('');
    });

    test('returns empty string when price or rate is not a number', () => {
        expect(format_price('abc', { rate: 1, name: 'USD' })).toBe('');
        expect(format_price(10, { rate: 'NaN', name: 'USD' })).toBe('');
    });
});
