//This will not scale horizontally, we clearly need a shared cache or storage of any type.

module.exports = (function() {
	var cache = {};
	return {
		get: function(key) {
			return cache[key];
		},
		set: function(key, val) {
			cache[key] = val;
		},
		keys: function() {
			return Object.keys(cache);
		}
	};
})();
