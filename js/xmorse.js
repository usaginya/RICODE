/**
 * Copyright (c) 2017 hustcc
 * License: MIT
 * Version: %%GULP_INJECT_VERSION%%
 * GitHub: https://github.com/hustcc/xmorse
 * Modify: YIU
 **/
/* jshint expr: true */
!function (root, factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory(root); // nodejs support
		module.exports['default'] = module.exports; // es6 support
	} else
		root.xmorse = factory();
}
(typeof window !== 'undefined' ? window : this,
	function () {
	// Map of Morse code patterns to supported characters.
	var standard = {
		/* Letters                               */
		'A': '01', /* A                   */
		'B': '1000', /* B                   */
		'C': '1010', /* C                   */
		'D': '100', /* D                   */
		'E': '0', /* E                   */
		'F': '0010', /* F                   */
		'G': '110', /* G                   */
		'H': '0000', /* H                   */
		'I': '00', /* I                   */
		'J': '0111', /* J                   */
		'K': '101', /* K                   */
		'L': '0100', /* L                   */
		'M': '11', /* M                   */
		'N': '10', /* N                   */
		'O': '111', /* O                   */
		'P': '0110', /* P                   */
		'Q': '1101', /* Q                   */
		'R': '010', /* R                   */
		'S': '000', /* S                   */
		'T': '1', /* T                   */
		'U': '001', /* U                   */
		'V': '0001', /* V                   */
		'W': '011', /* W                   */
		'X': '1001', /* X                   */
		'Y': '1011', /* Y                   */
		'Z': '1100', /* Z                   */
		/* Numbers                               */
		'0': '11111', /* 0                   */
		'1': '01111', /* 1                   */
		'2': '00111', /* 2                   */
		'3': '00011', /* 3                   */
		'4': '00001', /* 4                   */
		'5': '00000', /* 5                   */
		'6': '10000', /* 6                   */
		'7': '11000', /* 7                   */
		'8': '11100', /* 8                   */
		'9': '11110', /* 9                   */
		/* Punctuation                           */
		'.': '010101', /* Full stop           */
		',': '110011', /* Comma               */
		'?': '001100', /* Question mark       */
		'\'': '011110', /* Apostrophe          */
		'!': '101011', /* Exclamation mark    */
		'/': '10010', /* Slash               */
		'(': '10110', /* Left parenthesis    */
		')': '101101', /* Right parenthesis   */
		'&': '01000', /* Ampersand           */
		':': '111000', /* Colon               */
		';': '101010', /* Semicolon           */
		'=': '10001', /* Equal sign          */
		'+': '01010', /* Plus sign           */
		'-': '100001', /* Hyphen1minus        */
		'_': '001101', /* Low line            */
		'"': '010010', /* Quotation mark      */
		'$': '0001001', /* Dollar sign         */
		'@': '011010', /* At sign             */
		/* Expand Letters                           */
		'a': '0011', /* a                   */
		'b': '0101', /* b                   */
		'c': '1110', /* c                   */
		'd': '1111', /* d                   */
		'e': '00010', /* e                   */
		'f': '00100', /* f                   */
		'g': '00101', /* g                   */
		'h': '00110', /* h                   */
		'i': '01001', /* i                   */
		'j': '01011', /* j                    */
		'k': '01100', /* k                   */
		'l': '01101', /* l                  */
		'm': '01110', /* m                */
		'n': '10011', /* n                  */
		'o': '10100', /* o                 */
		'p': '10101', /* p                  */
		'q': '10111', /* q                */
		'r': '11001', /* r                 */
		's': '11010', /* s                 */
		't': '11011', /* t                 */
		'u': '11101', /* u               */
		'v': '000000', /* v               */
		'w': '000001', /* w              */
		'x': '000010', /* x               */
		'y': '000011', /* y               */
		'z': '000100', /* z               */
	};
	// 计算反向的字典
	var standardReverse = {};
	for (var key in standard) {
		standardReverse[standard[key]] = key;
	}

	function defaultOption(option) {
		option = option || {};
		return [
			option.space || '/',
			option.short || '.',
			option.long || '-'
		];
	}

	function unicodeHexMorse(ch) {
		var r = [],
		t;
		for (var i = 0; i < ch.length; i++) {
			t = ch.charCodeAt(i).toString(2);

			//转换的字符不可以出现在码表内，否则解码时会出错
			while (!!standardReverse[t]) {
				t = '0' + t;
			}
			r[i] = t;
		}
		r = r.join(''); //导出二进制
		return r;
	}
	/**
	 * encode: encode string to morse code.
	 * - msg: strings need to be encode.
	 * - option: encode option.
	 *
	 * Return the morse code.
	 *
	 * Usage
	 * var option = {
	 *  space: ' ',
	 *  long: '-',
	 *  short: '*'
	 * };
	 * xmorse.encode('I love you.', option);
	 * Will get return with `** *-** --- ***- * -*-- --- **- *-*-*-`.
	 *
	 **/
	function encode(msg, option) {
		option = defaultOption(option); // 默认参数
		var morse = []; // 最终的 morse 结果

		msg = msg.split('');//分割为数组
		var ch,
		r;
		for (var i = 0, l = msg.length; i < l; i++) {
			ch = msg[i];
			r = standard[ch];
			if (!r)
				r = unicodeHexMorse(ch); // 找不到，说明是非标准的字符，使用 unicode。
			morse.push(r.replace(/0/g, option[1]).replace(/1/g, option[2]));
		}
		return morse.join(option[0]);
	}

	function morseHexUnicode(mor) {
		mor = parseInt(mor, 2); // 解析 2 进制数
		if (isNaN(mor))
			return ''; // 解析失败，直接返回空字符串跳过
		var mord = mor; // 保存10进制
		mor = mor.toString(16); //转16进制
		mor = '%u' + ('0000' + mor).substr(mor.length); //转为 unicode
		return unescape(mor); // unicode -> 字符
	}
	/**
	 * decode: encode string to morse code.
	 * - morse: morse code need to be decode.
	 * - option: encode option.
	 *
	 * Return the decode string.
	 *
	 * Usage
	 * var option = {
	 *  space: ' ',
	 *  long: '-',
	 *  short: '*'
	 * };
	 * xmorse.decode('** *-** --- ***- * -*-- --- **- *-*-*-', option);
	 * Will get return with `ILOVEYOU`.
	 *
	 **/
	function decode(morse, option) {
		option = defaultOption(option);
		var msg = [];
		morse = morse.split(option[0]); // 分割为数组
		var mor,
		r;
		for (var i = 0, l = morse.length; i < l; i++) {
			mor = morse[i].replace(/\s+/g, '') // 去除空格
				.replace(new RegExp('\\' + option[1], 'g'), '0')
				.replace(new RegExp('\\' + option[2], 'g'), '1'); // 转二进制;
			r = standardReverse[mor];
			if (!r)
				r = morseHexUnicode(mor); // 找不到，说明是非标准字符的 morse，使用 unicode 解析方式。
			msg.push(r);
		}
		return msg.join('');
	}
	return {
		encode: encode,
		decode: decode
	};
});
