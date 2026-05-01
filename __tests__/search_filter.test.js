const { search_filter } = require('../javascript/utils/search_filter.js');

const sample = [
    { title: 'iPhone 13' },
    { title: 'Samsung Galaxy S22' },
    { title: 'Pixel 7' },
    { title: 'iphone 14 Pro' }, // lowercase to test case-insensitive
];

describe('search_filter', () => {

    test('matches case-insensitively on title substring', () => {
        let res = search_filter(sample, 'iphone');
        expect(res).toHaveLength(2);
        expect(res.map(p => p.title)).toEqual(
            expect.arrayContaining(['iPhone 13', 'iphone 14 Pro'])
        );
    });

    test('returns [] when query is empty or whitespace', () => {
        expect(search_filter(sample, '')).toEqual([]);
        expect(search_filter(sample, '   ')).toEqual([]);
        expect(search_filter(sample, null)).toEqual([]);
    });

    test('returns [] when products is not an array', () => {
        expect(search_filter(null, 'iphone')).toEqual([]);
        expect(search_filter('hello', 'iphone')).toEqual([]);
    });

    test('skips items with no title', () => {
        let messy = [{ title: 'Watch' }, { foo: 1 }, null, { title: 12 }];
        expect(search_filter(messy, 'watch')).toEqual([{ title: 'Watch' }]);
    });

    test('treats parens and other regex chars as literals', () => {
        let data = [{ title: 'Lamp (Black)' }, { title: 'Lamp Black' }];
        expect(search_filter(data, '(black)')).toEqual([{ title: 'Lamp (Black)' }]);
    });
});
