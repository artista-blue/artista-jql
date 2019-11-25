///// Class Definition /////
{

const LogicalOperator = {
    AND: "AND",
    OR: "OR",
    fromString: function (str) {
        str = str.toUpperCase();
        const items = [LogicalOperator.AND, LogicalOperator.OR];
	for (const item of items) {
	    if (item === str) {
                return item;
            }
	}
	throw new Error(`Not supported: logical operator:${str}`);
    }
};

const cops = [['GE', '>='], ['LE', '<='], ['EQ', '==='], ['GT', '>'], ['LT', '<'], ['CONTAINS', 'CONTAINS']];
class ComparisonOperator {
    constructor(name, op) {
        this.name = name;
        this.op = op;
	let fml;
	if (name === 'CONTAINS') {
	    fml = `(a === undefined || a === null) ? false : a.includes(b)`;
        } else {
            fml = `a ${op} b`;
	}
        this.func = function (a, b) {
            return eval(fml);
        };
    }

    static fromString(str) {
        str = str === '=' ? '===' : str.toUpperCase();
        const items = cops.map(x => ComparisonOperator[x[0]]);
	for (const item of items) {
	    if (item.op === str) {
                return item;
            }
	}
	throw new Error(`Not supported: comparison operator:${str}`);
    }
}
for (const cop of cops) {
    const name = cop[0];
    const op = cop[1];
    ComparisonOperator[name] = new ComparisonOperator(name, op);
}


class Condition {
    constructor(k, op, v) {
        this.classname = "Condition";    
	this.key = k;
	this.op = op;
	this.value = v;
    }
}

class ConditionGroup {
    constructor(op, conditions) {
        this.classname = "ConditionGroup";
        this.op = op;
	this.conditions = conditions;
    }
}

}


start = Expression

///// Keywords /////
Escape   = "\\"
AND      = v:("AND" / "and") { return v.toUpperCase(); }
OR       = v:("OR" / "or") { return v.toUpperCase(); }
EQ       = "="
GT       = ">"
GE       = ">="
LT       = "<"
LE       = "<="
CONTAINS = v:("CONTAINS" / "contains") { return v.toUpperCase(); }
L_PAR    = "("
R_PAR    = ")"
DQ       = '"'
TRUE     = 'true'
FALSE    = 'false'


///// Types /////
DIGIT     = [0-9]
HEXDIG    = [0-9a-f]i
ws        = [ \t\n\r]*
Unescaped = [\x20-\x21\x23-\x5B\x5D-\u10FFFF]
String    = DQ chars:Char* DQ { return chars.join(""); }
Integer   = digits:DIGIT+ { return parseInt(digits.join("")); }
Boolean   = v:(TRUE / FALSE) { return v.toLowerCase() === 'true'; }
Key       = [^=\(\) \t\n\r]+ { return text(); }
Value     = String / Integer / Boolean
Char
  = Unescaped
  / Escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
     )
   { return sequence; }


///// Operators /////
ComparisonOperator
  = op:(GE / LE / EQ / GT / LT / CONTAINS) { return ComparisonOperator.fromString(text()); }

LogicalOperator
  = AND / OR { return LogicalOperator.fromString(text()); }


///// Expression /////
Expression
  = ws g:Grammar ws { return g; }

Grammar
  = cg:ConditionGroups { return cg; }


ConditionGroups
  = conds:(
      head:ConditionGroup
      tail:(ws op:LogicalOperator ws cg:ConditionGroup { return { op:op, cg:cg }; })?
      {
	if (!tail) {
            const items = [head];
	    return head;
	} else {
            const items = [head, tail.cg];
	    const op = tail.op;
            const cg = new ConditionGroup(op, items);
            return cg;
        }
       }
    )

ConditionGroup
  =  L_PAR ws cg:_ConditionGroup ws R_PAR { return cg; }
    / cg:_ConditionGroup {
      return cg;
    }

_ConditionGroup
  = conds:(
      head:(cond:Condition { return { op:LogicalOperator.AND, cond:cond}; })
      tail:(ws op:LogicalOperator ws cond:Condition { return { op:op, cond:cond }; })*
      {
        const items = [head].concat(tail);
	const conds = items.map(x => { return x.cond; });
	let cg;
	if (items.length === 1) {
	    cg = new ConditionGroup(LogicalOperator.AND, conds);
        } else {
            const ops = items.map(x => { return x.op; });
	    ops.shift();
            const opSet = new Set(ops);
            if (opSet.size > 1) {
                throw 'AND と OR は併用できません';
            }
	    const op = opSet.values().next().value;
            cg = new ConditionGroup(op, conds);
	}
	return cg;
      }
    )?	

Condition
  = k:Key ws op:ComparisonOperator ws v:Value { return new Condition(k, op, v); }
