/*jslint undef: true, white: true*/
/*globals hub stubFn TestCase fail assert assertFalse assertNull assertNotNull
	assertUndefined assertNotUndefined assertSame assertNotSame assertEquals
	assertFunction assertObject assertArray assertException assertNoException
*/
/**
 * Copyright 2011, Maximilian Antoni
 * Released under the MIT license:
 * https://github.com/mantoni/hub.js/raw/master/LICENSE
 */
/*
 * Test cases for hub.subscribe.
 */
TestCase("SubscribeTest", {
	
	tearDown: function () {
		hub.reset();
	},
	
	testFunctionExists: function () {
		assertFunction(hub.subscribe);
	},
	
	"test subscribe invocation": function () {
		var fn = stubFn();
		assertNoException(function () {
			hub.subscribe("a", fn);
		});
		assertNoException(function () {
			hub.subscribe("a/b", fn);
		});
		assertNoException(function () {
			hub.subscribe("a/*", fn);
		});
		assertNoException(function () {
			hub.subscribe("*/b", fn);
		});
		assertNoException(function () {
			hub.subscribe("a.*/b", fn);
		});
		assertNoException(function () {
			hub.subscribe("a/b.*", fn);
		});
		assertNoException(function () {
			hub.subscribe("a.*/b.*", fn);
		});
		assertNoException(function () {
			hub.subscribe("*.a/b", fn);
		});
		assertNoException(function () {
			hub.subscribe("*.a/*.b", fn);
		});
		assertNoException(function () {
			hub.subscribe("**/b", fn);
		});
		assertNoException(function () {
			hub.subscribe("a/**", fn);
		});
	},
	
	"test subscribe throws if callback is not function": function () {
		assertException(function () {
			hub.subscribe("x/y");
		});
		assertException(function () {
			hub.subscribe("x/y", null);
		});
		assertException(function () {
			hub.subscribe("x/y", true);
		});
		assertException(function () {
			hub.subscribe("x/y", {});
		});
		assertException(function () {
			hub.subscribe("x/y", []);
		});
	}
	
});