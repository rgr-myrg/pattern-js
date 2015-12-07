/* v1.1.0 Mon Dec 07 2015 00:15:44 GMT-0500 (EST) */(function(w){w.Pattern=w.Pattern||{};})(window);(function($P){var TRUE = true,

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
		* @returns {number} Length of queue.
		* @since 1.0
		*/
		add: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return FALSE;

			}

			queue.push( arguments );

			return queue;

		},

		/**
		 * Method to add items to beginning of the queue, to be processed first
		 * @param {object[]} arguments - Array of arguments.
		 * @returns {number} Length of queue.
		 * @since 1.1
		 */
		addPriority: function() {

			if ( maxCount > 0 && queue.length >= maxCount ) {

				onError( new Error( "maxCount exceeded: " + queue.length ) );

				return FALSE;

			}

			queue.unshift( arguments );

			return queue;

		},


		/**
		* Method to start the queue.	
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
		* @since 1.0
		*/
		stop: function() {

			running = FALSE;

			return running;

		},

		/**
		* Method to check whether the queue is running.	
		* @returns {boolean} Whether queue is running or not.
		* @since 1.0
		*/
		isRunning: function() {

			return running;

		},

		/**
		* Method to get the length of the queue.	
		* @returns {number} Length of the queue.
		* @since 1.0
		*/
		count: function() {

			return queue.length;

		},

		/**
		* Method to clear the queue.	
		* @since 1.0
		*/
		clear: function() {

			this.stop();
			queue = [];

			return queue;

		}

	};
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

			var	size = listeners.length;

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

	$P.ObjectFactory = function( $Object ) {
		if ( typeof $Object !== "object" ) {
			throw( "Object not provided" );
		}

		var getInstance = function( Konstructor ) {
			if ( typeof Konstructor === "function" ) {
				try {
					return new Konstructor();
				} catch( e ) {
				}
			} else if ( typeof Konstructor === "object" ) {
				return Konstructor;
			}
		},

		_interface_  = getInstance( $Object._implements_ ),
		_superclass_ = getInstance( $Object._extends_ ),
		_instance_   = getInstance( $Object._constructor_ );

		for ( var i in _superclass_ ) {
			if ( _superclass_.hasOwnProperty( i ) && !_instance_[ i ] ) {
				_instance_[ i ] = _superclass_[ i ];
			}
		}

		for ( i in _interface_ ) {
			if ( _interface_.hasOwnProperty(i) && !_instance_[i] ){
				throw( $Object.instance + " must implement '" + i + "' " + typeof _interface_[i] );
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

	$P.Observable = function( $Object ) {
		var $Observable = function() {
			var observers = [];

			return {
				addObserver: function( observer ) {
					if ( ( typeof observer === "function" || typeof observer === "object" ) && 
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
					for ( var x = 0, size = observers.length; x < size; x++ ) {
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
			_extends_: $Observable,
			_constructor_: $Object
		});
	};

	$P.Observer = function( $Object ) {
		var $Observer = function( $Object ) {
			return {
				update: function() {
					var packet = arguments[ 0 ];

					if ( typeof this[ packet.eventName ] === "function" ) {
						try {
							this[ packet.eventName ]( packet.eventData );
						} catch( e ) {
						}
					}
				}
			};
		};

		return $P.ObjectFactory({
			_extends_: $Observer,
			_constructor_: $Object
		});
	};

$P.Publisher = function() {
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

	$P.MVCObservable = function( obj ) {
		var observable = function() {
			return {
				observers: [],

				addObserver: function( o ){
					if( (typeof o === "function" || typeof o === "object") && 
							typeof o.notify === "function" ){

						this.observers.push( o );

						if( typeof o.onRegister === "function" ) {
							o.onRegister();
						}
					}
				},

				notifyObservers: function( eventName ) {
					var size = this.observers.length;

					for( var x = 0; x < size; x++ ) {
						this.observers[x].notify( eventName, this );
					}
				}
			};
		};

		return $P.ObjectFactory({
			_extends_: observable,
			_constructor_: obj
		});
	};

	$P.MVCObserver = function( obj ) {
		var observer = function( obj ) {
			return {
				onRegister: function() {
				},

				notify: function( eventName, observable ) {
					this.observable = observable;

					if( typeof this[ eventName ] === "function" ) {
						try {
							this[ eventName ]();
						} catch( e ) {
						}
					}
				}
			};
		};

		return $P.ObjectFactory({
			_extends_: observer,
			_constructor_: obj
		});
	};

	$P.IProxy = {
		NAME : ""
	};

	$P.IMediator = {
		NAME : "",
		listNotificationInterests : function(){},
		handleNotification : function(){}
	};

	$P.ICommand = {
		execute : function( notification ){}
	};

	$P.Proxy = function() {
		var data = {};

		return {
			facade: null,

			setData: function( obj ) {
				data = obj;
			},

			getData: function() {
				return data;
			},

			onRegister: function() {
				return;
			},

			onRemove: function() {
				return;
			}
		};
	};

	$P.Mediator = $P.MVCObserver(function() {
		return {
			facade: null,
			onRegister: function() {
				return;
			},
			onRemove: function() {
				return;
			}
		};
	});

	$P.Facade = function() {
		var	Model = (function() {
				var proxies = {};

				return {
					facade: {},

					registerProxy: function( proxy ) {
						proxy.facade = this.facade;

						if( !proxies[ proxy.NAME ] ) {
							proxies[ proxy.NAME ] = proxy;
						}

						if(typeof proxy.onRegister === "function" ){
							proxy.onRegister();
						}
					},

					retrieveProxy : function( key ) {
						return proxies[ key ] ? proxies[ key ] : null;
					},

					removeProxy : function( key ){
						if( typeof proxies[ key ].onRemove === "function" ){
							proxies[ key ].onRemove();
						}

						proxies[ key ] = null;
					}
				};
			})(),

			View = $P.MVCObservable(function() {
				var mediators = {};

				return {
					facade: {},

					notification: {},

					registerMediator: function( mediator ) {
						mediator.facade = this.facade;

						if( !mediators[ mediator.NAME ] ) {
							mediators[ mediator.NAME ] = mediator;
							this.addObserver( mediator );
						}
					},

					retrieveMediator: function( key ) {
						return mediators[ key ] ? mediators[ key ] : null;
					},

					removeMediator: function( key ) {
						if( typeof mediators[ key ].onRemove === "function" ) {
							mediators[ key ].onRemove();
						}

						mediators[ key ] = null;
					},

					notifyObservers: function( eventName ) {
						var size = this.observers.length;

						for ( var x = 0; x < size; x++ ) {
							var	notices = this.observers[ x ].listNotificationInterests(),
								deliver = false;

							for (var i = 0, l = notices.length; i < l; i++ ) {
								if( notices[ i ] === this.notification.name ) {
									deliver = true;
									break;
								}
							}

							if( deliver ){
								this.observers[ x ].notification = this.notification;
								this.observers[ x ].notify( eventName, this );
							}
						}
					},

					sendNotification: function( notification ) {
						this.notification = notification;
						this.notifyObservers( "handleNotification" );
					}
				};
			}),

			Controller = new $P.MVCObserver(function() {
				var	commands = {},
					notifications = [];

				return {
					facade: {},

					NAME: "Controller",

					registerCommand: function( key, command ) {
						command.facade = this.facade;

						if( !commands[ key ] ) {
							commands[ key ] = command;
							notifications.push( key );
						}
					},

					listNotificationInterests: function() {
						return notifications;
					},

					handleNotification: function() {
						var notification = this.notification;

						if( typeof commands[ notification.name ] === "object" && 
								typeof commands[ notification.name ].execute === "function" ) {
							commands[ notification.name ].execute( notification );
						}
					}
				};
			}),

			initializeModel = function( app ) {
				Model.facade = app;
			},

			initializeView = function( app ) {
				View.facade = app;
			},

			initializeController = function( app ) {
				Controller.facade = app;
				app.registerMediator( Controller );
			};

		return {
			CMD_STARTUP: "CMD_STARTUP",

			registerProxy: function( proxy ) {
				Model.registerProxy( proxy );
			},

			registerMediator : function( mediator ) {
				View.registerMediator( mediator );
			},

			registerCommand : function( key, command ) {
				Controller.registerCommand( key, command );
			},

			retrieveProxy : function( key ) {
				return Model.retrieveProxy( key );
			},

			retrieveMediator : function( key ) {
				return View.retrieveMediator( key );
			},

			removeProxy : function( key ) {
				Model.removeProxy( key );
			},

			removeMediator : function( key ) {
				View.removeMediator( key );
			},

			sendNotification : function( name, body, type ) {
				View.sendNotification({
					name: name,
					body: body,
					type: type
				});
			},

			initializeFacade: function() {
				initializeModel( this );
				initializeView( this );
				initializeController( this );
			}
		};
	};
$P.version='1.1.0';})(Pattern);