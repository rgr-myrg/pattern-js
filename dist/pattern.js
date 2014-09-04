/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.1
 * Built: Thu Sep 04 2014 10:54:07 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/pattern-js/raw/master/MIT-LICENSE
 */
(function(w){w.Pattern=$P=w.Pattern||{};})(window);(function($P){$P.Queue=function(a){var d=null,e=null,c=!1,b=function(){},g=function(){},j=300,h=-1,f=[];if(typeof a!=="object"||!a.id)throw Error("Queue options Object is Null");d=a.id;if(!isNaN(a.timeToWait)&&a.timeToWait>0)j=a.timeToWait;if(!isNaN(a.maxCount)&&a.maxCount>0)h=a.maxCount;if(typeof a.callback==="function")b=a.callback;if(typeof a.onError==="function")g=a.onError;return{add:function(){if(h>0&&f.length>=h)return g(Error("Max count exceeded: "+f.length)),!1;f.push(arguments);return!0},start:function(){if(!c)try{e=
setInterval(d+".run()",j)}catch(b){g(b)}},run:function(){if(f.length>0){c=!0;try{b.apply(this,f.shift())}catch(d){this.stop(),g(d)}}else this.stop()},stop:function(){c=!1;clearInterval(e)},isRunning:function(){return c},count:function(){return f.length},clear:function(){this.stop();f=[]}}};
$P.ObjectFactory=function(a){if(typeof a!=="object")throw"Object not provided";var d=function(c){if(typeof c==="function")try{return new c}catch(b){}else if(typeof c==="object")return c},e=d(a._implements_),c=d(a._extends_),a=d(a._constructor_),b;for(b in c)c.hasOwnProperty(b)&&!a[b]&&(a[b]=c[b]);for(b in e)if(e.hasOwnProperty(b)&&!a[b])throw object.instance+" must implement '"+b+"' "+typeof e[b];if(typeof a.init==="function")try{a.init()}catch(g){}return a};
$P.Observable=function(a){return $P.ObjectFactory({_extends_:function(){var d=[];return{addObserver:function(a){if((typeof a==="function"||typeof a==="object")&&typeof a.update==="function")if(a._observable_=this,d.push(a),typeof a.onRegister==="function")try{a.onRegister()}catch(c){}},notifyObservers:function(){for(var a=0,c=d.length;a<c;a++){var b=d[a];b.update.apply(b,arguments)}},removeObserver:function(a){for(var c=0,b=d.length;c<b;c++)if(d[c]===a){d.splice(c,1);break}}}},_constructor_:a})};
$P.Observer=function(a){return $P.ObjectFactory({_extends_:function(){return{update:function(a){if(typeof this[a.eventName]==="function")try{this[a.eventName](a.eventData)}catch(e){}}}},_constructor_:a})};
$P.EventSignal=function(){var a=[];return{addListener:function(d){typeof d==="function"&&a.push(d)},removeListener:function(d){for(var e=a.length,c=0;c<e;c++)a[c]===d&&(a[c]=null)},dispatch:function(){for(var d=[],e=a.length,c=0;c<e;c++){var b=a[c];typeof b==="function"?b.apply(this,arguments):d.push(c)}e=d.length;for(c=0;c<e;c++)a.splice(c,1)}}};
$P.Publisher=function(){var a={};return{registerEvents:function(d){typeof d==="object"&&(a=d)},registerSubscriber:function(d){if(typeof d.onRegister==="function"){var e=d.onRegister(),c;for(c in e)e.hasOwnProperty(c)&&typeof e[c]==="function"&&typeof a[c]==="object"&&typeof a[c].addListener==="function"&&a[c].addListener(e[c]);d.onRegister=function(){}}},notify:function(a,e){typeof a.dispatch==="function"&&a.dispatch(e)}}};
$P.MVCObservable=function(a){return $P.ObjectFactory({_extends_:function(){return{observers:[],addObserver:function(a){if((typeof a==="function"||typeof a==="object")&&typeof a.notify==="function")if(this.observers.push(a),typeof a.onRegister==="function")a.onRegister()},notifyObservers:function(a){for(var e=this.observers.length,c=0;c<e;c++)this.observers[c].notify(a,this)}}},_constructor_:a})};
$P.MVCObserver=function(a){return $P.ObjectFactory({_extends_:function(){return{onRegister:function(){},notify:function(a,e){this.observable=e;if(typeof this[a]==="function")try{this[a]()}catch(c){}}}},_constructor_:a})};$P.IProxy={NAME:""};$P.IMediator={NAME:"",listNotificationInterests:function(){},handleNotification:function(){}};$P.ICommand={execute:function(){}};$P.Proxy=function(){var a={};return{facade:null,setData:function(d){a=d},getData:function(){return a},onRegister:function(){},onRemove:function(){}}};
$P.Mediator=$P.MVCObserver(function(){return{facade:null,onRegister:function(){},onRemove:function(){}}});
$P.Facade=function(){var a=function(){var a={};return{facade:{},registerProxy:function(b){b.facade=this.facade;a[b.NAME]||(a[b.NAME]=b);if(typeof b.onRegister==="function")b.onRegister()},retrieveProxy:function(b){return a[b]?a[b]:null},removeProxy:function(b){if(typeof a[b].onRemove==="function")a[b].onRemove();a[b]=null}}}(),d=$P.MVCObservable(function(){var a={};return{facade:{},notification:{},registerMediator:function(b){b.facade=this.facade;a[b.NAME]||(a[b.NAME]=b,this.addObserver(b))},retrieveMediator:function(b){return a[b]?
a[b]:null},removeMediator:function(b){if(typeof a[b].onRemove==="function")a[b].onRemove();a[b]=null},notifyObservers:function(a){for(var c=this.observers.length,d=0;d<c;d++){for(var e=this.observers[d].listNotificationInterests(),f=!1,i=0,k=e.length;i<k;i++)if(e[i]==this.notification.name){f=!0;break}if(f)this.observers[d].notification=this.notification,this.observers[d].notify(a,this)}},sendNotification:function(a){this.notification=a;this.notifyObservers("handleNotification")}}}),e=new $P.MVCObserver(function(){var a=
{},b=[];return{facade:{},NAME:"Controller",registerCommand:function(d,e){e.facade=this.facade;a[d]||(a[d]=e,b.push(d))},listNotificationInterests:function(){return b},handleNotification:function(){var b=this.notification;typeof a[b.name]==="object"&&typeof a[b.name].execute==="function"&&a[b.name].execute(b)}}});return{CMD_STARTUP:"CMD_STARTUP",registerProxy:function(c){a.registerProxy(c)},registerMediator:function(a){d.registerMediator(a)},registerCommand:function(a,b){e.registerCommand(a,b)},retrieveProxy:function(c){return a.retrieveProxy(c)},
retrieveMediator:function(a){return d.retrieveMediator(a)},removeProxy:function(c){a.removeProxy(c)},removeMediator:function(a){d.removeMediator(a)},sendNotification:function(a,b,e){d.sendNotification({name:a,body:b,type:e})},initializeFacade:function(){a.facade=this;d.facade=this;e.facade=this;this.registerMediator(e)}}};
})(Pattern);