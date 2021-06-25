var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * some base class
 */
var BaseClass = /** @class */ (function () {
    function BaseClass() {
        DOpus.output('Hello from BaseClass constructor');
    }
    /**
     *
     * @param s any string
     */
    BaseClass.prototype.baseClassMethod = function (s) {
        DOpus.output('baseClassMethod got: ' + s);
    };
    return BaseClass;
}());
// @ts-check
/* eslint quotes: ['error', 'single'] */
/* eslint indent: [2, 4, {"SwitchCase": 1}] */
/* global ActiveXObject Enumerator DOpus Script */
// these do not seem to have any effect in filename or class resolution
// nor does opening the folter in VSC as workspace or not
///<reference path="./_DOpusDefinitions.d.ts" />
///<reference path="MyInterface.ts" />
///<reference path="BaseClass.ts" />
/**
 * Some comment for B
 */
var ChildClass = /** @class */ (function (_super) {
    __extends(ChildClass, _super);
    function ChildClass(p) {
        var _this = _super.call(this) || this;
        DOpus.output('Hello from B constructor');
        return _this;
    }
    /**
     * @param s string
     */
    ChildClass.prototype.getLength = function (s) {
        return s.length;
    };
    return ChildClass;
}(BaseClass));
var GlobalCMTComp = {};
GlobalCMTComp.SCRIPT_NAME = 'CuTranspilePOC';
GlobalCMTComp.SCRIPT_VERSION = '1.0';
GlobalCMTComp.SCRIPT_DESC = 'Proof of concept for transpiling';
GlobalCMTComp.SCRIPT_URL = 'https://github.com/cy-gh';
function OnInit(initData) {
    initData.name = GlobalCMTComp.SCRIPT_NAME;
    initData.version = GlobalCMTComp.SCRIPT_VERSION;
    initData.url = GlobalCMTComp.SCRIPT_URL;
    initData.desc = GlobalCMTComp.SCRIPT_DESC;
    initData.default_enable = true;
    var bc = new BaseClass();
    var cc1 = new ChildClass();
    var cc2 = new ChildClass('optional, ignored');
    cc1.baseClassMethod('Sent from OnInit');
    // some non-ES3 features I miss a lot in JScript
    var someObj = {};
    someObj.a = 1;
    someObj.b = 2;
    // no compilation or runtime error but does not work anyway
    for (var _i = 0, someObj_1 = someObj; _i < someObj_1.length; _i++) {
        var el = someObj_1[_i];
        DOpus.output('el: ' + el);
    }
    for (var k in someObj) {
        if (Object.prototype.hasOwnProperty.call(someObj, k)) {
            var el = someObj[k];
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
