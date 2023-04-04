const oneTwoThree = [1, 2, 3];

let result = oneTwoThree.reduce((acc, cur, i) => {
  // console.log(acc, cur, i);
  return acc + cur;
}, 0);
// console.log(result);


const promiseFactory = (time) => {
  return new Promise((resolve, reject) => {
    console.log(time);
    setTimeout(resolve, time);
  });
};
[1000, 2000, 3000, 4000].reduce((acc, cur) => {
  return acc.then(() => promiseFactory(cur));
}, Promise.resolve());

/**  
 * 출 : https://www.zerocho.com/category/JavaScript/post/5acafb05f24445001b8d796d
*/