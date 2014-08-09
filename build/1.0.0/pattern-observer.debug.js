/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Fri Aug 08 2014 23:20:08 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/pattern-js/raw/master/MIT-LICENSE
 */
(function(w){w.Pattern=$P=w.Pattern||{};})(window);(function( $P ) {
	$P.Queue = function( options ) {
		var	objectId   = null,
			intervalId = null,
			running    = false,
			callback   = function(){},
			onError    = function(){},
			timeToWait = 300,
			maxCount   = -1,
			queue      = [];

		if ( typeof options !== "object" || !options.id ) {
			throw( new Error( "Queue options Object is Null" ) );
		}

		objectId = options.id;

		if ( !isNaN( options.timeToWait ) && options.timeToWait > 0 ) {
			timeToWait = options.timeToWait;
		}

		if ( !isNaN( options.maxCount ) && options.maxCount > 0 ) {
			maxCount = options.maxCount;
		}

		if ( typeof options.callback === "function" ) {
			callback = options.callback;
		}

		if ( typeof options.onError === "function" ) {
			onError = options.onError;
		}

		return {
			add: function() {
				if ( maxCount > 0 && queue.length >= maxCount ) {
					onError( new Error( "Max count exceeded: " + queue.length ) );

					return false;
				}

				queue.push( arguments );
				return true;
			},

			start: function() {
				if ( !running ) {
					try {
						intervalId = setInterval( objectId + ".run()", timeToWait );
					} catch( e ) {
						onError( e );
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
						onError( e );
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
			},

			count: function() {
				return queue.length;
			},

			clear: function() {
				this.stop();
				queue = [];
			}
		};
	};
})( Pattern );

(function( $P ) {
	$P.ObjectFactory = function( $Object ) {
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

		_interface_  = getInstance( $Object._implements_ ),
		_superclass_ = getInstance( $Object._extends_ ),
		_instance_   = getInstance( $Object._public_ );

		for ( var i in _superclass_ ) {
			if ( _superclass_.hasOwnProperty( i ) && !_instance_[ i ] ) {
				_instance_[ i ] = _superclass_[ i ];
			}
		}

		for ( i in _interface_ ) {
			if ( _interface_.hasOwnProperty(i) && !_instance_[i] ){
				throw( object.instance + " must implement '" + i + "' " + typeof _interface_[i] );
			}
		}

		if ( typeof _instance_.init === "function" ) {
			try {
				_instance_.init();
			} catch( e ) {
			}
		}

		return _instance_;
	};
})( Pattern );

(function( $P ) {
	$P.Observable = function( $Object ) {
		var $Observable = function() {
			var observers = [];

			return {
				addObserver: function( observer ) {
					if ( (typeof observer === "function" || typeof observer === "object") && 
							typeof observer.update === "function" ){

						observer._observable_ = this;
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

				removeObserver: function( observer ) {
					for ( var x = 0, size = observers.length; x < size; x++ ) {
						if ( observers[ x ] === observer ) {
							observers.splice( x, 1 );
							break;
						}
					}
				}
			};
		};

		return $P.ObjectFactory({
				_extends_ : $Observable,
				_public_  : $Object
		});
	};
})( Pattern );

(function( $P ){
	$P.Observer = function( $Object ){
		var $Observer = function( $Object ){
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if (typeof this[ packet.eventName ] === "function" ) {
						try{
							this[ packet.eventName ]( packet.eventData );
						}catch(e){
						}
					}
				}
			};
		};

		return $P.ObjectFactory({
			_extends_ : $Observer,
			_public_  : $Object
		});
	};
})( Pattern );
