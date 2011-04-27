/*
 * Test cases for Hub.aborted.
 */
TestCase("AbortedTest", {
	
	tearDown: function() {
		Hub.reset();
	},
	
	"test function exists": function() {
		assertFunction(Hub.aborted);
	},
	
	"test aborted returns false by default": function() {
		assertFalse(Hub.aborted());
	},
	
	"test aborted returns true after stopPropagation": function() {
		Hub.subscribe("a/b", function() {
			Hub.stopPropagation();
		});
		Hub.publish("a/b");
		assert(Hub.aborted());
	}

});