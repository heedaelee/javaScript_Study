import React, { forwardRef, useImperativeHandle, useState } from 'react';

export const initialRows = [
  {
    name: 'Charles',
    age: 20,
  },
  {
    name: 'Dante',
    age: 21,
  },
  {
    name: 'Peter',
    age: 22,
  },
];

const DataTable = forwardRef(({ rows }, ref) => {
  const [count, setCounts] = useState(0);
  const [name, setName] = useState();
  console.log('name : ', name);
  console.log('ref : ', ref);

  useImperativeHandle(ref, () => ({
    count,
    setCounts,
    name,
    setName,
  }));

  const onClick = name => {
    setName(name);
  };

  return (
    <div>
      {rows.map(({ name, age }) => {
        return (
          <div key={name} onClick={() => onClick(name)}>
            <span>name: {name}</span>
            <span>age: {age}</span>{' '}
          </div>
        );
      })}
    </div>
  );
});

DataTable.displayName = 'DataTable';

export default DataTable;
