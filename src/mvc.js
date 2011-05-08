/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){
	DevShop.Me({
		ProxyInterface:{
			NAME:""
		},
		MediatorInterface:{
			NAME:"",
			listNotificationInterests:function(){},
			handleNotification:function(){}
		},
		CommandInterface:{
			execute:function(notification){}
		},
		Proxy:function(){
			var data={};
			this.facade=null;
			this.setData=function(obj){
				data=obj;
			};
			this.getData=function(){
				return data;
			};
			this.onRegister=function(){
				return;
			};
			this.onRemove=function(){
				return;
			};
		},
		Mediator:new DevShop.Observer(function(){
			this.facade=null;
			this.onRegister=function(){
				return;
			};
			this.onRemove=function(){
				return;
			};
		}),
		Facade:function(){
			var Model=new function(){
				var proxies={};
				this.facade={};
				this.registerProxy=function(proxy){
					proxy.facade=this.facade;
					if(!proxies[proxy.NAME])
						proxies[proxy.NAME]=proxy;
					if(typeof proxy.onRegister==="function")
						proxy.onRegister();
				};
				this.retrieveProxy=function(key){
					return proxies[key]?proxies[key]:null;
				};
				this.removeProxy=function(key){
					if(typeof proxies[key].onRemove==="function")
						try{proxies[key].onRemove();}catch(e){}
					proxies[key]=null;
				};
			};
			var View=new DevShop.Observable(function(){
				var mediators={};
				this.facade={};
				this.notification={};
				this.registerMediator=function(mediator){
					mediator.facade=this.facade;
					if(!mediators[mediator.NAME]){
						mediators[mediator.NAME]=mediator;
						this.addObserver(mediator);
					}
				};
				this.retrieveMediator=function(key){
					return mediators[key]?mediators[key]:null;
				};
				this.removeMediator=function(key){
					if(typeof mediators[key].onRemove==="function")
						try{mediators[key].onRemove();}catch(e){}
					mediators[key]=null;
				};
				this.notifyObservers=function(eventName){
					var size=this.observers.length;
					for(var x=0;x<size;x++){
						try{
							var notices=this.observers[x].listNotificationInterests();
							var deliver=false;
							for(var i=0;l=notices.length,i<l;i++){
								if(notices[i]==this.notification.name){
									deliver=true;
									break;
								}
							}
							if(deliver){
								this.observers[x].notification=this.notification;
								this.observers[x].notify(eventName,this);
							}
						}catch(e){}
					}
				};
				this.sendNotification=function(notification){
					this.notification=notification;
					this.notifyObservers('handleNotification');
				};
			});
			var Controller=new DevShop.Observer(function(){
				var commands={};
				var notifications=[];
				this.facade={};
				this.NAME="DevShop.Controller";
				this.registerCommand=function(key,command){
					command.facade=this.facade;
					if(!commands[key]){
						commands[key]=command;
						notifications.push(key);
					}
				};
				this.listNotificationInterests=function(){
					return notifications;
				};
				this.handleNotification=function(){
					var notification=this.notification;
					if(typeof commands[notification.name]==="object")
						if(typeof commands[notification.name].execute==="function")
							try{
								commands[notification.name].execute(notification);
							}catch(e){}
				};
			});
			var initializeModel=function(app){
				Model.facade=app;
			};
			var initializeView=function(app){
				View.facade=app;
			};
			var initializeController=function(app){
				Controller.facade=app;
				app.registerMediator(Controller);
			};
			this.CMD_STARTUP="CMD_STARTUP";
			this.registerProxy=function(proxy){
				Model.registerProxy(proxy);
			};
			this.registerMediator=function(mediator){
				View.registerMediator(mediator);
			};
			this.registerCommand=function(key,command){
				Controller.registerCommand(key,command);
			};
			this.retrieveProxy=function(key){
				return Model.retrieveProxy(key);
			};
			this.retrieveMediator=function(key){
				return View.retrieveMediator(key);
			};
			this.removeProxy=function(key){
				Model.removeProxy(key);
			};
			this.removeMediator=function(key){
				View.removeMediator(key);
			};
			this.sendNotification=function(name,body,type){
				View.sendNotification({
					name:name,
					body:body,
					type:type
				});
			};
			this.initializeFacade=function(app){
				initializeModel(app);
				initializeView(app);
				initializeController(app);
			};
		}
	});
})();
