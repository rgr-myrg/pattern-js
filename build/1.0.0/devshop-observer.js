/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Thu Aug 07 2014 10:21:57 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(w){w.DevShop=w.DevShop||{};})(window);(function(b){b.Queue=function(a){var f=null,c=null,e=!1,d=function(){},b=300,g=[];if(typeof a!=="object"||!a.id)throw"Queue options Object is Null";f=a.id;if(!isNaN(a.timeToWait))b=a.timeToWait;if(typeof a.callback==="function")d=a.callback;return{add:function(){g.push(arguments)},start:function(){if(!e)try{c=setInterval(f+".run()",b)}catch(a){}},run:function(){if(g.length>0){e=!0;try{d.apply(this,g.shift())}catch(a){this.stop()}}else this.stop()},stop:function(){e=!1;clearInterval(c)},isRunning:function(){return e}}}})(DevShop);
(function(b){b.ObjectFactory=function(a){if(typeof a!=="object")throw"Object not provided";var f=function(a){if(typeof a==="function")try{return new a}catch(c){}else if(typeof a==="object")return a},c=f(a._implements_),e=f(a._extends_),a=f(a._public_),d;for(d in e)e.hasOwnProperty(d)&&!a[d]&&(a[d]=e[d]);for(d in c)if(c.hasOwnProperty(d)&&!a[d])throw object.instance+" must implement '"+d+"' "+typeof c[d];if(typeof a.init==="function")try{a.init()}catch(b){}return a}})(DevShop);
(function(b){b.Observable=function(a){return b.ObjectFactory({_extends_:function(){var a=[];return{addObserver:function(c){if((typeof c==="function"||typeof c==="object")&&typeof c.update==="function")if(a.push(c),typeof c.onRegister==="function")try{c.onRegister()}catch(b){}},notifyObservers:function(){for(var c=a.length,b=0;b<c;b++){var d=a[b];d.update.apply(d,arguments)}},getObservers:function(){return a}}},_public_:a})}})(DevShop);
(function(b){b.Observer=function(a){return b.ObjectFactory({_extends_:function(){return{update:function(a){if(typeof this[a.name]==="function")try{this[a.name](a.data)}catch(b){}}}},_public_:a})}})(DevShop);
