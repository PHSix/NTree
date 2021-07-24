const arr1 = [1, 2, 3, 4, 6, 5];
const arr2 = [1, 2, 3, 5];
let a = 2;
a = arr1.find((value) => {
  return value > 100;
});

console.log(a);
