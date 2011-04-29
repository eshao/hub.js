/*
 hub.js JavaScript library
 https://github.com/mantoni/hub.js

 Copyright 2011, Maximilian Antoni
 Released under the MIT license:
 https://github.com/mantoni/hub.js/raw/master/LICENSE
*/
Hub={};Hub.merge=function(f,b){if(f===undefined||f===null||f===b)return b;if(b===undefined||b===null)return f;var h=Object.prototype.toString,j=h.call(b);h=h.call(f);if(h===j){if(j==="[object Object]"){for(var g in b)f[g]=arguments.callee(f[g],b[g]);return f}if(j==="[object Array]")return f.concat(b)}throw new Hub.Error("validation",h===j?"Cannot merge value {target} with {source}":"Cannot merge type {targetType} with {sourceType}",{target:f,source:b,targetType:h,sourceType:j});};Hub.resolve=function(f,b,h){var j=b.indexOf(".");if(j!==-1){var g=b.substring(0,j);if(g in f)return arguments.callee(f[g],b.substring(j+1),h);return h}return b in f?f[b]:h};Hub.substitute=function(f,b,h){if(h===undefined)h="";return f.replace(/\{([a-zA-Z0-9\.]+)\}/g,b?function(j,g){return Hub.resolve(b,g,h)}:function(){return h})};Hub.Error=function(f,b,h){this.type=f;this.context=h;this.toString=function(){return Hub.substitute(b,h)}};Hub.iterator=function(f){function b(){if(h>=j)throw Error("Iterator out of bounds.");var g=f[h++];b.hasNext=h<j;return g}var h=0,j=f.length;b.hasNext=h<j;b.remove=function(g){var i=typeof g;if(i==="undefined")g=h;else if(i==="number")g<h&&h--;else{for(i=f.length-1;i>=0;i--)if(f[i]===g){g=i;break}if(i<0)return false}if(g>=j)return false;f.splice(g,1);b.hasNext=h<--j;return true};b.insert=function(g,i){if(typeof i==="undefined"){i=g;g=h}else g<h&&h++;f.splice(g,0,i);b.hasNext=h<++j};b.reset=function(){h=
0;b.hasNext=h<j};return b};(function(){function f(){var i=g.length;if(!i)return false;i=g[i-1];if(!i.hasNext){g.pop();return f()}j=Hub.merge(j,i().apply(null,h));return true}var b=false,h,j,g=[];Hub.stopPropagation=function(){b=true;g.length=0};Hub.propagate=function(){f()};Hub.topicComparator=function(i,a){var d=i.indexOf("*"),l=a.indexOf("*");if(d===-1)return l===-1?0:1;if(l===-1)return-1;var c=i.indexOf("/"),e=a.indexOf("/");if(d<c){if(l>e)return-1}else if(l<e)return 1;return 0};Hub.chain=function(){function i(){i.aborted=
false;var d=!g.length;if(d){b=false;h=arguments}j=undefined;try{for(g.push(a);f(););}finally{i.aborted=b;a.reset();if(d)g.length=0}if(!g.length){d=j;h=j=undefined;return d}}var a=Hub.iterator(arguments.length?Array.prototype.slice.call(arguments):[]);i.add=function(d){a.insert(0,d)};i.insert=a.insert;i.remove=a.remove;return i}})();(function(){function f(a,d){return function(){var l=Array.prototype.slice.call(arguments);l=Hub.publish.apply(Hub,[a].concat(l));Hub.aborted()||(l=Hub.merge(l,d.apply(null,arguments)));return l}}function b(a){var d=j[a];if(d)return d;d=g[a];if(!d)throw Error("Peer is not defined: "+a);d=h(d);var l={},c;for(c in d){var e=d[c];if(typeof e==="function")l[c]=f(a+"/"+c,e)}d.api=l;return d}function h(a){for(var d={},l=a.is,c=0,e;e=l[c++];){var k=d;e=b(e);var m=void 0;for(m in e){var p=e[m],n=k[m];n||(k[m]=
n=Hub.chain());n.add(p)}}a=a.instance||a.factory();for(var o in a){l=a[o];(c=d[o])||(d[o]=c=Hub.chain());c.add(l)}return d}var j={},g={},i=[];Hub.peer=function(a,d,l){if(g[a])throw Error("Hub - peer already defined: "+a);if(!l){l=d;d=null}d={is:d?typeof d==="string"?[d]:d:i};if(typeof l==="function")d.factory=l;else{d.instance=l;l=j[a]=h(d);var c=l.api={},e;for(e in l){var k=l[e];if(typeof k==="function"){var m=a+"/"+e;Hub.subscribe(m,k);c[e]=Hub.publisher(m)}}}g[a]=d};Hub.get=function(a){return b(a).api};
Hub.resetPeers=function(){j={};for(var a in g)a.indexOf("lib.")===-1&&delete g[a]}})();(function(){function f(a){a=a.replace(/\./g,"\\.").replace(/\*\*/g,"([a-zA-Z0-9\\.#]+|##)").replace(/\*/g,"([a-zA-Z0-9\\*]+)").replace(/#/g,"\\*");return RegExp("^"+a+"$")}function b(a){a||(a=g);var d=f(a),l=Hub.chain(),c=[],e=function(k,m,p){k||(k=a);if(k!==g&&!d.test(k)){if(k.indexOf("*")===-1||!f(k).test(a))return;k=g}var n=l.apply(null,m);if(l.aborted){e.aborted=true;return n}if(p)for(var o=0,q=c.length;o<q;o++)p.push(c[o]);else p=c.slice();for(;p.length;){o=p.shift();n=Hub.merge(n,o(k,m,p));
if(o.aborted){e.aborted=true;break}}return n};e.matches=function(k){return d.test(k)};e.getTopic=function(){return a};e.add=function(k,m,p){if(a===m)l.add(k);else{for(var n,o=0,q=c.length;o<q;o++){var r=c[o];if(r.matches(m)){r.add(k,m,p);return}p||(p=f(m));if(p.test(r.getTopic())){n=b(m);n.addChild(r);n.add(k,m,p);c[o]=n;return}}n=b(m);n.add(k,m);if(m.indexOf("*")===-1)c.unshift(n);else{o=0;for(q=c.length;o<q;o++){k=c[o].getTopic();if(Hub.topicComparator(k,m)!==-1){c.splice(o,0,n);return}}c.push(n)}}};
e.addChild=function(k){c.unshift(k)};e.remove=function(k,m){if(a===m)return l.remove(k);for(var p=0,n=c.length;p<n;p++){var o=c[p];if(o.matches(m))if(o.remove(k,m))return true}return false};return e}function h(a){var d=typeof a;if(d!=="string")throw Error("Topic is not string: "+d);if(!a)throw Error("Topic is empty");if(!/^[a-zA-Z0-9\.\{\}\*]+(\/[a-zA-Z0-9\.\{\}\*]+)?$/.test(a))throw Error("Illegal topic: "+a);}function j(a){a=typeof a;if(a!=="function")throw Error("Callback is "+a);}var g="**/**",
i=b();Hub.reset=function(){i=b();Hub.resetPeers()};Hub.subscribe=function(a,d){j(d);h(a);i.add(d,a)};Hub.unsubscribe=function(a,d){j(d);h(a);return i.remove(d,a)};Hub.invoke=function(a){h(a);var d=Array.prototype.slice.call(arguments,1);if(a.indexOf("{")!==-1)a=Hub.substitute(a,d);try{return i(a,d)}catch(l){throw new Hub.Error("error",'Error in call chain for topic "{topic}": {error}',{topic:a,error:l.message});}};Hub.aborted=function(){return Boolean(i.aborted)};Hub.topicChain=b})();(function(){function f(c,e){try{c(e)}catch(k){Hub.invoke("hub.error/promise.callback",new Hub.Error("error","Error in promise callback: ${error}",{error:k.message}))}}function b(){Hub.invoke("hub.error/promise.resolved",new Hub.Error("validation","Promise already resolved"))}function h(c){return function(){c.reject({type:"timeout"})}}function j(c,e,k){var m,p,n=!(e instanceof Hub.Error),o;o={then:function(q,r){if(c){var s=n?q:r;s&&f(s,e)}else{q&&m.push(q);r&&p.push(r)}return this},publish:function(q){if(c){e=
Hub.invoke.apply(Hub,arguments);return this}var r=[q];if(arguments.length>1)r=r.concat(arguments);return this.then(function(){e=Hub.invoke.apply(Hub,r)})},publishResult:function(q){if(c){e=Hub.invoke(q,e);return this}return this.then(function(){e=Hub.invoke(q,e)})},resolve:function(q){if(c)b();else{c=true;clearTimeout(k);for(e=Hub.merge(e,q);m.length;)f(m.shift(),e)}return this},reject:function(q){if(c)b();else{c=true;n=false;for(clearTimeout(k);p.length;)f(p.shift(),q)}return this},resolved:function(){return c}};
if(!c){m=[];p=[];k=setTimeout(h(o),k||6E4)}return o}function g(c,e){function k(){if(++o===2)(r?q.resolve:q.reject)(n)}function m(s){if(r)n=Hub.merge(n,s);k()}function p(s){if(r){r=false;n=s}else n=Hub.merge(n,s);k()}var n,o=0,q=j(false),r=true;c.then(m,p);e.then(m,p);return q}function i(c){var e=j(true);c.then=e.then;c.publish=e.publish;c.publishResult=e.publishResult;return e}var a=true,d=Error("Hub - promise already resolved"),l=function(){};l.prototype={then:function(c,e){return i(this).then(c,
e)},publish:function(){return i(this).publish.apply(null,arguments)},publishResult:function(){return i(this).publishResult.apply(null,arguments)},resolve:function(){throw d;},reject:function(){throw d;},resolved:function(){return true}};Hub.publish=function(){var c=a;a=false;var e;try{e=Hub.invoke.apply(this,arguments)}catch(k){if(a&&k instanceof Hub.Error){a.reject(k);return a}throw k;}if(typeof e!=="undefined"){e=j(true,e);a=a?g(a,e):e}e=a;a=c;return e||new l};Hub.promise=function(c){c=j(false,
undefined,c);if(a===false)a=c;else if(a!==true)a=g(a,c);return c}})();Hub.publisher=function(f,b,h){if(typeof f==="string"){if(b){if(h)return function(){return Hub.publish(f,Hub.merge(b.apply(null,arguments),h))};if(typeof b==="function")return function(){return Hub.publish(f,b.apply(null,arguments))};return function(a){return Hub.publish(f,Hub.merge(a,b))}}return function(){if(arguments.length)return Hub.publish.apply(Hub,[f].concat(Array.prototype.slice.call(arguments)));return Hub.publish(f)}}var j=Hub.chain(),g;for(g in f){var i=f[g];j[g]=typeof i==="string"?Hub.publisher(i):
Hub.publisher.apply(Hub,i);j.add(j[g])}return j};Hub.forward=function(f,b,h,j){if(typeof f==="object")for(var g in f){b=f[g];typeof b==="string"?Hub.subscribe(g,Hub.publisher(b)):Hub.subscribe(g,Hub.publisher(b[0],b[1],b[2]))}else Hub.subscribe(f,Hub.publisher(b,h,j))};
