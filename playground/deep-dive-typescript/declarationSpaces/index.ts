/**
 * 型宣言空間(Type Declaration Space)
 */

class Foo {};
interface Bar {
    bar1: string;
};
type Bas = {
    bas1: number;
};

let foo: Foo;
let bar: Bar;
let bas: Bas;

/**
 * 変数宣言空間(Variable Declaration Space)
 */

class Fooo {
    foo1: string;
};
const someVar = Fooo; 
console.log(someVar); // [class Fooo]
const someOtherVar = 123;
