(function(){window.DevShop=typeof window.DevShop==="object"?window.DevShop:{};window.DevShop.Me=function(a){for(var b in a)a.hasOwnProperty(b)&&(window.DevShop[b]=a[b]);DevShop=devshop=window.DevShop}})();(function(){DevShop.Me({SingletonFactory:function(a){var b={},c={};if(typeof a.extend==="function")try{b=new a.extend}catch(d){}else if(typeof a.extend==="object")b=a.extend;if(typeof a.instance==="function")try{c=new a.instance}catch(f){}else if(typeof a.instance==="object")c=a.instance;for(var e in b)b.hasOwnProperty(e)&&(c[e]||(c[e]=b[e]));if(typeof c.initialize==="function")try{c.initialize()}catch(g){}return c}})})();(function(){DevShop.Me({Observable:function(a){return DevShop.SingletonFactory({extend:function(){this.observers=[];this.addObserver=function(b){if((typeof b==="function"||typeof b==="object")&&typeof b.notify==="function")if(this.observers.push(b),typeof b.onRegister==="function")try{b.onRegister()}catch(a){}};this.notifyObservers=function(b){for(var a=this.observers.length,d=0;d<a;d++)try{this.observers[d].notify(b,this)}catch(f){}}},instance:a})}})})();(function(){DevShop.Me({Observer:function(a){return DevShop.SingletonFactory({extend:function(){this.onRegister=function(){};this.notify=function(b,a){this.observable=a;if(typeof this[b]==="function")try{this[b]()}catch(d){}}},instance:a})}})})();(function(){DevShop.Me({EventSignal:function(){var a=[];this.addListener=function(b){typeof b==="function"&&a.push(b)};this.removeListener=function(b){for(var c=a.length,d=0;d<c;d++)a[d]===b&&a.splice(d)};this.dispatch=function(){for(var b=a.length,c=0;c<b;c++)try{a[c].apply(this,arguments)}catch(d){}}}})})();
