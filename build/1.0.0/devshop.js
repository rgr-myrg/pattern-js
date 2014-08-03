/**
 * Copyright (c) 2011-2014 DevShop http://devshop.me/
 * Version: 1.0.0
 * Built: Sun Aug 03 2014 15:15:36 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(w){w.DevShop=w.devshop=w.DevShop||{};})(window);(function(d){d.SingletonFactory=function(c){var a=function(b){if(typeof b==="function")try{return new b}catch(a){}else if(typeof b==="object")return b},e=a(c.__implement),b=a(c.__extend),a=a(c.__construct),f;for(f in b)b.hasOwnProperty(f)&&(a[f]||(a[f]=b[f]));for(f in e)if(e.hasOwnProperty(f)&&!a[f])throw c.instance+" must implement '"+f+"' "+typeof e[f];if(typeof a.initialize==="function")try{a.initialize()}catch(d){}return a}})(DevShop);
(function(d){d.Observable=function(c){return d.SingletonFactory({__extend:function(){return{observers:[],addObserver:function(a){if((typeof a==="function"||typeof a==="object")&&typeof a.notify==="function")if(this.observers.push(a),typeof a.onRegister==="function")a.onRegister()},notifyObservers:function(a){for(var c=this.observers.length,b=0;b<c;b++)this.observers[b].notify(a,this)}}},__construct:c})}})(DevShop);
(function(d){d.Observer=function(c){return d.SingletonFactory({__extend:function(){return{onRegister:function(){},notify:function(a,c){this.observable=c;if(typeof this[a]==="function")try{this[a]()}catch(b){}}}},__construct:c})}})(DevShop);
(function(d){d.EventSignal=function(){var c=[];return{addListener:function(a){typeof a==="function"&&c.push(a)},removeListener:function(a){for(var d=c.length,b=0;b<d;b++)c[b]===a&&(c[b]=null)},dispatch:function(){for(var a=[],d=c.length,b=0;b<d;b++)typeof c[b]==="function"?c[b].apply(this,arguments):a.push(b);d=a.length;for(b=0;b<d;b++)c.splice(b,1)}}}})(DevShop);
(function(d){d.IProxy={NAME:""};d.IMediator={NAME:"",listNotificationInterests:function(){},handleNotification:function(){}};d.ICommand={execute:function(){}};d.Proxy=function(){var c={};return{facade:null,setData:function(a){c=a},getData:function(){return c},onRegister:function(){},onRemove:function(){}}};d.Mediator=d.Observer(function(){return{facade:null,onRegister:function(){},onRemove:function(){}}});d.Facade=function(){var c=function(){var b={};return{facade:{},registerProxy:function(a){a.facade=
this.facade;b[a.NAME]||(b[a.NAME]=a);if(typeof a.onRegister==="function")a.onRegister()},retrieveProxy:function(a){return b[a]?b[a]:null},removeProxy:function(a){if(typeof b[a].onRemove==="function")b[a].onRemove();b[a]=null}}}(),a=new d.Observable(function(){var b={};return{facade:{},notification:{},registerMediator:function(a){a.facade=this.facade;b[a.NAME]||(b[a.NAME]=a,this.addObserver(a))},retrieveMediator:function(a){return b[a]?b[a]:null},removeMediator:function(a){if(typeof b[a].onRemove===
"function")b[a].onRemove();b[a]=null},notifyObservers:function(a){for(var b=this.observers.length,c=0;c<b;c++){for(var d=this.observers[c].listNotificationInterests(),e=!1,g=0,h=d.length;g<h;g++)if(d[g]==this.notification.name){e=!0;break}if(e)this.observers[c].notification=this.notification,this.observers[c].notify(a,this)}},sendNotification:function(a){this.notification=a;this.notifyObservers("handleNotification")}}}),e=new d.Observer(function(){var a={},c=[];return{facade:{},NAME:"BTG.Controller",
registerCommand:function(d,e){e.facade=this.facade;a[d]||(a[d]=e,c.push(d))},listNotificationInterests:function(){return c},handleNotification:function(){var c=this.notification;typeof a[c.name]==="object"&&typeof a[c.name].execute==="function"&&a[c.name].execute(c)}}});return{CMD_STARTUP:"CMD_STARTUP",registerProxy:function(a){c.registerProxy(a)},registerMediator:function(b){a.registerMediator(b)},registerCommand:function(a,c){e.registerCommand(a,c)},retrieveProxy:function(a){return c.retrieveProxy(a)},
retrieveMediator:function(b){return a.retrieveMediator(b)},removeProxy:function(a){c.removeProxy(a)},removeMediator:function(b){a.removeMediator(b)},sendNotification:function(b,c,d){a.sendNotification({name:b,body:c,type:d})},initializeFacade:function(){c.facade=this;a.facade=this;e.facade=this;this.registerMediator(e)}}}})(DevShop);
(function(d){d.Publisher=function(){var c={};return{registerEvents:function(a){typeof a==="object"&&(c=a)},registerSubscriber:function(a){if(typeof a.onRegister==="function"){var d=a.onRegister(),b;for(b in d)d.hasOwnProperty(b)&&typeof c[b]==="object"&&c[b].addListener(d[b]);a.onRegister=function(){}}},notify:function(a,c){typeof a.dispatch==="function"&&a.dispatch(c)}}}})(DevShop);