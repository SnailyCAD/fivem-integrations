function hello<T extends string>(greeting: T): `hello ${T}!` {
  return `hello ${greeting}!`;
}

console.log(hello("world"));
