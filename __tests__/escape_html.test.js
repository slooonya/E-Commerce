const { escape_html } = require('../javascript/utils/escape_html.js');

describe('escape_html', () => {

    test('escapes a script tag payload', () => {
        expect(escape_html(`<script>alert("x")</script>`))
            .toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    });

    test('escapes ampersands and single quotes', () => {
        expect(escape_html(`Tom & Jerry's`)).toBe('Tom &amp; Jerry&#39;s');
    });

    test('returns empty string when value is null', () => {
        expect(escape_html(null)).toBe('');
    });

    test('returns empty string when value is undefined', () => {
        expect(escape_html(undefined)).toBe('');
    });

    test('coerces numbers to a string', () => {
        expect(escape_html(42)).toBe('42');
    });

    test('leaves a plain string untouched', () => {
        expect(escape_html('Hello World')).toBe('Hello World');
    });
});
