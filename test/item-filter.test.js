const JQL = require("../dist/jql.js").JQL;

const ITEM_KEY = 'id';

const items = [
    {
	id: 1,
	k1: 1,
	ks1: "v1",
	kb: true
    },
    {
	id: 2,
	k1: 2,
	khoge: 'hoge',
	kb: false
    },
    {
	id: 3,
	ks1: "v1",
	khoge: 'ho!!ge',
	kb: false,
	knum: -14.5
    },
    {
	id:4,
	kb: true
    },
    {
	id:5,
	khoge: 'orehoge!',
	kb: true
    },
    {
	id:6,
	khoge: 'hoge!',
	kb: false
    },
    {
	id: 7,
	knum: -15
    }
];


test('Evaluate number value:', () => {
    const query = 'k1 = 1';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(1);
    const item = actual[0];
    expect(item.id).toBe(1);
    expect(item.k1).toBe(1);    
});

test('Evaluate number value:', () => {
    const query = 'knum = -15';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(1);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([7]);
});

test('Evaluate number value:', () => {
    const query = 'knum < -14 AND knum >= -15';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(2);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([3, 7]);
});

test('Evaluate string value', () => {
    const query = 'ks1 = "v1"';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(2);
    const ids = actual.map(x => x.id);
    const vals = actual.map(x => x.ks1);
    expect(ids).toEqual([1,3]);
    expect(vals.every(x => x === 'v1')).toBeTruthy();
});

test('Evaluate boolean value', () => {
    const query = 'kb = true';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(3);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([1, 4, 5]);
});

test('Evaluate condition with brackets', () => {
    const query = '(ks1 = "v1")';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(2);
    const ids = actual.map(x => x.id);
    const vals = actual.map(x => x.ks1);
    expect(ids).toEqual([1,3]);
    expect(vals.every(x => x === 'v1')).toBeTruthy();
});

test('Evaluate CONTAINS', () => {
    const _query = 'khoge CONTAINS "hoge"';
    for (const query of [_query, _query.replace('CONTAINS', 'contains')]) {
	const actual = JQL.filter(query, items, ITEM_KEY);
	expect(actual.length).toBe(3);
	const ids = actual.map(x => x.id);
	expect(ids).toEqual([2,5,6]);
    }
});

test('Evaluate AND', () => {
    const _query = '(khoge CONTAINS "hoge" AND kb = false)';
    for (const query of [_query, _query.replace('AND', 'and')]) {
	const actual = JQL.filter(query, items, ITEM_KEY);
	expect(actual.length).toBe(2);
	const ids = actual.map(x => x.id);
	expect(ids).toEqual([2, 6]);
    }
});

test('Evaluate OR', () => {
    const _query = '(khoge CONTAINS "hoge" OR kb = false)';
    for (const query of [_query, _query.replace('OR', 'or')]) {    
	const actual = JQL.filter(query, items, ITEM_KEY);
	expect(actual.length).toBe(4);
	const ids = actual.map(x => x.id);
	expect(ids).toEqual([2, 3, 5, 6]);
    }
});

test('Multiple AND', () => {
    const query = 'kb = false AND khoge CONTAINS "hoge" AND id > 4';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(1);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([6]);
});

test('Multiple OR', () => {
    const query = 'id <= 2 OR id = 4 OR id = 6'
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(4);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([1, 2, 4, 6]);
});

test('Multiple OR', () => {
    const query = 'id <= 2 OR id = 4 OR id = 6'
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(4);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([1, 2, 4, 6]);
});

test('Mixed logical operators is NOT permitted', () => {
    const query = 'id <= 2 AND id = 4 OR id = 6';
    try {
        const actual = JQL.filter(query, items, ITEM_KEY);
	expect(false).toBe(true);
    } catch (e) {
    }
});

test('Nested operators: #1', () => {
    const query = 'kb = false AND (khoge CONTAINS "hoge" AND id > 4)';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(1);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([6]);
});

test('Nested operators: #2', () => {
    const query = 'kb = false AND (khoge CONTAINS "hoge" OR id > 4)';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(2);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([2, 6]);
});

test('Nested operators: #3', () => {
    const query = '(kb = false AND id <= 3) OR (khoge CONTAINS "hoge" OR id > 4)';
    const actual = JQL.filter(query, items, ITEM_KEY);
    expect(actual.length).toBe(5);
    const ids = actual.map(x => x.id);
    expect(ids).toEqual([2, 3, 5, 6, 7]);
});

test('Multiple nested operators', () => {
    try {
	const query = '((kb = false AND id <= 3) OR (khoge CONTAINS "hoge" OR id > 4)) AND khoge = "hoge"';
	expect(false).toBe(true);
    } catch (e) {
    }
});
