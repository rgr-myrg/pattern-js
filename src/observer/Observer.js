/**
 * @file Classic Observer Pattern
 * @exports observer/Observer
 * @extends {Pattern}  
 */

$P.Observer = function( object ) {

	object = IS_OBJECT( object ) ? object : {};

	/**
	* Method triggered by Observable.notify	
	* @param {object[]} arguments - Array of arguments.
	* @returns {object} notification - First object in arguments array.
	* @since 1.0
	*/

	object.onUpdate = function() {

		var notification = arguments[ 0 ];

		if ( IS_FUNCTION( object[ notification.eventName ] ) ) {

			// Retain scope
			(function() {

				object[ notification.eventName ].apply( this, arguments );

			})( notification.eventData );

		}

		return notification;

	};

	return object;

};
