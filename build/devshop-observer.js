/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){window.DevShop=typeof window.DevShop==="object"?window.DevShop:{};window.DevShop.Me=function(b){for(var a in b)b.hasOwnProperty(a)&&(window.DevShop[a]=b[a])}})();(function(){DevShop.Me({SingletonFactory:function(b){var a=function(a){if(typeof a==="function")try{return new a}catch(b){}else if(typeof a==="object")return a},e=a(b.implement),d=a(b.extend),a=a(b.instance),c;for(c in d)d.hasOwnProperty(c)&&(a[c]||(a[c]=d[c]));for(c in e)if(e.hasOwnProperty(c)&&!a[c])throw b.instance+" must implement '"+c+"' "+typeof e[c];if(typeof a.initialize==="function")try{a.initialize()}catch(f){}return a}})})();(function(){DevShop.Me({Observable:function(b){return DevShop.SingletonFactory({extend:function(){this.observers=[];this.addObserver=function(a){if((typeof a==="function"||typeof a==="object")&&typeof a.notify==="function")if(this.observers.push(a),typeof a.onRegister==="function")try{a.onRegister()}catch(b){}};this.notifyObservers=function(a){for(var b=this.observers.length,d=0;d<b;d++)try{this.observers[d].notify(a,this)}catch(c){}}},instance:b})}})})();(function(){DevShop.Me({Observer:function(b){return DevShop.SingletonFactory({extend:function(){this.onRegister=function(){};this.notify=function(a,b){this.observable=b;if(typeof this[a]==="function")try{this[a]()}catch(d){}}},instance:b})}})})();
