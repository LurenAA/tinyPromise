
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
		handleList = Symbol('handleList'),
		resolutionProcedure = Symbol('resolutionProcedure') 
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

		if (typeof handler === 'function') {
			handler(this.resolve.bind(this), this.reject.bind(this))
		}
	}

	TinyPromise.prototype.resolve = function (resolveValue) {
		this[status] = TinyPromise[statusWords].fulfilled
		this[value] = resolveValue
		Object.defineProperties(this, {
			status: {
				writable: false
			},
			value: {
				writable: false
			}
		})
		//  2 When fulfilled, a promise: must not transition 
		// to any other state.must have a value, which must not change.

		if (typeof process !== 'undefined' && process.nextTick) {
			process.nextTick(() => {
				this[handleList]()
			})
		} else {
			setTimeout(() => {
				this[handleList]()
			}, 0)
		}
		// 3.1 with either a “macro-task” mechanism such as setTimeout or setImmediate, 
		// or with a “micro-task” mechanism such as MutationObserver or process.nextTick.
	}

	TinyPromise.prototype.reject = function (errorValue) {
		this[status] = TinyPromise[statusWords].rejected
		this[error] = errorValue
		Object.defineProperties(this, {
			status: {
				writable: false
			},
			value: {
				writable: false
			}
		})

		if (typeof process !== 'undefined' && process.nextTick) {
			process.nextTick(() => {
				this[handleList]()
			})
		} else {
			setTimeout(() => {
				this[handleList]()
			}, 0)
		}
	}

	TinyPromise.prototype.catch = function (reject) {
		return this.then(undefined, reject)
	}

	TinyPromise.prototype.then = function (resolveHandler, rejectHandler) {
		let next = new TinyPromise()

		this[onFulfilledList].push({func: resolveHandler, next})

		this[onRejectedList].push({func: rejectHandler, next})

		return next
	}

	TinyPromise.prototype[handleList] = function () {
		if (!this[onFulfilledList].length || !this[onRejectedList].length) {
			return this
		}

		const statusKey = this[status] === TinyPromise[statusWords].fulfilled
		let list = statusKey ?
			this[onFulfilledList] :
			this[onRejectedList],
			firstArg = statusKey ?
				this[value] :
				this[error],
			fn,
			x

		while (fn = list.shift()) {
			if(typeof fn.func === 'function') {
				try {
					x = fn.func(firstArg)
					x && this[resolutionProcedure](x, fn.next)
				} catch (err) {
					fn.next.reject(err)
				}
			} else {
				if(statusKey) 
					fn.next.resolve(firstArg)
				else 
					fn.next.reject(firstArg)
			}
		}
	}

	TinyPromise.prototype[resolutionProcedure] = function (x, next) {
		if(x === next) {
			next.reject(new TypeError("2.3.1 error"))
		}
		else if(x instanceof TinyPromise) {
			switch (x[status]) {
				case TinyPromise[statusWords].fulfilled: 
					next.resolve(x[value])
					break
				case TinyPromise[statusWords].rejected: 
					next.reject(x[error])
					break;
				case TinyPromise[statusWords].pending:
					x.then(next.resolve.bind(next), next.reject.bind(next))
					break;
				default: 
					next.reject(new Error("next has a undefined [value]"))
			} 
		} else if (typeof x === 'object' || typeof x === 'function') {
			throw new Error("暂时没有写2.3.3规范中的要求")
		}
		else {
			next.resolve(x)
		}
	}

	TinyPromise[statusWords] = {
		pending: Symbol(),
		fulfilled: Symbol(),
		rejected: Symbol()
	}

	return TinyPromise
})