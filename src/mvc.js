/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
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
		}
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
		var	Model = new function(){
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
			},
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
							for(var i = 0; l = notices.length, i<l; i++){
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
						if(typeof commands[notification.name] === "object"
							&& typeof commands[notification.name].execute === "function"){
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
