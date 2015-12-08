$P.Publisher = function( object ) {

	var subscribers = [],

	publisher = GET_OBJECT_IF_DEFINED( object );

	publisher.registerSubscriber = function( subscriber ) {

		if ( IS_OBJECT( subscriber ) ) {

			subscribers.push( subscriber );

		}

		return subscribers;

	};

	publisher.removeSubscriber = function( subscriber ) {

		subscribers = REMOVE_ARRAY_ITEM( subscribers, subscriber );

		return subscribers;

	};

	publisher.notify = function( eventName, eventData ) {

		for ( var x = 0, size = subscribers.length; x < size; x++ ) {

			var subscriber = subscribers[ x ];

			if ( IS_FUNCTION( subscriber[ eventName ] ) ) {

				FUNCTION_APPLY( subscriber[ eventName ], subscriber, eventData );

			}

		}

		return eventName;

	};
 
 	EXEC_INIT_METHOD( publisher );

	return publisher;

};
