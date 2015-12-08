/* pattern-js v1.1.0 Mon Dec 07 2015 23:50:09 GMT-0500 (EST) */(function(w){w.Pattern=w.Pattern||{};})(window);(function($P){var TRUE = true,

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

};

$P.EventSignal = function() {

	var listeners = [];

	return {

		addListener: function( listener ) {

			if ( IS_FUNCTION( listener ) ) {

				listeners.push( listener );

			}

			return listeners;

		},

		removeListener: function( listener ) {

			var size = listeners.length;

			for ( var x = 0; x < size; x++ ) {

				if ( listeners[ x ] === listener ) {

					listeners[ x ] = null;

				}

			}

			return listeners;

		},

		dispatch: function() {

			var	temp = [],

				size = listeners.length;

			for ( var x = 0; x < size; x++ ) {

				var listener = listeners[ x ];

				if ( IS_FUNCTION( listener ) ) {

					listener.apply( this, arguments );

				} else {

					temp.push( x );

				}

			}

			size = temp.length;

			for ( x = 0; x < size; x++ ) {

				listeners.splice( x, 1 );

			}

		}

	};

};

$P.Observable = function( object ) {

	var observers = [],

	observable = IS_OBJECT( object ) ? object : {};

	observable.addObserver = function( observer ) {

		if ( !IS_OBJECT( observer ) || !IS_FUNCTION( observer.onUpdate ) ) {

			return observer;

		}

		observer._observable = observable;

		observers.push( observer );

		if ( IS_FUNCTION( observer.onRegister ) ) {

			observer.onRegister();

		}

		return observers;

	};

	observable.removeObserver = function( observer ) {

		for ( var x = 0, size = observers.length; x < size; x++ ) {

			if ( observers[ x ] === observer ) {

				observers.splice( x, 1 );

				if ( IS_FUNCTION( observer.onRemove ) ) {

					observer.onRemove();

				}

				break;

			}

		}

		return observers;

	};

	observable.notifyObservers = function() {

		for ( var x = 0, size = observers.length; x < size; x++ ) {

			var observer = observers[ x ];

			observer.onUpdate.apply( observer, arguments );

		}

	};

	EXEC_INIT_METHOD( observable );

	return observable;

};

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

	EXEC_INIT_METHOD( object );

	return object;

};

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

/**
 * @file Simple FIFO Queue
 * @exports queue/Queue
 * @extends {Pattern}  
 */

$P.Queue = function( options ) {

	var	running   = FALSE,
		delegate  = NULL,
		onError   = EMPTY_FUNCTION,
		maxCount  = -1,
		queue     = [];

	if ( options === NULL || 
		!IS_OBJECT( options ) || 
		!IS_OBJECT( options.delegate ) || 
		!IS_FUNCTION( options.delegate.onQueueItem ) ) {

		return NULL;

	}

	delegate = options.delegate;

	if ( IS_FUNCTION( delegate.onQueueError ) ) {

		onError = delegate.onQueueError;

	}

	if ( IS_NUMBER( delegate.maxCount ) && delegate.maxCount > 0 ) {

		maxCount = delegate.maxCount;

	}

	return {
		/**
		* Method to add items to queue.	
		* @param {object[]} arguments - Array of arguments.
		* @returns {array} queue - Modified queue array.
		* @since 1.0
		*/
		add: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return NULL;

			}

			queue.push( arguments );

			return queue;

		},

		/**
		 * Method to add items to beginning of the queue, to be processed first
		 * @param {object[]} arguments - Array of arguments.
		 * @returns {array} queue - Modified queue array.
		 * @throws Error if the max count exceeded.
		 * @since 1.1
		 */
		addPriority: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return NULL;

			}

			queue.unshift( arguments );

			return queue;

		},


		/**
		* Method to start the queue.	
		* @returns {boolean} Whether queue is running or not.
		* @since 1.0
		*/
		start: function() {

			console.debug( LOGTAG() + "Queue.start running: " + running );

			if ( !running ) {

				running = TRUE;
				this.run();

			}

			return running;

		},

		/**
		* Method to run the queue.
		* @returns {array} queue - The queue array.	
		* @since 1.0
		*/
		run: function() {

			console.debug( LOGTAG() + "Queue.run queue.length: " + queue.length );

			while ( running ) {

				if ( queue.length > 0 ) {

					delegate.onQueueItem.apply( delegate, queue.shift() );

				} else {

					this.stop();

				}

			}

			return queue;

		},

		/**
		* Method to stop the queue.
		* @returns {boolean} running - Whether queue is running or not.
		* @since 1.0
		*/
		stop: function() {

			running = FALSE;

			return running;

		},

		/**
		* Method to check whether the queue is running.	
		* @returns {boolean} running - Whether queue is running or not.
		* @since 1.0
		*/
		isRunning: function() {

			return running;

		},

		/**
		* Method to get the length of the queue.	
		* @returns {number} queue.length - Length of the queue.
		* @since 1.0
		*/
		count: function() {

			return queue.length;

		},

		/**
		* Method to clear the queue.
		* @returns {array} queue - The queue array.	
		* @since 1.0
		*/
		clear: function() {

			this.stop();
			queue = [];

			return queue;

		}

	};
};
$P.version='1.1.0';})(Pattern);