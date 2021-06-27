# Modularization and transpiling for JScript targets

In this other thread, the [question of transpiling](https://resource.dopus.com/t/dopus-intellisense-aka-autocomplete-definitions-for-vscode/37792/4?u=cyilmaz) has come up, i.e. developing DOpus scripts in TypeScript or newer JavaScript versions, etc. to ES3-ish JScript we use in DOpus/WSH.

Sweet news first: From TypeScript to JScript transpiled files work in DOpus! :tada:

Update 20210627:

*The [Variant 1 & 2 on Github](https://github.com/cy-gh/DOpus_Transpiling) are working albeit misleading examples. Particularly, variant 2 might have misled you to think, it's very similar to standard ```export``` in one file, ```import``` pair in the other. While the modules may use standard export syntax for modules or namespaces, the consumers may not use import statement. after failed tests with including npm nodules, trying to make unit-tests with mocha and before coming to the realization that jScript's lack of export support cannot be tricked.* :frowning:

See below for a minimal-ish boilerplate code.

Module file:

```typescript
/* global ActiveXObject Enumerator DOpus Script */
// You can try to use 'export namespace# or 'export module' below all you want,
// they will work with node, mocha, etc. but **not** in JScript/DOpus after compilation!
//
// Since this is TypeScript you can use 'namespace' or 'module',
// makes no practical difference for our purposes.
// see https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html
module libLogger {
    // export below is slightly different than exporting the module/namespace:
    // without 'export enum' we cannot use libLogger.LOGLEVEL in the caller class
    // since it would be similar to a private attribute
    export enum LOGLEVEL {
        FORCE   = -1,
        NONE    = 0,
        ERROR   = 1,
        WARN    = 2,
        NORMAL  = 3,
        INFO    = 4,
        VERBOSE = 5
    }
    // see above: export makes this visible to outside
    export interface ifLogger {
        getLevel(): LOGLEVEL;
        setLevel(level: LOGLEVEL): void;
        getLevels(): LOGLEVEL[];
    }
    // see above: export makes this visible to outside
    export class Logger implements ifLogger {
        private level: LOGLEVEL = LOGLEVEL.NORMAL;
        constructor(level: LOGLEVEL) {
            this.level = level;
        }
        private _baseout(level: LOGLEVEL, message?: string) { if (level <= this.level) DOpus.output(message || ''); }
        public getLevels(): LOGLEVEL[] { throw new Error("Method not implemented."); }
        public getLevel(): LOGLEVEL { return this.level; }
        public setLevel(level: LOGLEVEL) { this.level = level; }

        /** @param {string} */
        public force(message?: string)   { this._baseout(LOGLEVEL.FORCE,    message); };
        public none(message?: string)    { this._baseout(LOGLEVEL.NONE,     message); };
        public error(message?: string)   { this._baseout(LOGLEVEL.ERROR,    message); };
        public warn(message?: string)    { this._baseout(LOGLEVEL.WARN,     message); };
        public normal(message?: string)  { this._baseout(LOGLEVEL.NORMAL,   message); };
        public info(message?: string)    { this._baseout(LOGLEVEL.INFO,     message); };
        public verbose(message?: string) { this._baseout(LOGLEVEL.VERBOSE,  message); };
    }
}
// since this class is not part of a namespace/module
// it can be directly instantiated with new TopLevelClass() directly
class TopLevelClass {
    public id: number;
    constructor(id: number) {
        this.id = id;
    }
}
```
Caller file, e.g. index.ts:

```javascript
// @ts-check
/* eslint quotes: ['error', 'single'] */
/* eslint-disable no-inner-declarations */
/* global Enumerator Script */
/* eslint indent: [2, 4, {"SwitchCase": 1}] */
///<reference path='./_DOpusDefinitions.d.ts' />
///<reference path='./libLogger.ts' />
//
// 1. if you do not reference the module via ///<reference path='./libLogger.ts' />
//    you cannot use tsc ... --outfile myDOpusScript.js index.ts
//    but have to use tsc ... --outfile myDOpusScript.js libLogger.ts index.ts instead
// 2. to keep JScript compatibility we may not use this: import { libLogger } from "./libLogger";

// called by DOpus
/** @param {DOpusScriptInitData=} initData */
// eslint-disable-next-line no-unused-vars
function OnInit(initData: DOpusScriptInitData) {
    // libLogger. is needed for the namespace/module
    // without export in front of class Logger, i.e. just class Logger
    // we would not be able to access members of the namespace
    let logger1 = new libLogger.Logger(libLogger.LOGLEVEL.NORMAL);
    logger1.force("This variant does not work with node anymore...");
    logger1.force('There can be no import or require in this version but it works with DOpus.');

    // no namespace/module needed here
    let tlc1 = new TopLevelClass(1);
    logger1.force('TopLevelClass id: ' + tlc1.id);

    DOpus.output('script finished');
}
// now we can transpile the 2 files like this - yes, target is ES3 and lib is ES5
//   tsc --target es3 --lib es5,scripthost --outfile myDOpusScript.js libLogger.ts index.ts
// if tsc is not available, e.g. when compiling outside VSC, try:
//   npx tsc --target es3 --lib es5,scripthost --outfile myDOpusScript.js libLogger.ts index.ts
// these can be automated via package.json, VSC tasks, etc.
// and myDOpusScript.js can be automatically copied to DOPus script folder
```
Use the variant above instead.

## Keep in mind

As the example above shows, you have to keep the following in mind to make the output file JScript-compatible:

* You may use ```module/namespace``` but not ```export module/namespace```.
* No ```import``` anywhere in the whole chain, period. That means most if not all npm modules cannot be included, and also no unit tests.
* Top level attributes, classes, etc. can be directly accessed in the caller; VSC takes care of the name resolution.
* When namespaces/modules are used, you must use ```export class```, ```export enum```, etc. and they can be only addressed via fully-qualified names, e.g. ```new ID_Validators.IMDB_ID_Validator();```. This circumvents the import statement.
* If you don't use the triple slash directive reference path, the module file must be specified in the compiled files list, e.g. ```tsc ... --outfile out.js libmodule.ts index.ts```.

## What does not work?

Unfortunately not all *newer* ES features work. Since TSC (TypeScript compiler) does not distinguish much between ES3 and ES5, it does not convert ```for (let x in obj)``` ~~or ```array.forEach()```~~ to ES3-compatible structures, so some features do **not** translate well. However, as you can see above let, const, class, or features which I sorely missed like Enums do work. I haven't tested features like async, await, Promises... yet, but until now haven't needed them either. ~~But I will definitely test out compiling npm modules into a single file; if they work, the possibilities of DOpus scripting will increase instantly 1000-fold.~~

Update 20210627:

1. While re-reading some bookmarked threads, [this thread](https://resource.dopus.com/t/here-are-the-windows-script-host-activescript-reference-manuals/31193) (i.e. [this StackOverflow answer](https://stackoverflow.com/a/34966337)) has the solution for missing forEach and such:

   ```javascript
   var htmlfile = Server.CreateObject('htmlfile');
   htmlfile.write('<meta http-equiv="x-ua-compatible" content="IE=9" />');
   
   // expose more modern methods from htmlfile
   var JSON = htmlfile.parentWindow.JSON;
   String.prototype.trim = htmlfile.parentWindow.String.prototype.trim;
   Array.prototype.indexOf = htmlfile.parentWindow.Array.prototype.indexOf;
   Array.prototype.forEach = htmlfile.parentWindow.Array.prototype.forEach;
   Object.keys = htmlfile.parentWindow.Object.keys;
   
   htmlfile.close(); // no longer needed
   
   // demonstrate JSON.parse() and String.trim()
   var strJSON = '{ "item1": "          val1 needs trimmed.          " }';
   var objFromJSON = JSON.parse(strJSON);
   Response.Write('JSON and String.trim() demo result: ' + objFromJSON.item1.trim() + '\n');
   ```

   It's mildly surprising because I was already using JSON.stringify/parse without this trick before and trim() is easy to fix, but I welcome Array.forEach() and Object.keys().

2. After some initial testing, it turns out npm modules will not work. The reason is even the most basic ones define their exports and imports, which tsc lets slip into the output file and of course they don't work in JScript. I've also tried [browserify](https://browserify.org/) (and tsify), which is a real marvel on its own, but unfortunately it did not help either. 

## Pros & Cons of Transpiling and TypeScript

Pros:

1. Modularization, Reusability: You can split very, very big DOpus scripts into smaller chunks and/or share between different scripts. To me this is byyyyyyy faaaaar the biggest gain. :man_dancing:
2. Newer ES features: Now you can use newer constructs, syntactic sugar, etc.
3. Easier & safer programming: Though JS/ES are fantastic languages, TypeScript puts some nice features on top of it and VSCode supports you all the way.

Cons:
1. Extra step before usage: After each save, you have to recompile your script, but this can be easily automated with VSC/npm.

Neutral:

1. Node modules cannot be included and unit test frameworks like mocha do not work, but since these were not my main goals, I can live with the limitation.

The examples above or in the files are just for demonstration purposes. Of course, I'm a total TypeScript and node/npm newbie, so there are surely better ways of doing this and that, so excuse my ignorance if you know better ways.

Feel free to share your feedback, suggestions and improvements.