# 型について
## 基本の型
https://www.typescriptlang.org/docs/handbook/basic-types.html

### Boolean
真偽値型

```
const isMan: boolean = true;
const isWoman: boolean = false;
```

### Number
数値型<br>
16進リテラルおよび10進リテラルに加えて、ECMAScript 2015で導入されたバイナリおよび8進リテラルもサポートしている

```
const decimal: number = 6;
const hex: number = 0xf00d;
const binary: number = 0b1010;
const octal: number = 0o744;
```

### String
文字列型

```
const good: string = "スイカ";
const bad: string = '人参';
const message = `${good}は好きだけど${bad}は嫌い`;
```

### Array

```
const list1: number[] = [1, 2, 3];
const list2: Array<number> = [1, 2, 3];
```

### Tuple
要素数が分かっている配列の表現できる型

```
let tuple: [string, number];
tuple = ['apple', 10];      // OK
tuple = [10, 'orange'];     // NG
tuple = ['apple', 10, 1];   // NG

tuple[4] = 1; // これだと指定要素数を超えても代入できるが 'string | number'のUnionTypeになる
tuple[4] = true;  // なのでこれはNG
```

### Enum
列挙型

```
enum Color { Red, Green, Blue }
const c: Color = Color.Red;
console.log(colorName);  // -> 0
```

何も指定しなければRedを0とし順番付けされていく、最初の数字を変えたい場合は

```
enum Color { Red = 1, Green, Blue }
const c: Color = Color.Red;
console.log(colorName);  // -> 1
```

それぞれに指定することも可

```
enum Color { Red = 1, Green = 2, Blue = 4 }
const colorName = Color[4]; // 逆引きもできる
console.log(colorName);  // -> `Blue`
```

文字列も指定可能

```
enum Color { Red = '#FF0000', Green = '#00FF00', Blue = '#0000FF' }
console.log(Color.Red)  // -> '#FF0000'
```

### Any
既存のJavaScriptコードをTypeScriptにする時など型がわからない場合に使う型

```
let value: any = 'Hello World!';
value = 1;    // OK
value = true; // OK

const values: any[] = [1, 'orange', true];
```

ただし、以下の場合などコンパイルがとおってしまうので `any` の多用はお勧めできない

```
let value = 'apple';
console.log(value.indexOf('a'));  // -> 0
value = 1;
console.log(value.indexOf('a'));  // -> Uncaught TypeError: value.indexOf is not a function
```

### Void
どんな型も持たない型（`any` の反対のような型）
戻り値のない関数に利用することが多い

```
function say(): void {
  alert('UNKO!');
}
```

`void` で変数定義もできるが `null` と `undefined` しか許容しないので意味がない

```
let value: void;
value = null;       // OK
value = undefined;  // OK
value = 1;          // NG
value = 's';        // NG
value = false;      // NG
```

### Null and Undefined
`undefined` と `null` はそれぞれ型として存在する
意味はないが変数定義もできる

```
let apple: undefined = undefined;
let orange: null = null;
```

`undefined` と `null` は**全ての型のサブタイプ**

```
let man: string = 'taka';
man = null;       // OK
```

`tsconfig.json` に `strictNullChecks` のオプションを追加することによりnull非許容型にできる<br>
`undefined` や `null` を許可したい場合はユニオンタイプで指定する

```
let man: string = 'kato';
man = null;       // NG

let woman: string | null = 'akane';
woman = null;     // OK
```

### Never
決して発生することのない値の型<br>
`never` は**全ての型のサブタイプ**<br>
`never` 自身を除きどのよう型も `never` のサブタイプにはならない（`any`**も不可**）

わかり辛いが以下のように関数の終端に達しないものが `never` である

```
function error(message: string): never {
    throw new Error(message);
}

function fail() {
    return error("Something failed");
}

function infiniteLoop(): never {
    while (true) {
    }
}
```

### Object
非プリミティブ型（`number`、`string`、`boolean`、`symbol`、`null` または `undefined` でないものを表す型）<br>
Object.createのようなAPIをよりよく表現できる

```
declare function create(o: object | null): void;

create({ prop: 0 });  // OK
create(null);         // OK

create(42);           // Error
create("string");     // Error
create(false);        // Error
create(undefined);    // Error
```




