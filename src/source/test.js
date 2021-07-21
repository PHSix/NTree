
let a = {
  b: 1,
  c: 2,
}
let d = a;
a = 3;
d.b = 100
console.log(d.b)
