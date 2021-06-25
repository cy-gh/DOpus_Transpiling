// @ts-check
/* eslint quotes: ['error', 'single'] */
/* eslint-disable no-inner-declarations */
/* global ActiveXObject Enumerator DOpus Script */
/* eslint indent: [2, 4, {"SwitchCase": 1}] */
///<reference path="./_DOpusDefinitions.d.ts" />

// unfortunately I couldn't get import to work yet :/
// however, new ID_Validators.IMDB_ID_Validator() works!
// using ///<reference path="./ID_Validators.ts" /> did not help either
// import { IMDB_ID_Validator } from "./ID_Validators";

var GlobalCMT:any = {};
GlobalCMT.SCRIPT_NAME        = 'CuMovieTagger'; // WARNING: if you change this after initial use you have to reconfigure your columns, infotips, rename scripts...
GlobalCMT.SCRIPT_NAME_SHORT  = 'MovT'; // WARNING: if you change this after initial use you have to rename all methods!
GlobalCMT.SCRIPT_VERSION     = '0.1';
GlobalCMT.SCRIPT_COPYRIGHT   = '© 2021 cuneytyilmaz.com';
GlobalCMT.SCRIPT_URL         = 'https://github.com/cy-gh/DOpus_MovieTagger/';
GlobalCMT.SCRIPT_DESC        = 'Extended fields for movie files (movie & audio) with the help of MKVToolNix, online APIs & NTFS ADS';
GlobalCMT.SCRIPT_MIN_VERSION = '12.0';
GlobalCMT.SCRIPT_DATE        = '20210621';
GlobalCMT.SCRIPT_GROUP       = 'cuneytyilmaz.com';
GlobalCMT.SCRIPT_PREFIX      = GlobalCMT.SCRIPT_NAME_SHORT; // prefix for field checks, log outputs, progress windows, etc. - do not touch
GlobalCMT.SCRIPT_LICENSE     = 'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)';
GlobalCMT.SCRIPT_FULLPATH    = '';
GlobalCMT.SCRIPT_PATH        = '';
GlobalCMT.SCRIPT_IS_OSP      = false;


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
}
