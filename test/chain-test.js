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
 * Test cases for Hub.chain.
 */
TestCase("ChainCreateTest", {
	
	"test should create empty chain": function () {
		var chain = Hub.chain();

		assertFunction(chain.add);
		assertFunction(chain.insert);
	}
	
});

TestCase("ChainCallTest", {
		
	"test call should invoke provided functions": function () {
		var calls = [];
		var f1 = function () {
			calls.push("f1");
		};
		var f2 = function () {
			calls.push("f2");
		};
		Hub.chain(f1, f2)();
		assertEquals("Called in argument order", "f1,f2", calls.join());
	},
	
	"test should stop after Hub.stopPropagation": function () {
		var f = stubFn();
		Hub.chain(function () {
			Hub.stopPropagation();
		}, f)();
		assertFalse(f.called);
	}
	
});

TestCase("ChainRemoveTest", {
	
	"test remove first of two": function () {
		var f1 = stubFn();
		var f2 = stubFn();
		var chain = Hub.chain(f1, f2);
		chain.remove(f1);
		chain();
		assertFalse(f1.called);
		assert(f2.called);
	},
	
	"test remove second of two": function () {
		var f1 = stubFn();
		var f2 = stubFn();
		var chain = Hub.chain(f1, f2);
		chain.remove(f2);
		chain();
		assert(f1.called);
		assertFalse(f2.called);
	},
	
	"test remove first of three": function () {
		var f1 = stubFn();
		var f2 = stubFn();
		var f3 = stubFn();
		var chain = Hub.chain(f1, f2, f3);
		chain.remove(f1);
		chain();
		assertFalse(f1.called);
		assert(f2.called);
		assert(f3.called);
	},
	
	"test remove second of three": function () {
		var f1 = stubFn();
		var f2 = stubFn();
		var f3 = stubFn();
		var chain = Hub.chain(f1, f2, f3);
		chain.remove(f2);
		chain();
		assert(f1.called);
		assertFalse(f2.called);
		assert(f3.called);
	},
	
	"test remove third of three": function () {
		var f1 = stubFn();
		var f2 = stubFn();
		var f3 = stubFn();
		var chain = Hub.chain(f1, f2, f3);
		chain.remove(f3);
		chain();
		assert(f1.called);
		assert(f2.called);
		assertFalse(f3.called);
	}

});

TestCase("ChainConcurrencyTest", {
	
	"test should allow add during invocation": function () {
		var calls = 0;
		var sf = stubFn();
		var chain = Hub.chain();
		chain.add(function () {
			calls++;
			chain.add(sf);
		});
		chain();
		assertEquals(1, calls);
		assertFalse(sf.called);
	}

});

TestCase("ChainScopeTest", {
	
	"test should retain scope": function () {
		var fn = stubFn();
		var chain = Hub.chain();
		chain.add(fn);
		var object = {};
		chain.call(object);
		assertSame(object, fn.scope);
	}
	
});

TestCase("ChainNestingTest", {
	
	"test should invoke nested chain": function () {
		var f = stubFn();
		var ca = Hub.chain(f);
		var cb = Hub.chain(ca);
		cb();
		assert(f.called);
	},
	
	"test should abort parent": function () {
		var ca = Hub.chain(function () {
			Hub.stopPropagation();
		});
		var f = stubFn();
		var cb = Hub.chain(ca, f);
		cb();
		assertFalse(f.called);
	},
	
	"test should propagate to parent": function () {
		var f = stubFn();
		var ca = Hub.chain(function () {
			Hub.propagate();
			assert(f.called);
		});
		var cb = Hub.chain(ca, f);
		cb();
	},
	
	"test should merge results": function () {
		var c1 = Hub.chain(function () {
			return [1];
		});
		var c2 = Hub.chain(function () {
			return [2];
		});
		assertEquals([1, 2], Hub.chain(c1, c2)());
	},
	
	"test should pass arguments through": function () {
		var args = [];
		var c1 = Hub.chain(function (a) {
			args.push(a);
		});
		var c2 = Hub.chain(function (a) {
			args.push(a);
		});
		Hub.chain(c1, c2)("x");
		assertEquals(["x", "x"], args);
	}
	
});
