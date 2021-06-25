/**
 * some base class
 */
class BaseClass {
	constructor(){
		DOpus.output('Hello from BaseClass constructor');
	}
	/**
	 *
	 * @param s any string
	 */
	baseClassMethod(s: string) {
		DOpus.output('baseClassMethod got: ' + s);
	}
}
