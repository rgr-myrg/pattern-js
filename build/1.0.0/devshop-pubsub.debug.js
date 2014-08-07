/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Thu Aug 07 2014 10:22:31 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(w){w.DevShop=w.DevShop||{};})(window);(function( $ ) {
	$.Queue = function( options ) {
		var	objectId   = null,
			intervalId = null,
			running    = false,
			callback   = function(){},
			timeToWait = 300,
			queue      = [];

		if ( typeof options !== "object" || !options.id ) {
			throw( "Queue options Object is Null" );
		}

		objectId = options.id;

		if ( !isNaN( options.timeToWait ) ) {
			timeToWait = options.timeToWait;
		}

		if ( typeof options.callback === "function" ) {
			callback = options.callback;
		}

		return {
			add: function() {
				queue.push( arguments );
			},

			start: function() {
				if ( !running ) {
					try {
						intervalId = setInterval( objectId + ".run()", timeToWait );
					} catch( e ) {
					}
				}
			},

			run: function() {
				if ( queue.length > 0 ) {
					running = true;

					try {
						callback.apply( this, queue.shift() );
					} catch( e ) {
						this.stop();
					}
				} else {
					this.stop();
				}
			},

			stop: function() {
				running = false;
				clearInterval( intervalId );
			},

			isRunning : function() {
				return running;
			}
		};
	};
})( DevShop );

(function( $ ) {
	$.ObjectFactory = function( $Object ) {
		if ( typeof $Object !== "object" ) {
			throw( "Object not provided" );
		}

		var getInstance = function( $Constructor ) {
			if ( typeof $Constructor === "function" ) {
				try {
					return new $Constructor();
				} catch( e ) {
				}
			} else if ( typeof $Constructor === "object" ) {
				return $Constructor;
			}
		},

		interfase = getInstance( $Object._implements_ ),
		baseclass = getInstance( $Object._extends_ ),
		singleton = getInstance( $Object._public_ );

		for ( var i in baseclass ) {
			if ( baseclass.hasOwnProperty( i ) && !singleton[ i ] ) {
				singleton[ i ] = baseclass[ i ];
			}
		}

		for ( i in interfase ) {
			if ( interfase.hasOwnProperty(i) && !singleton[i] ){
				throw( object.instance + " must implement '" + i + "' " + typeof interfase[i] );
			}
		}

		if ( typeof singleton.init === "function" ) {
			try {
				singleton.init();
			} catch( e ) {
			}
		}

		return singleton;
	};
})( DevShop );

(function( $ ) {
	$.EventSignal = function( $Object ) {
		var listeners = [];

		return {
			addListener: function( listener ) {
				if ( typeof listener === "function" ) {
					listeners.push( listener );
				}
			},

			removeListener: function( listener ) {
				var	size = listeners.length;

				for ( var x = 0; x < size; x++ ) {
					if( listeners[ x ] === listener ) {
						listeners[ x ] = null;
					}
				}
			},

			dispatch: function() {
				var	temp = [],
					size = listeners.length;

				for ( var x = 0; x < size; x++ ) {
					var listener = listeners[ x ];

					if ( typeof listener === "function" ) {
						listener.apply( this, arguments );
					} else {
						temp.push( x );
					}
				}

				size = temp.length;

				for( x = 0; x < size; x++ ) {
					listeners.splice( x, 1 );
				}
			}
		};
	};
})( DevShop );

(function( $ ) {
	$.Publisher = function() {
		var events = {};

		return {
			registerEvents: function( eventList ) {
				if( typeof eventList === "object" ) {
					events = eventList;
				}
			},

			registerSubscriber: function( subscriber ) {
				if ( typeof subscriber.onRegister === "function" ) {
					var listeners = subscriber.onRegister();

					for( var i in listeners ) {
						if( listeners.hasOwnProperty( i ) && 
							typeof listeners[ i ] === "function" &&
								typeof events[ i ] === "object" &&
									typeof events[ i ].addListener === "function" ) {

							events[ i ].addListener( listeners[ i ] );
						}
					}

					subscriber.onRegister = function(){};
				}
			},

			notify: function( event, data ) {
				if ( typeof event.dispatch === "function" ) {
					event.dispatch( data );
				}
			}
		};
	};
})( DevShop );
