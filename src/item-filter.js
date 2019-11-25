class JsonUtils {

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
}


class ItemFilter {

    constructor (configGroup, items, itemKey) {
	this.configGroup = configGroup;
	this.original_items = items;
	this.items = Array.from(this.original_items);
	this.itemKey = itemKey;
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
	    ids.push(item[this.itemKey]);
	}
	//console.log(`${key} ${op} ${value}: ids=${ids}`);
	cond.ids = ids;
    }

    _get_all_id_set(idSetList) {
	const set = new Set();
	for (const idSet of idSetList) {
	    for (const id of idSet) {
		set.add(id);
	    }
	}
	return set;
    }

    _get_common_id_set(allIdSet, idSetList) {
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
	const allIdSet = this._get_all_id_set(idSetList);
	let filteredIds;
	switch (cg.op) {
	case 'AND':	    
	    filteredIds = this._get_common_id_set(allIdSet, idSetList);
	    break;
	case 'OR':
	    filteredIds = allIdSet;
	    break;
	default:
	    throw new Error();
	}
	cg.ids = filteredIds;
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

    static filter(query, items, itemKey) {
	const condition = PEG.parse(query);
	const filter = new ItemFilter(condition, items, itemKey);
	return filter.execute();
    }
}

if (!this.window) {
    module.exports = {
	PEG: PEG,
	JQL: JQL
    };
}
