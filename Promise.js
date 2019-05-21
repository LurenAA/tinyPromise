
; (function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory()
	} else {
		window.TinyPromise = factory()
	}
})(function () {
	const pending = Symbol(),
		fulfilled = Symbol(),
		rejected = Symbol(),
		statusWords = Symbol.for('statusWords'),
		status = Symbol.for('status')

	function TinyPromise(handler) {
		if (!(this instanceof TinyPromise)) {
			return new TinyPromise(handler)
		}
		this[status] = TinyPromise[statusWords].pending
	}

	TinyPromise[statusWords] = {
		pending,
		fulfilled,
		rejected
	}
	
	return TinyPromise
})