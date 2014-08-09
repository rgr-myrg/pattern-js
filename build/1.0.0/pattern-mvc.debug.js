/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Fri Aug 08 2014 23:20:38 GMT-0400 (EDT)
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
			_public_: obj
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
			_public_: obj
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
								if( notices[ i ] == this.notification.name ) {
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
})( Pattern );
