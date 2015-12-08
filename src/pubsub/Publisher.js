$P.Publisher = function( object ) {

	var subscribers = [],

	publisher = IS_OBJECT( object ) ? object : {};

	publisher.registerSubscriber = function( subscriber ) {

		if ( IS_OBJECT( subscriber ) ) {

			subscribers.push( subscriber );

		}

		return subscribers;

	};

	publisher.removeSubscriber = function( subscriber ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			if ( subscribers[ x ] === subscriber ) {

				subscribers.splice( x, 1 );

				break;

			}

		}

		return subscribers;

	};

	publisher.notify = function( eventName, eventData ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			var subscriber = subscribers[ x ];

			if ( IS_FUNCTION( subscriber[ eventName ] ) ) {

				/*jshint loopfunc: true */
				(function() {

					subscriber[ eventName ].apply( subscriber, arguments );

				})(eventData);

			}

		}

		return eventName;

	};
 
 	EXEC_INIT_METHOD( publisher );

	return publisher;

};
