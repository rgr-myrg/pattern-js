/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Version: 1.0.0
 * Built: Sun Aug 03 2014 12:41:45 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(w){w.DevShop=w.devshop=w.DevShop||{};})(window);/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.SingletonFactory = function(obj){
		var getInstance = function(c){
			if(typeof c === "function"){
				try{
					return new c();
				}catch(e){
				}
			}else if(typeof c === "object"){
				return c;
			}
		},
		interfase = getInstance(obj.__implement),
		baseclass = getInstance(obj.__extend),
		singleton = getInstance(obj.__construct);
		for(var i in baseclass){
			if(baseclass.hasOwnProperty(i)){
				if(!singleton[i]){
					singleton[i] = baseclass[i];
				}
			}
		}
		for(i in interfase){
			if(interfase.hasOwnProperty(i)){
				if(!singleton[i]){
					throw(obj.instance + " must implement '" + i + "' " + typeof interfase[i]);
				}
			}
		}
		if(typeof singleton.initialize === "function"){
			try{
				singleton.initialize();
			}catch(e){
			}
		}
		return singleton;
	};
})(DevShop);

/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.Observable = function(obj){
		var observable = function(){
			return {
				observers : [],
				addObserver : function(o){
					if((typeof o === "function" || typeof o === "object") && 
							typeof o.notify === "function"){

						this.observers.push(o);
						if(typeof o.onRegister === "function"){
							o.onRegister();
						}
					}
				},
				notifyObservers : function(eventName){
					var size = this.observers.length;
					for(var x = 0; x < size; x++){
						this.observers[x].notify(eventName,this);
					}
				}
			};
		};
		return $.SingletonFactory(
			{
				__extend : observable,
				__construct : obj
			}
		);
	};
})(DevShop);

/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.Observer = function(obj){
		var observer = function(obj){
			return {
				onRegister : function(){
				},
				notify : function(eventName, observable){
					this.observable = observable;
					if(typeof this[eventName] === 'function'){
						try{
							this[eventName]();
						}catch(e){
						}
					}
				}
			};
		};
		return $.SingletonFactory(
			{
				__extend : observer,
				__construct: obj
			}
		);
	};
})(DevShop);

/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.EventSignal = function(obj){
		var listeners = [];
		return {
			addListener : function(listener){
				if(typeof listener === 'function'){
					listeners.push(listener);
				}
			},
			removeListener : function(listener){
				var size = listeners.length;
				for(var x = 0; x < size; x++){
					if(listeners[x] === listener){
						//listeners.splice(x, 1);
						//Setting to null instead as splice changes the array dynamically
						listeners[x] = null;
					}
				}
			},
			dispatch : function(){
				var temp = [];
				var size = listeners.length;
				for(var x = 0; x < size; x++){
					var listener = listeners[x];
					if(typeof listener === 'function'){
						listeners[x].apply(this, arguments);
					}else{
						temp.push(x);
					}
				}
				size = temp.length;
				for(x = 0; x < size; x++){
					listeners.splice(x, 1);
				}
			}
		};
	};
})(DevShop);

/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.IProxy = {
		NAME : ""
	};
	$.IMediator = {
		NAME : "",
		listNotificationInterests : function(){},
		handleNotification : function(){}
	};
	$.ICommand = {
		execute : function(notification){}
	};
	$.Proxy = function(){
		var data = {};
		return {
			facade  : null,
			setData : function(obj){
				data = obj;
			},
			getData : function(){
				return data;
			},
			onRegister : function(){
				return;
			},
			onRemove : function(){
				return;
			}
		};
	};
	$.Mediator = $.Observer(function(){
		return {
			facade : null,
			onRegister : function(){
				return;
			},
			onRemove : function(){
				return;
			}
		};
	});
	$.Facade = function(){
		var	Model = (function(){
				var proxies = {};
				return {
					facade : {},
					registerProxy : function(proxy){
						proxy.facade = this.facade;
						if(!proxies[proxy.NAME]){
							proxies[proxy.NAME] = proxy;
						}
						if(typeof proxy.onRegister === "function"){
							proxy.onRegister();
						}
					},
					retrieveProxy : function(key){
						return proxies[key] ? proxies[key] : null;
					},
					removeProxy : function(key){
						if(typeof proxies[key].onRemove === "function"){
							proxies[key].onRemove();
						}
						proxies[key] = null;
					}
				};
			})(),
			View = new $.Observable(function(){
				var mediators = {};
				return {
					facade : {},
					notification : {},
					registerMediator : function(mediator){
						mediator.facade = this.facade;
						if(!mediators[mediator.NAME]){
							mediators[mediator.NAME] = mediator;
							this.addObserver(mediator);
						}
					},
					retrieveMediator : function(key){
						return mediators[key] ? mediators[key] : null;
					},
					removeMediator : function(key){
						if(typeof mediators[key].onRemove === "function"){
							mediators[key].onRemove();
						}
						mediators[key] = null;
					},
					notifyObservers : function(eventName){
						var size = this.observers.length;
						for(var x = 0; x < size; x++){
							var notices = this.observers[x].listNotificationInterests();
							var deliver = false;
							for(var i = 0, l = notices.length; i<l; i++){
								if(notices[i] == this.notification.name){
									deliver = true;
									break;
								}
							}
							if(deliver){
								this.observers[x].notification = this.notification;
								this.observers[x].notify(eventName,this);
							}
						}
					},
					sendNotification : function(notification){
						this.notification = notification;
						this.notifyObservers('handleNotification');
					}
				};
			}),
			Controller = new $.Observer(function(){
				var	commands = {},
					notifications = [];
				return {
					facade : {},
					NAME : "BTG.Controller",
					registerCommand : function(key, command){
						command.facade = this.facade;
						if(!commands[key]){
							commands[key] = command;
							notifications.push(key);
						}
					},
					listNotificationInterests : function(){
						return notifications;
					},
					handleNotification : function(){
						var notification = this.notification;
						if(typeof commands[notification.name] === "object" && 
								typeof commands[notification.name].execute === "function"){
							commands[notification.name].execute(notification);
						}
					}
				};
			}),
			initializeModel = function(app){
				Model.facade = app;
			},
			initializeView = function(app){
				View.facade = app;
			},
			initializeController = function(app){
				Controller.facade = app;
				app.registerMediator(Controller);
			};
		return {
			CMD_STARTUP : "CMD_STARTUP",
			registerProxy : function(proxy){
				Model.registerProxy(proxy);
			},
			registerMediator : function(mediator){
				View.registerMediator(mediator);
			},
			registerCommand : function(key,command){
				Controller.registerCommand(key,command);
			},
			retrieveProxy : function(key){
				return Model.retrieveProxy(key);
			},
			retrieveMediator : function(key){
				return View.retrieveMediator(key);
			},
			removeProxy : function(key){
				Model.removeProxy(key);
			},
			removeMediator : function(key){
				View.removeMediator(key);
			},
			sendNotification : function(name, body, type){
				View.sendNotification({
					name : name,
					body : body,
					type : type
				});
			},
			initializeFacade : function(){
				initializeModel(this);
				initializeView(this);
				initializeController(this);
			}
		};
	};
})(DevShop);

/**
 * Copyright (c) 2011 DevShop http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function($){
	$.Publisher = function(){
		var events = {};
		return {
			registerEvents : function(eventList){
				if(typeof eventList === 'object'){
					events = eventList;
				}
			},
			registerSubscriber : function(subscriber){
				if(typeof subscriber.onRegister === 'function'){
					var listeners = subscriber.onRegister();
					for(var i in listeners){
						if(listeners.hasOwnProperty(i) && typeof events[i] === 'object'){
							events[i].addListener(listeners[i]);
						}
					}
					subscriber.onRegister = function(){};
				}
			},
			notify : function(event, data){
				if(typeof event.dispatch === 'function'){
					event.dispatch(data);
				}
			}
		};
	};
})(DevShop);
