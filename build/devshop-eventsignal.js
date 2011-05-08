/**
 * Copyright (c) 2011 Roger Myrg http://devshop.me/
 * Released under the MIT license:
 * https://github.com/rgr-myrg/DevShop-JS/raw/master/MIT-LICENSE
 */
(function(){window.DevShop=typeof window.DevShop==="object"?window.DevShop:{};window.DevShop.Me=function(a){for(var b in a)a.hasOwnProperty(b)&&(window.DevShop[b]=a[b]);DevShop=devshop=window.DevShop}})();(function(){DevShop.Me({EventSignal:function(){var a=[];this.addListener=function(b){typeof b==="function"&&a.push(b)};this.removeListener=function(b){for(var c=a.length,d=0;d<c;d++)a[d]===b&&a.splice(d)};this.dispatch=function(){for(var b=a.length,c=0;c<b;c++)try{a[c].apply(this,arguments)}catch(d){}}}})})();
