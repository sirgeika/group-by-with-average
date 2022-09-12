# group-by-with-average
Collapses an array of objects at the specified object properties 
and counts average values of specified fields.

```bash
npm install group-by-with-average
```

```js
const groupBy = require('group-by-with-average');

const arr = [
  { name: 'Vasya', who: 'man', weight: 100 },
  { name: 'Vasya', who: 'man', weight: 90 },
  { name: 'Kolya', who: 'man', weight: 50 },
  { name: 'Katya', who: 'woman', weight: 90 },
  { name: 'Olya', who: 'woman', weight: 100 }
];

const whoWithWeight = groupBy(arr, 'who', 'weight');
/* [
    { who: 'man', weight: 80 },
    { who: 'woman', weight: 95 }
  ]
*/ 
```

For more examples of using groupBy see [groupByWithSum](https://github.com/sirgeika/group-by-with-sum).