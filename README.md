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
    kb: true
  },
  {
    id: 2,
    kb: false
  },
  {
    id: 3,
    kb: false
  }
];

const itemKey = 'id';  // identity for object
const query = "kb = false";
const filteredItems = JQL.filter(query, items, itemKey);
```

Return value

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


## Grammar

### Logical Operator

* AND
* OR


### Comparison Operator

* =
* >=
* <=
* >
* <
* CONTAINS 


### Query examples

* OK: (a = 1 AND b = 'foo')
* OK: (a = 1 AND b = 'foo' and c = true)
* BAD: (a = 1 AND b = 'foo' OR c = false)
* OK: (a = 1 AND b = 'foo') OR c = false
* OK: (a = 1 OR b = 'foo') AND c = false
* OK: (a = 1 OR b = 'foo') AND (c = false AND d CONTAINS 'bar')
* BAD: ((a = 1 AND b = 'foo') OR c = false) AND d CONTAINS 'bar'

