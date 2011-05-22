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
 * Test cases for hub.topicComparator.
 */
TestCase("TopicComparatorTest", {
	
	"test method exists": function () {
		assertFunction(hub.topicComparator);
	},
	
	"test equal": function () {
		assertEquals(0, hub.topicComparator("foo", "bar"));
	},
	
	"test wildcard message": function () {
		assertEquals(-1, hub.topicComparator("foo/*", "foo/bar"));
		assertEquals(1, hub.topicComparator("foo/bar", "foo/*"));
	},

	"test wildcard namespace": function () {
		assertEquals(-1, hub.topicComparator("*/bar", "foo/bar"));
		assertEquals(1, hub.topicComparator("foo/bar", "*/bar"));
	},

	"test namespace before message": function () {
		assertEquals(-1, hub.topicComparator("*/foo", "foo/*"));
		assertEquals(1, hub.topicComparator("foo/*", "*/foo"));
	}
	
});