var TRUE = true,

FALSE = false,

NULL = null,

EMPTY_FUNCTION = function(){},

IS_FUNCTION = function( fn ) {

	return typeof fn === "function";

},

IS_OBJECT = function( obj ) {

	return typeof obj === "object";

},

IS_NUMBER = function( num ) {

	return typeof num === "number";

},

LOGTAG = function() {

	return "[Pattern JS] " + ( new Date() ).toLocaleTimeString() + " ";

};
