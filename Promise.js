
; (function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory)
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory()
	} else {
		window.TinyPromise = factory()
	}
})(function () {
	const statusWords = Symbol('statusWords'),
		status = Symbol('status'),
		value = Symbol('value'),
		error = Symbol('error'),
		onFulfilledList = Symbol('onFulfilled'),
		onRejectedList = Symbol('onRejected'),
		reject = Symbol('reject'),
		resolve = Symbol('resolve')
	//声明私有变量名称

	function TinyPromise(handler) {
		if (!(this instanceof TinyPromise)) {
			return new TinyPromise(handler)
		}
		this[status] = TinyPromise[statusWords].pending
		this[value] = undefined
		this[error] = undefined
		this[onFulfilledList] = []
		this[onRejectedList] = []
	}

	TinyPromise.prototype[resolve] = function(value) {

	}

	TinyPromise.prototype[reject] = function(error) {

	}

	TinyPromise[statusWords] = {
		pending: Symbol(),
		fulfilled: Symbol(),
		rejected: Symbol()
	}

	return TinyPromise
})