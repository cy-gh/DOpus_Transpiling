// @ts-check
/* eslint quotes: ['error', 'single'] */
/* eslint indent: [2, 4, {"SwitchCase": 1}] */
/* global ActiveXObject Enumerator DOpus Script */

// These do not seem to have any effect in filename or class resolution
// nor does opening the folter in VSC as workspace or not.
///<reference path="./_DOpusDefinitions.d.ts" />
///<reference path="MyInterface.ts" />
///<reference path="BaseClass.ts" />


// To compile all files at once,
// do not use "tsc:build" (ctrl-shift-B) from VSC
// otherwise it will compile each individual .ts file to individual .js files.
//
// Either use the supplied .cmd file
// or create a package.json with npm init, create a task in it
// and then use ctrl-shift-b from VSC and it should detect the npm task.
// Variant 2 directory does exactly this
// If you open Variant 2 directory in VSC, it will use .vscode folder and
// see the previously detected npm task to build.


/**
 * Some comment for B
 */
class ChildClass extends BaseClass implements MyInterface {
    constructor(p?: string) {
        super();
        DOpus.output('Hello from B constructor');
    }
    /**
	 * @param s string
	 */
	getLength(s: string){
		return s.length;
	}
}

let GlobalCMTComp:any = {};

GlobalCMTComp.SCRIPT_NAME        = 'CuTranspilePOC1';
GlobalCMTComp.SCRIPT_VERSION     = '1.0';
GlobalCMTComp.SCRIPT_DESC        = 'Proof of concept for transpiling';
GlobalCMTComp.SCRIPT_URL         = 'https://github.com/cy-gh';

function OnInit(initData: DOpusScriptInitData) {
    initData.name           = GlobalCMTComp.SCRIPT_NAME;
    initData.version        = GlobalCMTComp.SCRIPT_VERSION;
    initData.url            = GlobalCMTComp.SCRIPT_URL;
    initData.desc           = GlobalCMTComp.SCRIPT_DESC;
    initData.default_enable = true;

    const bc = new BaseClass();
    const cc1 = new ChildClass();
    const cc2 = new ChildClass('optional, ignored');
    cc1.baseClassMethod('Sent from OnInit');

    // some non-ES3 features I miss a lot in JScript
    let someObj: any = {};
    someObj.a = 1;
    someObj.b = 2;

    // no compilation or runtime error but does not work anyway
    for (const el of someObj) {
        DOpus.output('el: ' + el);
    }
    for (const k in someObj) {
        if (Object.prototype.hasOwnProperty.call(someObj, k)) {
            const el = someObj[k];
            DOpus.output(k + ': ' + el);
        }
    }

    // no compilation error but runtime error
    // unfortunately does not work with JScript :/
    // let someArr: string[] = ['foo', 'bar'];
    // someArr.forEach(el => {
    //     DOpus.output('el: ' + el);
    // });

    DOpus.output('Str len: ' + cc2.getLength('sent to interface implementation in cc2'));
    DOpus.output('OnInit finished');
}
