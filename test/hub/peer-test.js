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
 * Test cases for hub.peer.
 */
TestCase("PeerTest", {
	
	tearDown: function () {
		hub.reset();
	},
	
	"test should fail if defined twice": function () {
		hub.peer("definedTwice", {});
		
		assertException(function () {
			hub.peer("definedTwice", {});
		});
	},
	
	"test should receive message": function () {
		var fn = stubFn();
		hub.peer("simple", {
			"message": fn
		});
		
		hub.publish("simple/message");
		
		assert(fn.called);
	},
	
	"test should allow dot separated namespace and message": function () {
		var fn = stubFn();
		hub.peer("a.b", {
			"c.d": fn
		});
		
		hub.publish("a.b/c");
		
		assertFalse(fn.called);
		hub.publish("a.b/c.d");
		assert(fn.called);
	},
	
	/*
	 * ensure a peer can be defined after an existing subscription and both
	 * get mixed and then invoked in the correct order.
	 */
	"test should override subscriber": function () {
		var chain = [];
		hub.subscribe("a/b", function () {
			chain.push("subscribe");
		});
		hub.peer("a", {
			"b": function () {
				chain.push("peer");
			}
		});
		
		hub.publish("a/b");
		
		// "peer" first, because it was added last.
		assertEquals("peer,subscribe", chain.join());
	},
	
	"test should receive multicast": function () {
		var chain = [];
		hub.peer("a.b", {
			"m": function () {
				chain.push("x");
			}
		});
		hub.peer("a.c", {
			"m": function () {
				chain.push("y");
			}
		});
		
		hub.publish("a.*/m");
		
		// "y" first, because it was added last.
		assertEquals("y,x", chain.join());
	},
	
	"test should receive message with peer as scope object": function () {
		var fn = stubFn();
		hub.peer("a", {
			"b": fn
		});
		
		hub.publish("a/b");
		
		assertSame(hub.get("a"), fn.scope);
	},
	
	"test should publish create notification message": function () {
		var fn = stubFn();
		hub.subscribe("hub.peer.new/a", fn);

		hub.peer("a", {
			b: function () {}
		});
		
		assert(fn.called);
		assertFunction(fn.args[0].b);
	}
	
});

TestCase("PeerMixTest", {
	
	tearDown: function () {
		hub.reset();
	},
	
	"test should use hub.object": function () {
		var obj = hub.object;
		hub.object = stubFn({});
		try {
			hub.peer("a", function () {});
			hub.get("a");
			assert(hub.object.called);
			assertEquals("a", hub.object.args[0]); // should pass namespace
		} finally {
			hub.object = obj;
		}
	},
	
	"test should override existing message": function () {
		var fn1 = stubFn();
		hub.peer("a", {
			m: fn1
		});
		var fn2 = stubFn();
		hub.peer("b", function () {
			this.mix("a");
			return {
				m: fn2
			};
		});
		
		hub.get("b").m();
		
		assert(fn2.called);
		assert(fn1.called);
	}

});
