In this other thread, the [question of transpiling](https://resource.dopus.com/t/dopus-intellisense-aka-autocomplete-definitions-for-vscode/37792/4?u=cyilmaz) has come up, i.e. developing DOpus scripts in TypeScript or newer JavaScript versions, etc. to ES3-ish JScript we use in DOpus/WSH.

Sweet news first: From TypeScript to JScript transpiled files work in DOpus! :tada:

Before complicating things with Unit Tests, npm modules, etc. I wanted to publish the proof of concepts first. Repository https://github.com/cy-gh/CuDOpusTranspiling (follows).

See the attached file for 2 samples which consists of multiple .ts files which get compiled to a single file which DOpus recognizes and executes as user script (see script console after loading).

The 1st variant uses tsc directives to include external files, e.g.
```javascript
///<reference path="./_DOpusDefinitions.d.ts" />
///<reference path="MyInterface.ts" />
///<reference path="BaseClass.ts" />
```

The 2nd variant uses ```export module``` syntax, which in turn can be later consumed in the main .ts file with familiar DOpus OnInit() method.
```typescript
// in module file
module ID_Validators {
    export const reIMDB_ID = /^tt\d+$/;
    export class IMDB_ID_Validator implements StringValidator {
        isValidID(s: string) {
            return s.match(reIMDB_ID) !== null;
        }
    }
}
```
```javascript
// in index.ts
enum Type {
    Feature,
    TVShow,
    Short,
    Adult
}
class Movie {
    private type: Type;
    private name: string;
    public id: string;
    private validator: StringValidator;

    constructor(name: string, type: Type) {
        this.name = name;
        this.type = type;
        this.id = '';
        this.validator = new ID_Validators.IMDB_ID_Validator();
    }
    /**
     * @param id movie id
     * @returns {boolean} true if valid
     */
    setID(id: string) {
        if (this.validator.isValidID(id)) {
            this.id = id;
            return true;
        }
        return false;
    }
    toJSON() {
        return {
            name: this.name,
            type: this.type.toString(),
            id  : this.id
        }
    }
}

// called by DOpus
/** @param {DOpusScriptInitData} initData */
// eslint-disable-next-line no-unused-vars
function OnInit(initData: DOpusScriptInitData) {
    initData.name           = GlobalCMT.SCRIPT_NAME;
    initData.version        = GlobalCMT.SCRIPT_VERSION;
    initData.copyright      = GlobalCMT.SCRIPT_COPYRIGHT;
    initData.url            = GlobalCMT.SCRIPT_URL;
    initData.desc           = GlobalCMT.SCRIPT_DESC;
    initData.min_version    = GlobalCMT.SCRIPT_MIN_VERSION;
    initData.group          = GlobalCMT.SCRIPT_GROUP;
    initData.log_prefix     = GlobalCMT.SCRIPT_PREFIX;
    initData.default_enable = true;

    let movie1 = new Movie('Léon', Type.Feature);
    const ttid = 'tt0110413';
    DOpus.output('id is valid: ' + movie1.setID(ttid));
    DOpus.output(JSON.stringify(movie1));
    // prints out: {"name":"L\u00c3\u00a9on","type":"0","id":"tt0110413"}
}
```
With the supplied .cmd files you can transpile these to JScript-compatible files and use them in DOpus; I left the compiled files for examining the outputs. With an npm package.json you can also automate it from VSC; a sample is in Variant 2.

Unfortunately not all *newer* ES features work. Since TSC (TypeScript compiler) does not distinguish much between ES3 and ES5, it does not convert ```for (let x in obj)``` or ```array.forEach()``` to ES3-compatible structures, so some features do **not** translate well. However, as you can see above let, const, class, or features which I sorely missed like Enums do work. I haven't tested features like async, await, Promises... yet, but until now haven't needed them either. But I will definitely test out compiling npm modules into a single file; if they work, the possibilities of DOpus scripting will increase instantly 1000-fold.

Pros of transpiling:
1. Modularization, Reusability, Unit-Tests: You can split very, very big DOpus scripts into smaller chunks and/or share between different scripts. Of course with modularized files you can also use external unit-tests, i.e. without having to run them in DOpus. To me this is byyyyyyy faaaaar the biggest gain. :man_dancing:
2. Newer ES features: Now you can use newer constructs, syntactic sugar, etc.
3. Easier & safer programming: Though JS/ES are fantastic languages, TypeScript puts some nice features on top of it and VSCode supports you all the way.

Cons:
1. Extra step before usage: After each save, you have to recompile your script, but this can be easily automated with VSC/npm.

The examples above or in the files are just for demonstration purposes. Of course, I'm a total TypeScript and node/npm newbie, so there are surely better ways of doing this and that, so excuse my ignorance if you know better ways.