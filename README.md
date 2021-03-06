# artista-jql

Query language for JSON


## Installation
```sh
$ npm install artista-jql
```

### Browser
```sh
<script src="..../jql/dist/jql.js"></script>
```

### node.js
```sh
const JQL = require('..../jql/dist/jql.js').JQL;
```

## Quick Start

Filter following JSON data.

```sh
const items = [
  {
    id: 1,
    kb: true,
    foo: {
        bar: "FOO"
    }
  },
  {
    id: 2,
    kb: false,
    foo: {
        bar: "FOO"
    }
  },
  {
    id: 3,
    kb: false,
    foo: {
        bar: "BAR"
    }
  }
];
```

Query sample 1
```sh
const query = "kb = false";
const filteredItems = JQL.filter(query, items);
```

Return filtered items.

```sh
[
  {
    id: 2,
    kb: false
  },
  {
    id: 3,
    kb: false
  }
];
```

Query sample 2
```sh
const query = 'foo.bar = "BAR"';
const filteredItems = JQL.filter(query, items);
```

Return filtered items.

```sh
[
  {
    id: 3,
    kb: false
  }
];
```


## Grammar

### Supported data types for right value

| type    | example     |
| ---     | ---         |
| String  | "foo", "bar", ... |
| Number | 1, 200, -15, 14.5, ...       |
| Boolean | true false  |


### Logical Operators (case insensitive)

| operator | description         |
| ---      | ---                 |
| AND      | logical conjunction |
| OR       | logical sum         |
| !        | logical negation    |


### Comparison Operators (case insensitive)

| operator | description                                                                                                                              |
| ---      | ---                                                                                                                                      |
| =        | equal                                                                                                                                    |
| !=       | not equal                                                                                                                                |
| >=       | greater than or equal to                                                                                                                 |
| <=       | less than or equal to                                                                                                                    |
| >        | greater than                                                                                                                             |
| <        | less than                                                                                                                                |
| CONTAINS | Check if right value contains left value when right value is String<br>Or check if right value is in left array when left value is Array |


### Query examples

|      | sample queries                                            | description               |
|------|-----------------------------------------------------------|---------------------------|
| Good | name = "hoge"                                             | compare String            |
| Good | name contains "eorg"                                      | partial match with String |
| Good | age = 37, age < 30, age >= 3                              | compare Number            |
| Good | flag = true                                               | compare Boolean           |
| Good | name != "George"                                          | not equal                 |
| Good | person.age > 40                                           | JSON dot notation         |
| Good | k1 = "v1" AND k2 = "v2"                                   | AND operator              |
| Good | k1 = "v1" OR k2 = "v2"                                    | OR operator               |
| Good | k1 = "v1" AND k2 = "v2" ... AND kx= "vx"                  | multiple AND/OR operator  |
| BAD  | k1 = "v1" AND k2 = "v2" OR k3 = "v3"                      | mixed logical operators   |
| Good | ! (name contains "eorg")                                  | ! operator                |
| Good | (a = 1 AND b = 'foo') OR c = false                        | with brackets             |
| Good | (a = 1 OR b = 'foo') AND c = false                        | with brackets             |
| Good | (a = 1 OR b = 'foo') AND (c = false AND d CONTAINS 'bar') | with brackets             |
| BAD  | ((a = 1 AND b = 'foo') OR c = false) AND d CONTAINS 'bar' | nested brackets           |

