class KeyValuePair<K, V>
{
    constructor(public key: K,
                public value: V){ }
}

class Label {
    static counter = 0;
    value: number;

    constructor() {
        this.value = Label.counter++;
    }

    toString() {
        return `.L${this.value}`;
    }
}

class Environment {
    constructor(public locals: Map<string, number>,
                public nextLocalOffset: number) { }
}

interface Type {
    equals(other: Type): boolean;
    toString(): string;
}

class BoolType implements Type {
    constructor() { }
    equals(other: Type): boolean { return typeof(other) === typeof(this); }
    toString(): string { return "bool"; }
}

class NumberType implements  Type {
    constructor() { }
    equals(other: Type): boolean { return typeof(other) === typeof(this); }
    toString(): string { return "number"; }
}

class VoidType implements  Type {
    constructor() { }
    equals(other: Type): boolean { return typeof(other) === typeof(this); }
    toString(): string { return "void"; }
}

class ArrayType implements Type {
    constructor(public element: Type) { }
    equals(other: Type): boolean { 
        return typeof(other) === typeof(this) 
        && typeof((other as ArrayType).element) === typeof(this.element)
    }
    toString(): string {
        return `Array<${this.element.toString()}>`;
    }
}

class StringType implements Type {
    equals(other: Type): boolean { return typeof(other) === typeof(this); }
    toString(): string { return "string"; }
}

class FunctionType implements Type {
    constructor(public parameters: Map<string, Type>,
                public returnType: Type) { }
    equals(other: Type): boolean {
        return other instanceof FunctionType;
    }
    toString(): string {
        throw new Error("Method not implemented.");
    }
}

function assertType(expected: Type, got: Type): void {
    if(!expected.equals(got)) {
        throw TypeError(
            `Expected ${expected}, but got ${got}`
        );
    }
}

interface AST {
    visit<T>(v: Visitor<T>): T;
    equals(AST): boolean;
}

class Num implements AST {
    constructor(public value: number) { }
    visit<T>(v: Visitor<T>) {
        return v.visitNum(this);
    }
    equals(other: AST) { return false; }
}

class Bool implements AST {
    constructor(public value: boolean) { }
    visit<T>(v: Visitor<T>) {
        return v.visitBool(this);
    }
    equals(AST: any): boolean { return false; }

}

class Undefined implements AST {
    constructor() { }
    visit<T>(v: Visitor<T>) {
        return v.visitUndefined(this);
    }
    equals(AST: any): boolean { return false; }
    
}

class Null implements AST {
    constructor() { }
    visit<T>(v: Visitor<T>) {
        return v.visitNull(this);
    }
    equals(AST: any): boolean { return false; }

}

class Id implements AST {
    constructor(public value: string) { }
    visit<T>(v: Visitor<T>) {
        return v.visitId(this);
    }
    equals(other: AST) { return false; }
}

class Not implements AST {
    constructor(public term: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitNot(this);
    }
    equals(other: AST) { return false; }
}

class Equal implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitEqual(this);
    }
    equals(other: AST) { return false; }
}

class NotEqual implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitNotEqual(this);
    }
    equals(other: AST) { return false; }
}

class Add implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitAdd(this);
    }
    equals(other: AST) { return false; }
}

class Subtract implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitSubtract(this);
    }
    equals(other: AST) { return false; }
}

class Multiply implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitMultiply(this);
    }
    equals(other: AST) { return false; }
}

class Divide implements AST {
    constructor(public left: AST, public right: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitDivide(this);
    }
    equals(other: AST) { return false; }
}

class Call implements AST {
    constructor(public callee: string,
        public args: Array<AST>) { }
    visit<T>(v: Visitor<T>) {
        return v.visitCall(this);
    }
    equals(other: AST) {
        return other instanceof Call &&
            this.callee === other.callee && // always use ===
            this.args.length === other.args.length &&
            this.args.every((arg, i) =>
                arg.equals(other.args[i]));
    }
}

class Return implements AST {
    constructor(public term: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitReturn(this);
    }
    equals(other: AST) { return false; }
}

class Block implements AST {
    constructor(public statements: Array<AST>) { }
    visit<T>(v: Visitor<T>) {
        return v.visitBlock(this);
    }
    equals(other: AST) { return false; }
}

class If implements AST {
    constructor(public conditional: AST,
        public consequence: AST,
        public alternative: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitIf(this);
    }
    equals(other: AST) { return false; }
}

class Func implements AST {
    constructor(public name: string,
        public signature: FunctionType,
        public body: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitFunc(this);
    }
    // setUpEnvironment() {
    //     let locals = new Map();
    //     this.parameters.forEach((parameter, i) => {
    //         locals.set(parameter, 4 * i - 16);
    //     });
    //     let nextLocalOffset = -20;
    //     return new CodeGenerator(locals, nextLocalOffset);
    // }
    emitPrologue() {
        emit(`  push {fp, lr}`);
        emit(`  mov fp, sp`);
        emit(`  push {r0, r1, r2, r3}`);
    }
    emitEpilogue() {
        emit(`  mov sp, fp`);
        emit(`  mov r0, #0`);
        emit(`  pop {fp, pc}`);
    }
    equals(other: AST) { return false; }
}

class Var implements AST {
    constructor(public name: string, public value: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitVar(this);
    }
    equals(other: AST) { return false; }
}

class Assign implements AST {
    constructor(public name: string,
        public value: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitAssign(this);
    }
    equals(other: AST) { return false; }
}

class While implements AST {
    constructor(public conditional: AST,
        public body: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitWhile(this);
    }
    equals(other: AST) { return false; }
}

class For implements AST {
    constructor(public conditional: AST,
        public body: AST,
        public assign: AST,
        public step: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitFor(this);
    }
    equals(AST: any): boolean { return false; }
}

class ArrayLiteral implements AST {
    constructor(public elements: Array<AST>) { }
    visit<T>(v: Visitor<T>) {
        return v.visitArrayLiteral(this);
    }
    equals(AST: any): boolean { return false; }
}

class StringLiteral extends ArrayLiteral {
    constructor(public text: string) {
        super(text.split('').map((char, i) => new Num(text.charCodeAt(i))));
    }
}

class ArrayLookup implements AST {
    constructor(public array: AST, public index: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitArrayLookup(this);
    }
    equals(AST: any): boolean { return false; }
}

class Length implements AST {
    constructor(public array: AST) { }
    visit<T>(v: Visitor<T>) {
        return v.visitLength(this);
    }
    equals(AST: any): boolean { return false; }
}

interface Visitor<T> {
    visitNum(node: Num): T;
    visitBool(node: Bool): T;
    visitUndefined(node: Undefined): T;
    visitNull(node: Null): T;
    visitId(node: Id): T;
    visitNot(node: Not): T;
    visitEqual(node: Equal): T;
    visitNotEqual(node: NotEqual): T;
    visitAdd(node: Add): T;
    visitSubtract(node: Subtract): T;
    visitMultiply(node: Multiply): T;
    visitDivide(node: Divide): T;
    visitCall(node: Call): T;
    visitReturn(node: Return): T;
    visitBlock(node: Block): T;
    visitIf(node: If): T;
    visitFunc(node: Func): T;
    visitVar(node: Var): T;
    visitAssign(node: Assign): T;
    visitWhile(node: While): T;
    visitFor(node: For): T;
    visitArrayLiteral(node: ArrayLiteral): T;
    visitStringLiteral(node: StringLiteral): T;
    visitArrayLookup(node: ArrayLookup): T;
    visitLength(node: Length): T;
}

class CodeGenerator implements Visitor<void> {
    constructor(public locals: Map<string, number> = new Map(),
                public nextLocalOffset: number = 0) { }
    visitNum(node: Num): void {
        emit(`  ldr r0, =${node.value}`);
    }
    visitBool(node: Bool): void {
        if(node.value) {
            emit(`  mov r0, #1`);
        } else {
            emit(`  mov r0, #0`);
        }
    }
    visitUndefined(node: Undefined): void {
        emit(`  mov r0, #0`);
    }
    visitNull(node: Null): void {
        emit(`  mov r0, #0`);
    }
    visitId(node: Id): void {
        let offset = this.locals.get(node.value);
        if(offset) {
            emit(`  ldr r0, [fp, #${offset}]`);
        } else {
            throw Error(`Undefined variable: ${node.value}`);
        }
    }
    visitNot(node: Not): void {
        node.term.visit(this);

        emit(`  cmp r0, #0`)
        emit(`  moveq r0, #1`);
        emit(`  movne r0, #0`);
    }
    visitEqual(node: Equal): void {
        node.right.visit(this);
        emit(`push {r0, ip}`);
        node.left.visit(this);
        emit(`pop {r1, ip}`);
        emit(`cmp r0, r1`);
        emit(`moveq r0, #1`);
        emit(`movne r0, #0`);
    }
    visitNotEqual(node: NotEqual): void {
        node.right.visit(this);
        emit(`push {r0, ip}`);
        node.left.visit(this);
        emit(`pop {r1, ip}`);
        emit(`cmp r0, r1`)
        emit(`moveq r0, #0`);
        emit(`movne r0, #1`);
    }
    visitAdd(node: Add): void {
        node.left.visit(this);
        emit(`push {r0, ip}`);
        node.right.visit(this);
        emit(`pop {r1, ip}`);
        emit(`add r0, r0, r1`);
    }
    visitSubtract(node: Subtract): void {
        node.right.visit(this);
        emit(`push {r0, ip}`);
        node.left.visit(this);
        emit(`pop {r1, ip}`);
        emit(`sub r0, r0, r1`);
    }
    visitMultiply(node: Multiply): void {
        node.right.visit(this);
        emit(`push {r0, ip}`);
        node.left.visit(this);
        emit(`pop {r1, ip}`);
        emit(`mul r0, r0, r1`);
    }
    visitDivide(node: Divide): void {
        node.right.visit(this);
        emit(`push {r0, ip}`);
        node.left.visit(this);
        emit(`pop {r1, ip}`);
        emit(`udiv r0, r0, r1`);
    }
    visitCall(node: Call): void {
        let count = node.args.length;
        if (count === 0) {
            emit(`  bl ${node.callee}`);
        } else if (count === 1) {
            node.args[0].visit(this);
            emit(`  bl ${node.callee}`);
        } else if (count >= 2 && count <= 4) {
            emit(`  sub sp, sp, #16`);
            node.args.forEach((arg, i) => {
                arg.visit(this);
                emit(`  str r0, [sp, #${4 * i}]`);
            });
            emit(`  pop {r0, r1, r2, r3}`);
            emit(`  bl ${node.callee}`);
        }
        else {
            throw Error(
                "More than 4 arguments are not supported");
        }
    }
    visitReturn(node: Return): void {
        node.term.visit(this);
        emit(`  mov sp, fp`);
        emit(`  pop {fp, pc}`);
    }
    visitBlock(node: Block): void {
        node.statements.forEach((statement) =>
            statement.visit(this)
        );
    }
    visitIf(node: If): void {
        let ifFalseLabel = new Label();
        let endIfLabel = new Label();

        node.conditional.visit(this);
        emit(`  cmp r0, #0`);
        emit(`  beq ${ifFalseLabel}`);
        node.consequence.visit(this); // if(conditions) = true
        emit(`  b ${endIfLabel}`);
        emit(`${ifFalseLabel}:`); // if(conditions) = false
        node.alternative.visit(this);
        emit(`${endIfLabel}:`);
    }
    visitFunc(node: Func): void {
        if(node.signature.parameters.entries.length > 4) {
            throw Error("More than 4 params is not supported!");
        }
        
        emit(``);
        emit(`.global ${node.name}`);
        emit(`${node.name}:`);
        node.emitPrologue(); // these emits can cause bugs later - WATCH OUT!
        let locals = new Map();
        let i = 0;
        node.signature.parameters.forEach((type, name, map) => {
            locals.set(name, 4 * i - 16);
            i++;
        });
        let nextLocalOffset = -20;
        let env = new CodeGenerator(locals, nextLocalOffset);
        node.body.visit(env);
        node.emitEpilogue();
    }
    visitVar(node: Var): void {
        node.value.visit(this);
        emit(`  push {r0, ip}`);
        this.locals.set(node.name, this.nextLocalOffset - 4);
        this.nextLocalOffset -= 8;
    }
    visitAssign(node: Assign): void {
        node.value.visit(this);
        let offset = this.locals.get(node.name);
        if(offset) {
            emit(`  str r0, [fp, #${offset}]`);
        } else {
            throw Error(`Undefined variable: ${node.name}`);
        }
    }
    visitWhile(node: While): void {
        let loopStart = new Label();
        let loopEnd = new Label();

        emit(`${loopStart}:`);
        node.conditional.visit(this);
        emit(`  cmp r0, #0`);
        emit(`  beq ${loopEnd}`);
        node.body.visit(this);
        emit(`  b ${loopStart}`);
        emit(`${loopEnd}:`);
    }
    visitFor(node: For): void {
        let loopStart = new Label();
        let loopEnd = new Label();

        node.assign.visit(this);
        emit(`${loopStart}:`);
        node.conditional.visit(this);
        emit(`  cmp r0, #0`);
        emit(`  beq ${loopEnd}`);
        node.body.visit(this);
        node.step.visit(this);
        emit(`  b ${loopStart}`);
        emit(`${loopEnd}:`);
    }
    visitArrayLiteral(node: ArrayLiteral): void {
        let length = node.elements.length;
        emit(`  ldr r0, =${4 * (length + 1)}`); // space needed
        emit(`  bl malloc`); // alloc space and put address in r0
        emit(`  push {r4, ip}`); // push r4 to side
        emit(`  mov r4, r0`); // put address to r4
        emit(`  ldr r0, =${length}`); // store length in r0
        emit(`  str r0, [r4]`); // store length to heap
        node.elements.forEach((element, i) => {
            element.visit(this);
            emit(`  str r0, [r4, #${4 * (i + 1)}]`); // store val to heap after length
        });
        emit(`  mov r0, r4`);
        emit(`  pop {r4, ip}`);
    }
    visitStringLiteral(node: StringLiteral): void {
        this.visitArrayLiteral(node);
    }
    visitArrayLookup(node: ArrayLookup): void {
        node.array.visit(this); // array pointer in r0
        emit(`  push {r0, ip}`); // array pointer on stack
        node.index.visit(this); // array index in r0
        emit(`  pop {r1, ip}`); // array pointer to r1
        emit(`  ldr r2, [r1]`); // load array length (first el) to r2
        emit(`  cmp r0, r2`); // compare index with length
        emit(`  movhs r0, #0`); // if index >= length set r0 to 0
        emit(`  addlo r1, r1, #4`); // if index < length then r1 += 4
        emit(`  lsllo r0, r0, #2`); // if index < length then Logical Shift Left r0 by 2 (virtually the same as multiplying by 4)
        emit(`  ldrlo r0, [r1, r0]`); // if index < length then set r0 to value at [r1 + r0]
    }
    visitLength(node: Length): void {
        node.array.visit(this); // r0 has now pointer to array on heap
        emit(`  ldr r0, [r0, #0]`); // set r0 to array length stored as first el on heap
    }

    
}

class TypeChecker implements Visitor<Type> {
    constructor(public locals: Map<string, Type>,
                public functions: Map<string, FunctionType>,
                public currentFunctionReturnType: Type | null) { }
    visitNum(node: Num): Type {
        return new NumberType();
    }
    visitBool(node: Bool): Type {
        return new BoolType();
    }
    visitUndefined(node: Undefined): Type {
        return new VoidType();
    }
    visitNull(node: Null): Type {
        return new VoidType();
    }
    visitId(node: Id): Type {
        let type = this.locals.get(node.value);
        if(!type) {
            throw TypeError(`Undefined variable ${node.value}`);
        }
        return type;
    }
    visitNot(node: Not): Type {
        assertType(new BoolType(), node.term.visit(this));
        return new BoolType();
    }
    visitEqual(node: Equal): Type {
        let leftType = node.left.visit(this);
        let rightType = node.right.visit(this);
        assertType(leftType, rightType);
        return new BoolType();
    }
    visitNotEqual(node: NotEqual): Type {
        let leftType = node.left.visit(this);
        let rightType = node.right.visit(this);
        assertType(leftType, rightType);
        return new BoolType();
    }
    visitAdd(node: Add): Type {
        assertType(new NumberType(), node.left.visit(this));
        assertType(new NumberType(), node.right.visit(this));
        return new NumberType();
    }
    visitSubtract(node: Subtract): Type {
        assertType(new NumberType(), node.left.visit(this));
        assertType(new NumberType(), node.right.visit(this));
        return new NumberType();
    }
    visitMultiply(node: Multiply): Type {
        assertType(new NumberType(), node.left.visit(this));
        assertType(new NumberType(), node.right.visit(this));
        return new NumberType();
    }
    visitDivide(node: Divide): Type {
        assertType(new NumberType(), node.left.visit(this));
        assertType(new NumberType(), node.right.visit(this));
        return new NumberType();
    }
    visitCall(node: Call): Type {
        let expected = this.functions.get(node.callee);
        if(!expected) {
            throw TypeError(
                `Function ${node.callee} is not defined`
            );
        }

        let argsTypes = new Map();
        node.args.forEach((arg, i) =>
            argsTypes.set(`x${i}`, arg.visit(this))
        );

        let got = new FunctionType(argsTypes, expected.returnType);
        assertType(expected, got);
        return expected.returnType;
    }
    visitReturn(node: Return): Type {
        let type = node.term.visit(this);
        if(this.currentFunctionReturnType) {
            assertType(this.currentFunctionReturnType, type);
            return new VoidType();
        } else {
            throw TypeError(
                `Encountered return statement outside any function`
            );
        }
    }
    visitBlock(node: Block): Type {
        node.statements.forEach((statement) => statement.visit(this));
        return new VoidType();
    }
    visitIf(node: If): Type {
        node.conditional.visit(this);
        node.consequence.visit(this);
        node.alternative.visit(this);
        return new VoidType();
    }
    visitFunc(node: Func): Type {
        this.functions.set(node.name, node.signature);
        let visitor = new TypeChecker(
            new Map(node.signature.parameters),
            this.functions, node.signature.returnType
        );
        node.body.visit(visitor);

        return new VoidType();
    }
    visitVar(node: Var): Type {
        let type = node.value.visit(this);
        this.locals.set(node.name, type);
        return new VoidType();
    }
    visitAssign(node: Assign): Type {
        let variableType = this.locals.get(node.name);
        if(!variableType) {
            throw TypeError(
                `Assignment to an undefined variable ${node.name}`
            );
        }
        let valueType = node.value.visit(this);
        assertType(variableType, valueType);
        return new VoidType();
    }
    visitWhile(node: While): Type {
        node.conditional.visit(this);
        node.body.visit(this);
        return new VoidType();
    }
    visitFor(node: For): Type {
        node.assign.visit(this);
        node.conditional.visit(this);
        node.step.visit(this);
        node.body.visit(this);
        return new VoidType();
    }
    visitArrayLiteral(node: ArrayLiteral): Type {
        if(node.elements.length == 0) {
            throw TypeError(
                `Can't infer type of an empty array`
            );
        }
        let elementTypes = node.elements.map((element) => element.visit(this));
        let elementType = elementTypes.reduce((prev, next) => { assertType(prev, next);
            return prev;
        });
        return new ArrayType(elementType);
    }
    visitStringLiteral(node: StringLiteral): Type {
        return new ArrayType(new NumberType());
    }
    visitArrayLookup(node: ArrayLookup): Type {
        assertType(new NumberType(), node.index.visit(this));
        let type = node.array.visit(this);
        if(type instanceof ArrayType) {
            return type.element;
        } else if (type instanceof StringType) {
            return new NumberType();
        } else {
            throw TypeError(
                `Expected an array but got ${type}`
            );
        }
    }
    visitLength(node: Length): Type {
        let type = node.array.visit(this);
        if(type instanceof ArrayType) {
            return new NumberType();
        } else {
            throw TypeError(
                `Expected an array but got ${type}`
            );
        }
    }
}



class Source {
    constructor(public string: string,
        public index: number) { }

    match(regexp: RegExp): (ParseResult<string> | null) {
        // console.assert(regexp.sticky);
        regexp.lastIndex = this.index;
        let match = this.string.match(regexp);
        if (match) {
            let value = match[0];
            let newIndex = this.index + value.length;
            let source = new Source(this.string, newIndex);
            return new ParseResult(value, source);
        }
        return null;
    }
}

class ParseResult<T> {
    constructor(public value: T,
        public source: Source) { }
}

class Parser<T> {
    constructor(public parse: (source: Source) => (ParseResult<T> | null)) { }

    static regexp(regexp: RegExp): Parser<string> {
        return new Parser(source => source.match(regexp));
    }

    static constant<U>(value: U): Parser<U> {
        return new Parser(source =>
            new ParseResult(value, source));
    }

    static error<U>(message: string): Parser<U> {
        return new Parser(source => {
            throw Error(message);
        });
    }

    or(parser: Parser<T>): Parser<T> {
        return new Parser((source) => {
            let result = this.parse(source);
            if (result) {
                return result;
            } else {
                return parser.parse(source);
            }
        });
    }

    static zeroOrMore<U>(parser: Parser<U>): Parser<Array<U>> {
        return new Parser(source => {
            let results = [];
            let item;
            while (item = parser.parse(source)) {
                source = item.source;
                results.push(item.value);
            }
            return new ParseResult(results, source);
        })
    }

    bind<U>(callback: (value: T) => Parser<U>): Parser<U> {
        return new Parser((source) => {
            let result = this.parse(source);
            if (result) {
                let value = result.value;
                let source = result.source;

                return callback(value).parse(source);
            } else {
                return null;
            }
        });
    }

    and<U>(parser: Parser<U>): Parser<U> {
        return this.bind((_) => parser);
    }

    map<U>(callback: (t: T) => U): Parser<U> {
        return this.bind((value) =>
            Parser.constant(callback(value)));
    }

    static maybe<U>(parser: Parser<U>): Parser<U | null> {
        return parser.or(Parser.constant(null));
    }

    parseStringToCompletion(string: string): T {
        let source = new Source(string, 0);

        let result = this.parse(source);
        if (!result) {
            throw Error("Parse error at index 0!");
        }

        let index = result.source.index;
        if (index != result.source.string.length) {
            throw Error(`Parse error at index ${index}`);
        }

        return result.value;
    }
}

let whitespace = Parser.regexp(/[ \n\r\t]+/y);
let comments = Parser.regexp(/[/][/].*/y)
    .or(Parser.regexp(/[/][*].*[*][/]/sy));
let ignored = Parser.zeroOrMore(whitespace.or(comments));

let token = (pattern) =>
    Parser.regexp(pattern)
        .bind((value) => ignored.and(Parser.constant(value)));

// Keyword tokens
let FUNCTION = token(/function\b/y);
let IF = token(/if\b/y);
let ELSE = token(/else\b/y);
let RETURN = token(/return\b/y);
let VAR = token(/var\b/y);
let WHILE = token(/while\b/y);
let FOR = token(/for\b/y);
let TRUE = token(/true\b/y).map((_) => new Bool(true));
let FALSE = token(/false\b/y).map((_) => new Bool(false));
let $undefined = token(/undefined\b/y).map((_) => new Undefined());
let $null = token(/null\b/y).map((_) => new Null());
let ARRAY = token(/array\b/y)
let VOID = token(/void\b/y).map((_) => new VoidType());
let BOOL = token(/bool\b/y).map((_) => new BoolType());
let NUMBER_KEYWORD = token(/number\b/y).map((_) => new NumberType());
let STRING_KEYWORD = token(/string\b/y).map((_) => new StringType());

// Punctuation tokens
let COMMA = token(/[,]/y);
let SEMICOLON = token(/[;]/y);
let LEFT_PAREN = token(/[(]/y);
let RIGHT_PAREN = token(/[)]/y);
let LEFT_BRACE = token(/[{]/y);
let RIGHT_BRACE = token(/[}]/y);
let LEFT_BRACKET = token(/\[/y);
let RIGHT_BRACKET = token(/\]/y);
let LESS_THAN = token(/\</y);
let GREATER_THAN = token(/\>/y);
let COLON = token(/\:/y);
let QUOTE = token(/\"/y);

// Value tokens
let NUMBER = token(/[0-9]+/y).map((digits) => new Num(parseInt(digits)));
let STRING = token(/[a-zA-Z0-9\ ]*/y);
let boolean: Parser<AST> = TRUE.or(FALSE);

// ID tokens
let ID = token(/[a-zA-Z_][a-zA-Z0-9_]*/y); // just for string value
let id = ID.map((x) => new Id(x)); // AST node

// Operator tokens
let NOT = token(/!/y).map((_) => Not);
let EQUAL = token(/==/y).map((_) => Equal);
let NOT_EQUAL = token(/!=/y).map((_) => NotEqual);
let PLUS = token(/[+]/y).map((_) => Add);
let MINUS = token(/[-]/y).map((_) => Subtract);
let STAR = token(/[*]/y).map((_) => Multiply);
let SLASH = token(/[/]/y).map((_) => Divide);
let ASSIGN = token(/=/y).map((_) => Assign);

// === Types ===

let $type: Parser<Type> =
    Parser.error("Type parser used before definition!");

// arrayType <- ARRAY LESS_THAN type GREATER_THAN
var arrayType = ARRAY.and(LESS_THAN).and($type).bind((t) =>
                    GREATER_THAN.and(Parser.constant(new ArrayType(t))));

$type.parse = VOID.or(BOOL).or(NUMBER_KEYWORD).or(STRING_KEYWORD).or(arrayType).parse;

// === Expressions ===
let expression: Parser<AST> =
    Parser.error("Expression parser used before definition!");

// args <- (expression (COMMA expression)*)?
let args: Parser<Array<AST>> = expression.bind((arg) =>
    Parser.zeroOrMore(COMMA.and(expression)).bind((args) =>
        Parser.constant([arg, ...args]))).or(Parser.constant([]));

// call <- ID LEFT_PAREN args RIGHT_PAREN
let call: Parser<AST> = ID.bind((callee) =>
    LEFT_PAREN.and(args.bind((args) =>
        RIGHT_PAREN.and(Parser.constant(new Call(callee, args))))));

// scalar <- boolean / ID / NUMBER
let scalar: Parser<AST> = boolean.or($undefined).or($null).or(id).or(NUMBER);

// arrayLiteral <- LEFT_BRACKET args RIGHT_BRACKET
let arrayLiteral: Parser<AST> = 
    LEFT_BRACKET.and(args).bind((elements) =>
        RIGHT_BRACKET.and(Parser.constant(new ArrayLiteral(elements))));

// stringLiteral <- QUOTE string QUOTE
let stringLiteral: Parser<AST> =
    QUOTE.and(STRING).bind((text) =>
        QUOTE.and(Parser.constant(new StringLiteral(text))));

// arrayLookup <- ID LEFT_BRACKET expression RIGHT_BRACKET
let arrayLookup: Parser<AST> =
    id.bind((array) =>
        LEFT_BRACKET.and(expression).bind((index) =>
            RIGHT_BRACKET.and(Parser.constant(new ArrayLookup(array, index)))));

// atom <- call / arrayLiteral / arrayLookup / scalar
// / LEFT_PAREN expression RIGHT_PAREN
let atom: Parser<AST> = call
    .or(arrayLiteral)
    .or(stringLiteral)
    .or(arrayLookup)
    .or(scalar)
    .or(LEFT_PAREN.and(expression).bind((e) =>
        RIGHT_PAREN.and(Parser.constant(e))));

// unary <- NOT? atom
let unary: Parser<AST> =
    Parser.maybe(NOT).bind((not) =>
        atom.map((term) => not ? new Not(term) : term));

let infix = (operatorParser, termParser) => termParser.bind((term) =>
    Parser.zeroOrMore(operatorParser.bind((operator) => termParser.bind((term) =>
        Parser.constant({ operator, term })))).map((operatorTerms) => operatorTerms.reduce((left, { operator, term }) =>
            new operator(left, term), term)));

// product <- unary ((STAR / SLASH) unary)*
var product = infix(STAR.or(SLASH), unary);

// sum <- product ((PLUS / MINUS) product)*
let sum = infix(PLUS.or(MINUS), product);

// comparison <- sum ((EQUAL / NOT_EQUAL) sum)*
let comparison = infix(EQUAL.or(NOT_EQUAL), sum);

// expression <- comparison
expression.parse = comparison.parse;


// === STATEMENTS ===
let statement: Parser<AST> =
    Parser.error("Statement parser used before definition!");

// returnStatement <- RETURN expression SEMICOLON
let returnStatement: Parser<AST> =
    RETURN.and(expression).bind((term) =>
        SEMICOLON.and(Parser.constant(new Return(term))));

// expressionStatement <- expression SEMICOLON
let expressionStatement: Parser<AST> =
    expression.bind((term) =>
        SEMICOLON.and(Parser.constant(term)));

// ifStatement <-
// IF LEFT_PAREN expression RIGHT_PAREN statement ELSE statement
let ifStatement: Parser<AST> =
    IF.and(LEFT_PAREN).and(expression).bind((conditional) =>
        RIGHT_PAREN.and(statement).bind((consequence) =>
            ELSE.and(statement).bind((alternative) =>
                Parser.constant(new If(conditional, consequence, alternative)))));

// whileStatement <-
// WHILE LEFT_PAREN expression RIGHT_PAREN statement
let whileStatement: Parser<AST> =
    WHILE.and(LEFT_PAREN).and(expression).bind((conditional) =>
        RIGHT_PAREN.and(statement).bind((body) =>
            Parser.constant(new While(conditional, body))));

// varStatement <-
// VAR ID ASSIGN expression SEMICOLON
let varStatement: Parser<AST> =
    VAR.and(ID).bind((name) =>
        ASSIGN.and(expression).bind((value) =>
            SEMICOLON.and(Parser.constant(new Var(name, value)))));

// assignmentStatement <- ID ASSIGN EXPRESSION SEMICOLON
let assignmentStatement: Parser<AST> =
    ID.bind((name) => ASSIGN.and(expression).bind((value) =>
        SEMICOLON.and(Parser.constant(new Assign(name, value)))));

// forStatement <-
// FOR LEFT_PAREN assignmentStatement expressionStatement expression RIGHT_PAREN statement
let forStatement: Parser<AST> =
    FOR.and(LEFT_PAREN).and(statement).bind((assign) =>
        statement.bind((conditional) =>
            statement.bind((step) => 
                RIGHT_PAREN.and(statement).bind((body) =>
                    Parser.constant(new For(conditional, body, assign, step))))));

// blockStatement <- LEFT_BRACE statement* RIGHT_BRACE
let blockStatement: Parser<AST> =
    LEFT_BRACE.and(Parser.zeroOrMore(statement).bind((statements) =>
        RIGHT_BRACE.and(Parser.constant(new Block(statements)))));

// parameter <- ID optionalTypeAnnotation
var parameter: Parser<KeyValuePair<string, Type>> = ID.bind((param) =>
    optionalTypeAnnotation.bind((type) =>
        Parser.constant(new KeyValuePair(param, type))));

// parameters <- (ID (COMMA ID)*)?
let parameters: Parser<Map<string, Type>> =
    parameter.bind((param) =>
        Parser.zeroOrMore(COMMA.and(parameter)).bind((params) => {
            var map = new Map<string, Type>();
            map.set(param.key, param.value);
            params.forEach((p) => map.set(p.key, p.value));

            return Parser.constant(map);
        })).or(Parser.constant(new Map<string, Type>()));

// optionalTypeAnnotation <- (COLON type)?
var optionalTypeAnnotation: Parser<Type> = COLON.and($type).bind((t) =>
    Parser.constant(t)).or(Parser.constant(new NumberType()));

// functionStatement <-
// FUNCTION ID LEFT_PAREN parameters RIGHT_PAREN optionalTypeAnnotation blockStatement
let functionStatement: Parser<AST> =
    FUNCTION.and(ID).bind((name) =>
        LEFT_PAREN.and(parameters).bind((parameters) =>
            RIGHT_PAREN.and(optionalTypeAnnotation).bind((optReturnType) =>
            blockStatement.bind((block) =>
                Parser.constant(new Func(name, new FunctionType(parameters, optReturnType), block))))));

var statementParser: Parser<AST> =
    returnStatement
        .or(functionStatement)
        .or(ifStatement)
        .or(whileStatement)
        .or(forStatement)
        .or(varStatement)
        .or(assignmentStatement)
        .or(blockStatement)
        .or(expressionStatement);

statement.parse = statementParser.parse;

let parser: Parser<AST> =
    ignored.and(Parser.zeroOrMore(statement)).map((statements) =>
        new Block(statements));

let emit = console.log;

console.log('\n');

var source = `function pair(x: number, y: number): array<number> {
    return [x, y];
}
function print_string(text: string, length: number): void {
    for(var i = 0; i != length; i = i + 1;) {
        putchar(text[i]);
    }
}
function check_bools(b1: bool, b2: bool): bool {
    if(b1) {
        if(b2) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
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
}`;

parser.parseStringToCompletion(source).visit(new TypeChecker(new Map(),
new Map([
    ["putchar", new FunctionType(new Map([["char", new NumberType()]]), new VoidType())],
]), new VoidType()));

parser.parseStringToCompletion(source).visit(new CodeGenerator());

console.log('\n');

