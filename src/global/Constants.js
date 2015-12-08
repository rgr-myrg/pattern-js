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

	return "[Pattern Js] " + ( new Date() ).toLocaleTimeString() + " ";

},

EXEC_INIT_METHOD = function( object ) {

	if ( IS_FUNCTION( object.init ) ) {

		object.init();

	}

},

GET_OBJECT_IF_DEFINED = function( object ) {

	return IS_OBJECT( object ) ? object : {};

},

FUNCTION_APPLY = function( func, parent, args ) {

	(function() {

		func.apply( parent, arguments );

	})( args );

},

REMOVE_ARRAY_ITEM = function( array, item ) {

	for ( var x = 0, size = array.length; x < size; x++ ) {

		if ( array[ x ] === item ) {

			array.splice( x, 1 );

			if ( IS_FUNCTION( item.onRemove ) ) {

				item.onRemove();

			}

			break;

		}

	}

	return array;

};
