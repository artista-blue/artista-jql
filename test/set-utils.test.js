const rewire = require('rewire');

const jql = rewire("../dist/jql.js");
const SetUtils = jql.__get__("SetUtils");


test('sub: 1', () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([2, 4]);
    const subSet = SetUtils.sub(set1, set2);
    exp = [1, 3, 5];
    expect(subSet.size).toBe(exp.length);
    for (const item of exp) {
	expect(subSet.has(item)).toBeTruthy();
    }
});

test('sub: 2', () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([]);
    const subSet = SetUtils.sub(set1, set2);
    exp = [1, 2, 3, 4, 5];
    expect(subSet.size).toBe(exp.length);
    for (const item of exp) {
	expect(subSet.has(item)).toBeTruthy();
    }
});

test('sub: 3', () => {
    const set1 = new Set([]);
    const set2 = new Set([1, 2, 3, 4, 5]);
    const subSet = SetUtils.sub(set1, set2);
    exp = [];
    expect(subSet.size).toBe(exp.length);
    for (const item of exp) {
	expect(subSet.has(item)).toBeTruthy();
    }
});

test('sub: 4', () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([2, 4, 6]);
    const subSet = SetUtils.sub(set1, set2);
    exp = [1, 3, 5];
    expect(subSet.size).toBe(exp.length);
    for (const item of exp) {
	expect(subSet.has(item)).toBeTruthy();
    }
});

test('merge: 1', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([4, 5, 6]);
    const setList = [set1, set2];
    const merged = SetUtils.merge(setList);
    exp = [1, 2, 3, 4, 5, 6];
    expect(merged.size).toBe(exp.length);
    for (const item of exp) {
	expect(merged.has(item)).toBeTruthy();
    }
});

test('merge: 2', () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([2, 3, 4]);
    const setList = [set1, set2];
    const merged = SetUtils.merge(setList);
    exp = [1, 2, 3, 4];
    expect(merged.size).toBe(exp.length);
    for (const item of exp) {
	expect(merged.has(item)).toBeTruthy();
    }
});

test('merge: 3', () => {
    const set1 = new Set([]);
    const set2 = new Set([]);
    const setList = [set1, set2];
    const merged = SetUtils.merge(setList);
    exp = [];
    expect(merged.size).toBe(exp.length);
    for (const item of exp) {
	expect(merged.has(item)).toBeTruthy();
    }
});

test('merge: 4', () => {
    const set1 = new Set([]);
    const set2 = new Set([2, 3, 4]);
    const setList = [set1, set2];
    const merged = SetUtils.merge(setList);
    exp = [2, 3, 4];
    expect(merged.size).toBe(exp.length);
    for (const item of exp) {
	expect(merged.has(item)).toBeTruthy();
    }
});
