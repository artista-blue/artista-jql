class JsonUtils {

    static get SEQ_ID_KEY () {
	return '__JQL_SEQ_ID';
    }

    static get_value_from_path(original_json, json_path) {
	const elements = json_path.split(".");
	let json = original_json;
	let exist = true;
	if (!elements) {
	    return undefined;
	}
	for (const element of elements) {
	    if (!json) {
		exist = false;
		break;
	    }
	    json = json[element];
	}
	if (!exist) {
	    return undefined;
	}
	return json;
    }

    static add_seq_id(items) {
	for (let i = 0; i < items.length; i ++) {
	    const item = items[i];
	    item[JsonUtils.SEQ_ID_KEY] = i + 1;
	}
    }

    static del_seq_id(items) {
	for (const item of items) {
	    delete item[JsonUtils.SEQ_ID_KEY];
	}
    }
}


class SetUtils {

    static sub(setA, setB) {
        const _difference = new Set(setA);
	for (var elem of setB) {
            _difference.delete(elem);
	}
	return _difference;
    }

    static or(setList) {
	const merged = new Set();
	for (const set of setList) {
	    for (const item of set) {
		merged.add(item);
	    }
	}
	return merged;
    }

    static and(idSetList) {
	const allIdSet = SetUtils.or(idSetList);
	const set = new Set();
	for (const id of allIdSet) {
	    let flag = true;
	    for (const idSet of idSetList) {
		if (!idSet.has(id)) {
		    flag = false;
		    break;
		}
	    }
	    if (flag === true) {
		set.add(id);
	    }
	}
	return set;
    }
}


class ItemFilter {

    constructor (configGroup, items) {
	this.configGroup = configGroup;
	this.original_items = items;
	this.items = Array.from(this.original_items);
    }

    _contains (item, key, operator, value) {
	const act = JsonUtils.get_value_from_path(item, key);
	const func = operator.func;
	return func(act, value);
    }
    
    _calc_condition(cond) {
	const ids = [];
	const key = cond.key;
	const op = cond.op;
	const value = cond.value;
	for (const item of this.items) {
	    if (!this._contains(item, key, op, value)) {
		continue;
	    }
	    ids.push(item[JsonUtils.SEQ_ID_KEY]);
	}
	cond.ids = ids;
    }

    _calc_condition_group(cg) {
	const idSetList = [];
	const children = cg.conditions;
	for (const child of children) {
	    const ids = child.ids;
	    if (ids) {
		idSetList.push(new Set(ids));
		continue;
	    }
	    idSetList.push(null);
	    this._calc(child);
	}
	if (idSetList.some(x => x === null)) {
	    return;
	}
	let filteredIds;
	switch (cg.op) {
	case 'AND':	    
	    filteredIds = SetUtils.and(idSetList);
	    break;
	case 'OR':
	    filteredIds = SetUtils.or(idSetList);
	    break;
	default:
	    throw new Error();
	}
	// Evaluate ! (NOT)
	if (cg.not === true) {
	    const itemIdSet = new Set(this.items.map(x => x.id));
	    const sub = SetUtils.sub(itemIdSet, filteredIds);
            cg.ids = sub
	} else {
            cg.ids = filteredIds;
	}
    }

    _calc(cond) {
	if (cond.ids) {
	    return;
	}
	const className = cond.constructor.name;
	switch(className) {
	case 'Condition':
	    this._calc_condition(cond);		
	    break;
	case 'ConditionGroup':
	    this._calc_condition_group(cond);
	    break;
	}
    }

    _filterItem() {
	const items = [];
	const idSet = this.configGroup.ids;	
	for (const item of this.items) {
	    if (idSet.has(item.id)) {
		items.push(item);
	    }
	}
	return items;
    }

    execute () {
	while (!this.configGroup.ids) {
	    this._calc(this.configGroup);
	}
	return this._filterItem();
    }
}

class JQL {

    static filter(query, items) {
	const condition = PEG.parse(query);
	JsonUtils.add_seq_id(items);
	const filter = new ItemFilter(condition, items);
	const filteredItems = filter.execute();
	JsonUtils.del_seq_id(filteredItems);
	return filteredItems;
    }
}

if (!this.window) {
    module.exports = {
	PEG: PEG,
	JQL: JQL
    };
}
