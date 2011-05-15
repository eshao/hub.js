/*jslint undef: true, white: true*/
/*globals Hub stubFn TestCase fail assert assertFalse assertNull assertNotNull
	assertUndefined assertNotUndefined assertSame assertNotSame assertEquals
	assertFunction assertObject assertArray assertException assertNoException
*/
/**
 * Copyright 2011, Maximilian Antoni
 * Released under the MIT license:
 * https://github.com/mantoni/hub.js/raw/master/LICENSE
 */
/*
 * Test cases for the observer pattern.
 */
TestCase("ObserverTest", {
	
	tearDown: function () {
		Hub.reset();
	},

	"test abserver": function () {
		
		// The Observable singleton peer:
		Hub.peer("Observable", (function () {
			var observers = [];
			return {
				observe: function (observer) {
					observers.push(observer);
				},
				notify: function () {
					var i, l;
					for (i = 0, l = observers.length; i < l; i++) {
						observers[i].onChange();
					}
				}
			};
		}()));
		
		var instances = 0;
		var invocations = 0;
		
		// The Observer prototype peer:
		Hub.peer("Observer", function () {
			instances++;
			return {
				onChange: function () {
					invocations++;
				}
			};
		});
		
		var observable = Hub.get("Observable");
		observable.observe(Hub.get("Observer"));
		assertEquals(1, instances);
		observable.observe(Hub.get("Observer"));
		// ^-- same as Hub.publish("Observable/observe", Hub.get("Observer"));
		assertEquals(2, instances);
		assertEquals(0, invocations);
		observable.notify();
		// ^-- same as Hub.publish("Observable/notify");
		assertEquals(2, invocations);
	}

});