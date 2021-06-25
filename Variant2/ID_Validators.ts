module ID_Validators {
    export const reIMDB_ID = /^tt\d+$/;
    export class IMDB_ID_Validator implements StringValidator {
        isValidID(s: string) {
            return s.match(reIMDB_ID) !== null;
        }
    }
}
