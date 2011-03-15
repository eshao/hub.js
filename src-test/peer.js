/*
 * Test cases for Hub.peer.
 */
TestCase("peer", {
	
	tearDown: function() {
		Hub.reset();
	},
	
	"test defining a node twice fails": function() {
		Hub.peer("definedTwice", {});
		try {
			Hub.peer("definedTwice", {});
		} catch(e) {
			assertEquals("Hub - peer already defined: definedTwice", e.message);
			return;
		}
		fail("Exception expected");
	},
	
	"test a simple peer definition with one listener works": function() {
		var fn = stubFn();
		Hub.peer("simple", {
			"message": fn
		});
		Hub.publish("simple/message");
		assertTrue(fn.called);
	},
	
	"test dot separated namespaces used for peer and listener": function() {
		var fn = stubFn();
		Hub.peer("a.b", {
			"c.d": fn
		});
		Hub.publish("a.b/c");
		assertFalse(fn.called);
		Hub.publish("a.b/c.d");
		assertTrue(fn.called);
	},
	
	/*
	 * ensure a peer can be defined after an existing subscription
	 * and both get mixed and then invoked in the correct order.
	 */
	"test subscribe then add peer": function() {
		var chain = [];
		Hub.subscribe("a/b", function() {
			chain.push("subscribe");
		});
		Hub.peer("a", {
			"b": function() {
				chain.push("node");
			}
		});
		Hub.publish("a/b");
		// node first, because it was added last.
		assertEquals("node,subscribe", chain.join());
	},
	
	"test peer multicasting": function() {
		var chain = [];
		Hub.peer("a.b", {
			"m": function() {
				chain.push("x");
			}
		});
		Hub.peer("a.c", {
			"m": function() {
				chain.push("y");
			}
		});
		Hub.publish("a.*/m");
		assertEquals("y,x", chain.join());
	}


});