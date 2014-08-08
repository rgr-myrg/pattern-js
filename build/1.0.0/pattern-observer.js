/**
 * Copyright (c) 2011-2014 Activity, LLC.
 * Version: 1.0.0
 * Built: Fri Aug 08 2014 07:26:40 GMT-0400 (EDT)
 * Released under the MIT license:
 * https://github.com/rgr-myrg/pattern-js/raw/master/MIT-LICENSE
 */
(function(w){w.Pattern=w.Pattern||{};})(window);(function(e){e.Queue=function(a){var g=null,b=null,c=!1,d=function(){},e=function(){},i=300,h=-1,f=[];if(typeof a!=="object"||!a.id)throw Error("Queue options Object is Null");g=a.id;if(!isNaN(a.timeToWait)&&a.timeToWait>0)i=a.timeToWait;if(!isNaN(a.maxCount)&&a.maxCount>0)h=a.maxCount;if(typeof a.callback==="function")d=a.callback;if(typeof a.onError==="function")e=a.onError;return{add:function(){if(h>0&&f.length>=h)return e(Error("Max count exceeded: "+f.length)),!1;f.push(arguments);return!0},
start:function(){if(!c)try{b=setInterval(g+".run()",i)}catch(a){e(a)}},run:function(){if(f.length>0){c=!0;try{d.apply(this,f.shift())}catch(a){this.stop(),e(a)}}else this.stop()},stop:function(){c=!1;clearInterval(b)},isRunning:function(){return c},count:function(){return f.length},clear:function(){this.stop();f=[]}}}})(Pattern);
(function(e){e.ObjectFactory=function(a){if(typeof a!=="object")throw"Object not provided";var g=function(a){if(typeof a==="function")try{return new a}catch(b){}else if(typeof a==="object")return a},b=g(a._implements_),c=g(a._extends_),a=g(a._public_),d;for(d in c)c.hasOwnProperty(d)&&!a[d]&&(a[d]=c[d]);for(d in b)if(b.hasOwnProperty(d)&&!a[d])throw object.instance+" must implement '"+d+"' "+typeof b[d];if(typeof a.init==="function")try{a.init()}catch(e){}return a}})(Pattern);
(function(e){e.Observable=function(a){return e.ObjectFactory({_extends_:function(){var a=[];return{addObserver:function(b){if((typeof b==="function"||typeof b==="object")&&typeof b.update==="function")if(a.push(b),typeof b.onRegister==="function")try{b.onRegister()}catch(c){}},notifyObservers:function(){for(var b=a.length,c=0;c<b;c++){var d=a[c];d.update.apply(d,arguments)}},removeObserver:function(b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b){a.splice(c,1);break}}}},_public_:a})}})(Pattern);
(function(e){e.Observer=function(a){return e.ObjectFactory({_extends_:function(){return{update:function(a){if(typeof this[a.eventName]==="function")try{this[a.eventName](a.eventData)}catch(b){}}}},_public_:a})}})(Pattern);
