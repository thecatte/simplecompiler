# Simple compiler - from code to ARM assembler
Custom language parser, compiler and code generator written in TypeScript.

Inspired by a great book written by Vladimir Keleshev "Compilling to Assembly".

# Usage
Currently all the code is in one file named `compiler.ts`. That is all code of the compiler, parser and code to compile itself.

## Custom language syntax by example
This is a valid code that should compile.
_Note:_ `putchar` is allowed as an external C call. 
```
function pair(x: number, y: number): array<number> {
    return [x, y];
}
function print_string(text: string, length: number): void {
    for(var i = 0; i != length; i = i + 1;) {
        putchar(text[i]);
    }
}
// by default functions return 'number' type
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
function main(){
    var arr = pair(65, 66);
    var firstElement = arr[0];

    var text = "to jest test 123";
    var length = 16;
    print_string(text, length);

    if (length != 16) {
        print_string("lt or gt 16", 11);
    } else {
        print_string("eq to 16", 8);
    }

    var factorialOfFive = factorial(5);
}
```
## Installing
### Prerequisites
- TypeScript >= v4.0.3
- Node >= v12.18.4

### Build steps
1. Clone the repo
2. cd to the root
3. Execute `tsc`
4. Execute `node ./out/compiler.js`


If on Mac/Linux use the shortcut script `./run`.

You will see generated ARM assembly code in your terminal.

## Edit code
The code to be compiled is stored in `var source` variable at the bottom of the main file `compiler.ts`.
Edit that text and try to compile it.

# Disclaimer
This is just a toy compiler project. Don't use it in production environments - it probably won't work!

## Thanks for checking out!