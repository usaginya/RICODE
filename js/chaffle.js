/*!
 * Chaffle
 * Shuffle Randomly Character.
 * http://blivesta.github.io/chaffle
 * License : MIT
 * Author : blivesta (http://blivesta.com/)
 * Modify : YIU
 */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Chaffle = factory();
	}
})(this, function () {
	'use strict'

	function extend() {
		var extended = {};
		var deep = false;

		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}

		function merge(obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		}

		for (var i = 0; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	}

	function Chaffle(element, options, callback) {
		var data = {};
		var dataLang = element.getAttribute('data-chaffle');
		var dataSpeed = element.getAttribute('data-chaffle-speed');
		var dataDelay = element.getAttribute('data-chaffle-delay');
		var dataMaxLength = element.getAttribute('data-chaffle-maxlength');

		if (dataLang && dataLang.length !== 0)
			data.lang = dataLang;
		if (dataSpeed !== null)
			data.speed = Number(dataSpeed);
		if (dataDelay !== null)
			data.delay = Number(dataDelay);
		if (dataMaxLength !== null)
			data.maxlength = Number(dataMaxLength);

		this.element = element;
		this.text = this.element.textContent;
		this.textValueMode = !this.text && this.text.length < 1;
		if (options.intext && options.intext.length > 0) {
			this.text = options.intext
		} else {
			this.text = this.textValueMode ? this.element.value : this.text;
		}

		this.substitution = '';
		this.state = false;
		this.shuffleProps = [];
		this.reinstateProps = [];

		this.options = {
			lang: 'en',
			speed: 20,
			delay: 100,
			maxlength: this.text.length
		};

		this.options = extend(this.options, options, data);

		this.callback = callback;
	}

	Chaffle.prototype = {
		constructor: Chaffle,
		init: function () {
			var self = this;

			if (self.state)
				return;

			self.clearShuffleTimer();
			self.clearReinstateTimer();

			self.state = true;
			self.substitution = '';
			self.shuffleProps = [];
			self.reinstateProps = [];

			var shuffleTimer = setInterval(function () {
					self.shuffle();
				}, self.options.speed);

			var reinstateTimer = setInterval(function () {
					self.reinstate();
				}, self.options.delay);

			self.shuffleProps = shuffleTimer;
			self.reinstateProps = reinstateTimer;
		},

		shuffle: function () {
			if (this.textValueMode)
				this.element.value = this.substitution;
			else
				this.element.textContent = this.substitution;

			var textLength = this.text.length;
			var substitutionLength = this.substitution.length;

			if ((textLength - substitutionLength) > 0) {
				if (this.textValueMode) {
					for (var i = 0; i <= textLength - substitutionLength; i++) {
						this.element.value = this.element.value + this.randomStr();
					}
				} else {
					for (var i = 0; i <= textLength - substitutionLength; i++) {
						this.element.textContent = this.element.textContent + this.randomStr();
					}
				}
			} else {
				this.clearShuffleTimer();
			}
		},

		reinstate: function () {
			var textLength = this.text.length;
			var substitutionLength = this.substitution.length;

			if (substitutionLength < textLength) {
				if (substitutionLength >= this.options.maxlength) {
					if (this.textValueMode) {
						this.element.value = this.text;
					} else {
						this.element.textContent = this.text;
					}
					this.clearShuffleTimer();
					this.clearReinstateTimer();
					if (this.callback)
						this.callback();

				} else if (this.textValueMode) {
					this.element.value = this.substitution = this.text.substr(0, substitutionLength + 1);

				} else {
					this.element.textContent = this.substitution = this.text.substr(0, substitutionLength + 1);
				}

			} else {
				this.clearReinstateTimer();
				if (this.callback)
					this.callback();
			}

			this.state = false;
		},

		clearShuffleTimer: function () {
			return clearInterval(this.shuffleProps);
		},

		clearReinstateTimer: function () {
			return clearInterval(this.reinstateProps);
		},

		randomStr: function () {
			var str;
			switch (this.options.lang) {
			case 'sym':
				var symRange = [[33, 14], [58, 6], [91, 5], [123, 3]];
				str = symRange[Math.round(Math.random() * 3)];
				str = String.fromCharCode(str[0] + Math.round(Math.random() * str[1]));
				break;

			case 'en':
				str = String.fromCharCode(48 + Math.round(Math.random() * 74));
				break;

			case 'zh':
				str = String.fromCharCode(19968 + Math.round(Math.random() * 80));
				break;

			case 'ja-hiragana':
				str = String.fromCharCode(12352 + Math.round(Math.random() * 50));
				break;

			case 'ja-katakana':
				str = String.fromCharCode(12448 + Math.round(Math.random() * 84));
				break;

			case 'ua':
				str = String.fromCharCode(1040 + Math.round(Math.random() * 55));
				break;

			default:
				str = String.fromCharCode(48 + Math.round(Math.random() * 74));
				break;
			}
			return str;
		},
	}

	return Chaffle;
})
