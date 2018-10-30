'use strict'
const _ = require('lodash');
const assert = require('assert');
const bn = require('../src/index');

describe('bn-str-256', function() {
	it ('can parse a positive integer', function() {
		assert.equal(bn.expand(41258), '41258');
	});

	it ('can parse a negative integer', function() {
		assert.equal(bn.expand(-41258), '-41258');
	});

	it ('can parse a positive decimal', function() {
		assert.equal(bn.expand(41258.3145831), '41258.3145831');
	});

	it ('can parse a negative decimal', function() {
		assert.equal(bn.expand(-41258.3145831), '-41258.3145831');
	});

	it ('can parse an exponential', function() {
		assert.equal(bn.expand(1.44e3), '1440');
	});

	it ('can parse a positive integer string', function() {
		assert.equal(bn.expand('41258'), '41258');
	});

	it ('can parse a negative integer string', function() {
		assert.equal(bn.expand('-41258'), '-41258');
	});

	it ('can parse a positive decimal string', function() {
		assert.equal(bn.expand('41258.3145831'), '41258.3145831');
	});

	it ('can parse a negative decimal string', function() {
		assert.equal(bn.expand('-41258.3145831'), '-41258.3145831');
	});

	it ('can parse an exponential string', function() {
		assert.equal(bn.expand('1.44e3'), '1440');
	});

	it ('can parse a very large integer', function() {
		// 2^256
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639936';
		assert.equal(bn.expand(big), big);
	});

	it ('can parse a very large negative integer', function() {
		// -(2^256)
		const big = '-115792089237316195423570985008687907853269984665640564039457584007913129639936';
		assert.equal(bn.expand(big), big);
	});

	it ('can parse a hexadecimal', function() {
		assert.equal(bn.expand('0x8d75f7'), '9270775');
	});

	it ('can parse a big hexadecimal', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const hex = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
		assert.equal(bn.expand(hex), big);
	});

	it ('can parse a big octal', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const octal = '017777777777777777777777777777777777777777777777777777777777777777777777777777777777777';
		assert.equal(bn.expand(octal), big);
	});

	it ('can parse a big binary', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const bin = '0b1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
		assert.equal(bn.expand(bin), big);
	});

	it ('can parse a small hexadecimal', function() {
		assert.equal(bn.expand('0x412'), '1042');
	});

	it ('can parse a small binary', function() {
		assert.equal(bn.expand('0b1010000101'), '645');
	});

	it ('can parse a small octal', function() {
		assert.equal(bn.expand('0461465'), '156469');
	});

	it ('can parse an empty hexadecimal', function() {
		assert.equal(bn.expand('0x'), '0');
	});

	it ('can parse an empty binary', function() {
		assert.equal(bn.expand('0b'), '0');
	});

	it ('can parse 0', function() {
		assert.equal(bn.expand('0'), '0');
	});

	it ('can parse -0', function() {
		assert.equal(bn.expand('-0'), '0');
	});

	it ('can parse a buffer object', function() {
		const hex = '0fdda197b73dd343fae38fa1';
		const buf = Buffer.from(hex, 'hex');
		assert.equal(bn.expand(buf), '4910210853121048192949129121');
	});

	it ('can encode a big hexadecimal', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const hex = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
		assert.equal(bn.toHex(big), hex);
	});

	it ('can encode a big binary', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const bin = '0b1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
		assert.equal(bn.toBinary(big), bin);
	});

	it ('can encode a big octal', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const octal = '017777777777777777777777777777777777777777777777777777777777777777777777777777777777777';
		assert.equal(bn.toOctal(big), octal);
	});

	it ('can encode a big octal', function() {
		// 2^256-1
		const big = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const octal = '017777777777777777777777777777777777777777777777777777777777777777777777777777777777777';
		assert.equal(bn.toOctal(big), octal);
	});

	it ('can encode a hexadecimal with clamped length', function() {
		const n = '4910210853121048192949129121';
		const hex = '0x38fa1';
		assert.equal(bn.toHex(n, 5), hex);
	});

	it ('can encode an octal with clamped length', function() {
		const n = '4910210853121048192949129121';
		const octal = '007641';
		assert.equal(bn.toOctal(n, 5), octal);
	});

	it ('can encode a binary with clamped length', function() {
		const n = '4910210853121048192949129121';
		const bin = '0b00001';
		assert.equal(bn.toBinary(n, 5), bin);
	});

	it ('can encode a hexadecimal with padded length', function() {
		const n = '3121048';
		const hex = '0x00002f9f98';
		assert.equal(bn.toHex(n, 10), hex);
	});

	it ('can encode an octal with padded length', function() {
		const n = '3121048';
		const octal = '0000013717630';
		assert.equal(bn.toOctal(n, 12), octal);
	});

	it ('can encode a binary with padded length', function() {
		const n = '3121048';
		const bin = '0b00001011111001111110011000';
		assert.equal(bn.toBinary(n, 26), bin);
	});

	it ('can convert to a Buffer object', function() {
		const n = '4910210853121048192949129121';
		const hex = '0fdda197b73dd343fae38fa1';
		assert.equal(bn.toBuffer(n).toString('hex'), hex);
	});

	it ('can compute an irrational number', function() {
		assert.equal(bn.pow(2, 0.5), '1.414213562373095048801688724209698078569671875376948073176679737990732478462107');
	});

	it ('can count significant digits', function() {
		const n = '345.1312';
		assert.equal(bn.sd(n), 7);
	});

	it ('can count decimal places', function() {
		const n = '345.1312';
		assert.equal(bn.dp(n), 4);
	});

	it ('can set significant digits', function() {
		const n = '345.1312';
		assert.equal(bn.sd(n, 4), '345.1');
	});

	it ('can set decimal places', function() {
		const n = '345.1312';
		assert.equal(bn.dp(n, 2), '345.13');
	});

	it ('can convert to native Number', function() {
		const n = '345.1312';
		assert.equal(bn.toNumber(n), 345.1312);
	});

	it ('can split a number into parts', function() {
		const n = '-345.1312';
		const parts = bn.split(n);
		assert.equal(parts.sign, '-');
		assert.equal(parts.integer, '345');
		assert.equal(parts.decimal, '1312');
	});

	it ('can get the sign of numbers', function() {
		assert.equal(bn.sign('-413.41'), -1);
		assert.equal(bn.sign('413.41'), 1);
	});

	it ('can compare numbers', function() {
		assert.equal(bn.cmp('-413.41', '-413.41001'), 1);
		assert.equal(bn.cmp('-413.41', '413.41001'), -1);
		assert.equal(bn.cmp('-413.41', '-413.41'), 0);
		assert.equal(bn.cmp('0', '13141'), -1);
		assert.equal(bn.cmp('0', '0'), 0);
	});

	it ('can add two numbers', function() {
		assert.equal(
			bn.add('304995912158948192180120121', '9409019585412120501214'),
			'305005321178533604300621335');
	});

	it ('can subtract two numbers', function() {
		assert.equal(
			bn.sub('304995912158948192180120121', '9409019585412120501214'),
			'304986503139362780059618907');
	});

	it ('can multiply two numbers', function() {
		assert.equal(
			bn.mul('304995912158948192180120121', '9409019585412120501214'),
			'2869712510974178241410260911937900084633246326894');
	});

	it ('can divide two numbers', function() {
		assert.equal(
			bn.div('304995912158948192180120121', '9409019585412120501214'),
			'32415.270197951149740236538807583548219780021448800472459819699572958121538007362');
	});

	it ('can divide two numbers into an integer', function() {
		assert.equal(
			bn.idiv('304995912158948192180120121', '9409019585412120501214'),
			'32415');
	});

	it ('can raise to a positive integer power', function() {
		assert.equal(
			bn.pow('-41', '42'),
			'54565982855941191947249368879497196495421462536627690767330656099281');
	});

	it ('can raise to a negative integer power', function() {
		assert.equal(bn.pow('-41', '-2'),
			'0.00059488399762046400951814396192742415229030339083878643664485425342058298631766805');
	});

	it ('can raise to a negative decimal power', function() {
		assert.equal(bn.pow('41', '-2.5'),
			'0.00009290527179572044350035863778270502843139855969328679046341858978639576846239718');
	});

	it ('raising a negative number to a fraction throws', function() {
		assert.throws(() => bn.pow('-4', '0.3'));
	});

	it ('positive times negative is negative', function() {
		assert.equal(
			bn.mul('304995912158948192180120121', '-9409019585412120501214'),
			'-2869712510974178241410260911937900084633246326894');
	});

	it ('negative times negative is positive', function() {
		assert.equal(
			bn.mul('-304995912158948192180120121', '-9409019585412120501214'),
			'2869712510974178241410260911937900084633246326894');
	});

	it ('positive divided by negative is negative', function() {
		assert.equal(
			bn.div('304995912158948192180120121', '-9409019585412120501214'),
			'-32415.270197951149740236538807583548219780021448800472459819699572958121538007362');
	});

	it ('negative divided by negative is positive', function() {
		assert.equal(
			bn.div('-304995912158948192180120121', '-9409019585412120501214'),
			'32415.270197951149740236538807583548219780021448800472459819699572958121538007362');
	});

	it ('anything divided by zero throws', function() {
		assert.throws(() =>
			bn.div('-304995912158948192180120121', '0'));
	});

	it ('can modulo two numbers', function() {
		assert.equal(
			bn.mod('304995912158948192180120121', '9409019585412120501214'),
			'2542297814306133268311');
	});

	it ('modulo of two negative numbers is negative', function() {
		assert.equal(
			bn.mod('-304995912158948192180120121', '-9409019585412120501214'),
			'-2542297814306133268311');
	});

	it ('modulo of a positive and negative is positive', function() {
		assert.equal(
			bn.mod('304995912158948192180120121', '-9409019585412120501214'),
			'2542297814306133268311');
	});

	it ('modulo of a negative and positive is negative', function() {
		assert.equal(
			bn.mod('-304995912158948192180120121', '9409019585412120501214'),
			'-2542297814306133268311');
	});

	it ('can modulo with decimals', function() {
		assert.equal(bn.mod('49129014.4121', '88541.3121'), '77127.5087');
	});

	it ('can negate numbers', function() {
		assert.equal(bn.neg(59312), '-59312');
		assert.equal(bn.neg(-59312), '59312');
		assert.equal(bn.neg('-59312.3144'), '59312.3144');
	});

	it ('can take the absolute value of numbers', function() {
		assert.equal(bn.abs(59312), '59312');
		assert.equal(bn.abs(-59312), '59312');
		assert.equal(bn.abs('-59312.3144'), '59312.3144');
	});

	it ('can take the integer of numbers', function() {
		assert.equal(bn.int(59312), '59312');
		assert.equal(bn.int(-59312), '-59312');
		assert.equal(bn.int('-59312.3144'), '-59312');
		assert.equal(bn.int('59312.3144'), '59312');
	});

	it ('can round numbers', function() {
		assert.equal(bn.round(59312), '59312');
		assert.equal(bn.round(-59312), '-59312');
		assert.equal(bn.round('-59312.3144'), '-59312');
		assert.equal(bn.round('-59312.6144'), '-59313');
		assert.equal(bn.round('59312.6144'), '59313');
		assert.equal(bn.round('59312.4144'), '59312');
	});

	it ('can check for equality', function() {
		assert.equal(bn.eq('491', '491'), true);
		assert.equal(bn.eq('491.31541312', '491.31541312'), true);
		assert.equal(bn.eq('-491.31541312', '-491.31541312'), true);
		assert.equal(bn.eq('491.31541312', '-491.31541312'), false);
		assert.equal(bn.eq('491', '0x'+(491).toString(16)), true);
	});

	it ('can check for inequality', function() {
		assert.equal(bn.ne('491', '491'), false);
		assert.equal(bn.ne('491.31541312', '491.31541312'), false);
		assert.equal(bn.ne('-491.31541312', '-491.31541312'), false);
		assert.equal(bn.ne('491.31541312', '-491.31541312'), true);
		assert.equal(bn.ne('491', '0x'+(491).toString(16)), false);
	});

	it ('can check for greater than', function() {
		assert.equal(bn.gt('491', '491'), false);
		assert.equal(bn.gt('491.001', '491'), true);
		assert.equal(bn.gt('491.001', '0x'+(491).toString(16)), true);
		assert.equal(bn.gt('-491.001', '-491'), false);
	});

	it ('can check for less than', function() {
		assert.equal(bn.lt('491', '491'), false);
		assert.equal(bn.lt('491.001', '491'), false);
		assert.equal(bn.lt('491.001', '0x'+(491).toString(16)), false);
		assert.equal(bn.lt('-491.001', '-491'), true);
	});

	it ('can check for greater than or equal', function() {
		assert.equal(bn.gte('491', '491'), true);
		assert.equal(bn.gte('491.001', '491'), true);
		assert.equal(bn.gte('491.001', '0x'+(491).toString(16)), true);
		assert.equal(bn.gte('-491.001', '-491'), false);
	});

	it ('can check for less than or equal', function() {
		assert.equal(bn.lte('491', '491'), true);
		assert.equal(bn.lte('491.001', '491'), false);
		assert.equal(bn.lte('491.001', '0x'+(491).toString(16)), false);
		assert.equal(bn.lte('-491.001', '-491'), true);
	});

	it ('can take the minimum of two numbers', function() {
		assert.equal(bn.min('491', '491.41'), '491');
		assert.equal(bn.min('-491.001', '-491.1'), '-491.1');
	});

	it ('can take the maximum of two numbers', function() {
		assert.equal(bn.max('491', '491.41'), '491.41');
		assert.equal(bn.max('-491.001', '-491.1'), '-491.001');
	});
});
