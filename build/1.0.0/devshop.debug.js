/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Thu Aug 07 2014 00:26:34 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(w){w.DevShop=w.DevShop||{};})(window);/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ) {
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

/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

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

/**
 * Copyright (c) 2011-2014 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

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

/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

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

		return $.ObjectFactory(
			{
				_extends_ : $Observer,
				_public_  : $Object
			}
		);
	};
})( DevShop );

/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

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

/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

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

/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */

(function( $ ) {
	$.MVCObservable = function( obj ) {
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

		return $.ObjectFactory({
			_extends_: observable,
			_public_: obj
		});
	};

	$.MVCObserver = function( obj ) {
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

		return $.ObjectFactory({
			_extends_: observer,
			_public_: obj
		});
	};

	$.IProxy = {
		NAME : ""
	};

	$.IMediator = {
		NAME : "",
		listNotificationInterests : function(){},
		handleNotification : function(){}
	};

	$.ICommand = {
		execute : function( notification ){}
	};

	$.Proxy = function() {
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

	$.Mediator = $.MVCObserver(function() {
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

	$.Facade = function() {
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

			View = $.MVCObservable(function() {
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

			Controller = new $.MVCObserver(function() {
				var	commands = {},
					notifications = [];

				return {
					facade: {},

					NAME: "BTG.Controller",

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
})( DevShop );
