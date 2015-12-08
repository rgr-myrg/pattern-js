$P.Publisher = function( object ) {

	var subscribers = [];

	object = IS_OBJECT( object ) ? object : {};

	object.registerSubscriber = function( subscriber ) {

		if ( IS_OBJECT( subscriber ) ) {

			subscribers.push( subscriber );

		}

		return subscribers;

	};

	object.removeSubscriber = function( subscriber ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			if ( subscribers[ x ] === subscriber ) {

				subscribers.splice( x, 1 );

				break;

			}

		}

		return subscribers;

	};

	object.notify = function( eventName, eventData ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			var subscriber = subscribers[ x ];

			if ( IS_FUNCTION( subscriber[ eventName ] ) ) {

				subscriber[ eventName ]( eventData );

			}

		}

		return eventName;

	};
 
	return object;

};
