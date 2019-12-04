const rewire = require('rewire');

const jql = rewire("../dist/jql.js");
const JsonUtils = jql.__get__("JsonUtils");


test('SEQ_ID_KEY', () => {
    expect(JsonUtils.SEQ_ID_KEY).toBe('__JQL_SEQ_ID');
});

test('get_value_from_path', () => {
    const obj = {
	a: 1,
	b: {
	    c: "hoge",
	    d: {
		e: false
	    }
	}
    };
    expect(JsonUtils.get_value_from_path(obj, 'a')).toBe(1);
    expect(JsonUtils.get_value_from_path(obj, 'b.c')).toBe("hoge");
    expect(JsonUtils.get_value_from_path(obj, 'b.d.e')).toBe(false);
});

test('add_seq_id, del_seq_id', () => {
    const items = [
	{a: true},
	{b: 1},
	{a: false, c: "hoge"}
    ]
    JsonUtils.add_seq_id(items);
    let i = 0;
    for (const item of items) {
	i++;
	expect(item[JsonUtils.SEQ_ID_KEY]).toBe(i);
    }
    JsonUtils.del_seq_id(items);
    for (const item of items) {
	expect(JsonUtils.SEQ_ID_KEY in item).toBeFalsy();
    }
});
