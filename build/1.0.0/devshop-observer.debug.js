/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Thu Aug 07 2014 10:21:57 GMT-0400 (EDT)
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
	$.Observable = function( $Object ) {
		var $Observable = function() {
			var observers = [];

			return {
				addObserver: function( observer ) {
					if ( (typeof observer === "function" || typeof observer === "object") && 
							typeof observer.update === "function" ){

						observers.push( observer );

						if ( typeof observer.onRegister === "function" ) {
							try {
								observer.onRegister();
							} catch( e ) {
							}
						}
					}
				},

				notifyObservers: function() {
					var size = observers.length;

					for ( var x = 0; x < size; x++ ) {
						var observer = observers[ x ];
						observer.update.apply( observer, arguments );
					}
				},
				getObservers: function() {
					return observers;
				}
			};
		};

		return $.ObjectFactory({
				_extends_ : $Observable,
				_public_  : $Object
		});
	};
})( DevShop );

(function( $ ){
	$.Observer = function( $Object ){
		var $Observer = function( $Object ){
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if (typeof this[ packet.name ] === "function" ) {
						try{
							this[ packet.name ]( packet.data );
						}catch(e){
						}
					}
				}
			};
		};

		return $.ObjectFactory({
			_extends_ : $Observer,
			_public_  : $Object
		});
	};
})( DevShop );
