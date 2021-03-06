'use strict'
const _ = require('lodash');
const assert = require('assert');
const bn = require('../src/index');

describe('bn-str-256', function() {
	it ('throws parsing NaN', function() {
		assert.throws(() => bn.expand(NaN));
	});

	it ('throws parsing a non-number string', function() {
		assert.throws(() => bn.expand('foo'));
	});

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

	it ('can parse a boolean', function() {
		assert.equal(bn.expand(true), 1);
		assert.equal(bn.expand(false), 0);
	});

	it ('can parse a very large integer', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		assert.equal(bn.expand(big), big);
	});

	it ('can parse a very large negative integer', function() {
		const big = '-215792049237316361234570985008687907853269984665640564039457584007913129639935';
		assert.equal(bn.expand(big), big);
	});

	it ('can parse a hexadecimal', function() {
		assert.equal(bn.expand('0x8d75f7'), '9270775');
	});

	it ('can parse a big hexadecimal', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const hex = '0x1dd15f8bb014588cfb22bfa30d4741c6488961feb661730d2bdffffffffffffff';
		assert.equal(bn.expand(hex), big);
	});

	it ('can parse a big octal', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const octal = '035642576135401213043175442577214152164070622104541775331413460645367777777777777777777';
		assert.equal(bn.expand(octal), big);
	});

	it ('can parse a big binary', function() {
		// 2^256-1
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const bin = '0b11101110100010101111110001011101100000001010001011000100011001111101100100010101111111010001100001101010001110100000111000110010010001000100101100001111111101011011001100001011100110000110100101011110111111111111111111111111111111111111111111111111111111111';
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

	it ('can parse a bit array', function() {
		const bits = '010111010110100111'.split('').map(ch => parseInt(ch));
		assert.equal(bn.fromBits(bits), '95655');
	});

	it ('can encode a big hexadecimal', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const hex = '0x1dd15f8bb014588cfb22bfa30d4741c6488961feb661730d2bdffffffffffffff';
		assert.equal(bn.toHex(big), hex);
	});

	it ('can encode a big binary', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const bin = '0b11101110100010101111110001011101100000001010001011000100011001111101100100010101111111010001100001101010001110100000111000110010010001000100101100001111111101011011001100001011100110000110100101011110111111111111111111111111111111111111111111111111111111111';
		assert.equal(bn.toBinary(big), bin);
	});

	it ('can encode a big octal', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const octal = '035642576135401213043175442577214152164070622104541775331413460645367777777777777777777';
		assert.equal(bn.toOctal(big), octal);
	});

	it ('can encode a big bit array', function() {
		const big = '215792049237316361234570985008687907853269984665640564039457584007913129639935';
		const bits = _.map('11101110100010101111110001011101100000001010001011000100011001111101100100010101111111010001100001101010001110100000111000110010010001000100101100001111111101011011001100001011100110000110100101011110111111111111111111111111111111111111111111111111111111111'.split(''), ch => parseInt(ch));
		assert.deepEqual(bn.toBits(big), bits);
	});

	it ('can encode a hexadecimal with truncated length', function() {
		const n = '0x123456781abcdef';
		const hex = '0xbcdef';
		assert.equal(bn.toHex(n, 5), hex);
	});

	it ('can encode a hexadecimal with negative truncated length', function() {
		const n = '0x123456781abcdef';
		const hex = '0x12345';
		assert.equal(bn.toHex(n, -5), hex);
	});

	it ('can encode an octal with truncated length', function() {
		const n = '0441577321746712635410';
		const octal = '035410';
		assert.equal(bn.toOctal(n, 5), octal);
	});

	it ('can encode an octal with negative truncated length', function() {
		const n = '0441577321746712635410';
		const octal = '044157';
		assert.equal(bn.toOctal(n, -5), octal);
	});

	it ('can encode a binary with truncated length', function() {
		const n = '0b1010101111110101100111101101101000101110';
		const bin = '0b01110';
		assert.equal(bn.toBinary(n, 5), bin);
	});

	it ('can encode a binary with negative truncated length', function() {
		const n = '0b1010101111110101100111101101101000101110';
		const bin = '0b10101';
		assert.equal(bn.toBinary(n, -5), bin);
	});

	it ('can encode a bit array with truncated length', function() {
		const n = '0b1010101111110101100111101101101000101110';
		const bin = '0101110';
		assert.deepEqual(bn.toBits(n, 7).join(''), bin);
	});

	it ('can encode a bit array with negative truncated length', function() {
		const n = '0b1010101111110101100111101101101000101110';
		const bin = '1010101';
		assert.deepEqual(bn.toBits(n, -7).join(''), bin);
	});

	it ('can encode a hexadecimal with padded length', function() {
		const n = '0x12345';
		const hex = '0x0000012345';
		assert.equal(bn.toHex(n, 10), hex);
	});

	it ('can encode a hexadecimal with negative padded length', function() {
		const n = '0x12345';
		const hex = '0x1234500000';
		assert.equal(bn.toHex(n, -10), hex);
	});

	it ('can encode an octal with padded length', function() {
		const n = '034415';
		const octal = '00000034415';
		assert.equal(bn.toOctal(n, 10), octal);
	});

	it ('can encode an octal with negative padded length', function() {
		const n = '034415';
		const octal = '03441500000';
		assert.equal(bn.toOctal(n, -10), octal);
	});

	it ('can encode a binary with padded length', function() {
		const n = '0b11010';
		const bin = '0b0000011010';
		assert.equal(bn.toBinary(n, 10), bin);
	});

	it ('can encode a binary with negative padded length', function() {
		const n = '0b11010';
		const bin = '0b1101000000';
		assert.equal(bn.toBinary(n, -10), bin);
	});

	it ('can encode a bit array with padded length', function() {
		const n = '0b101011101011111010';
		const bin = '00000101011101011111010';
		assert.equal(bn.toBits(n, 23).join(''), bin);
	});

	it ('can encode a bit array with negative padded length', function() {
		const n = '0b101011101011111010';
		const bin = '10101110101111101000000'
		assert.equal(bn.toBits(n, -23).join(''), bin);
	});

	it ('can convert to a Buffer object', function() {
		const n = '0x123456781abcdef';
		const hex = '0123456781abcdef';
		assert.equal(bn.toBuffer(n).toString('hex'), hex);
	});

	it ('can convert to a Buffer object with truncated length', function() {
		const n = '0x123456781abcdef';
		const hex = 'abcdef';
		assert.equal(bn.toBuffer(n, 3).toString('hex'), hex);
	});

	it ('can convert to a Buffer object with negative truncated length', function() {
		const n = '0x123456781abcdef';
		const hex = '123456';
		assert.equal(bn.toBuffer(n, -3).toString('hex'), hex);
	});

	it ('can convert to a Buffer object with padded length', function() {
		const n = '0x12345';
		const hex = '00012345';
		assert.equal(bn.toBuffer(n, 4).toString('hex'), hex);
	});

	it ('can convert to a Buffer object with negative padded length', function() {
		const n = '0x12345';
		const hex = '12345000';
		assert.equal(bn.toBuffer(n, -4).toString('hex'), hex);
	});

	it ('can compute an irrational number', function() {
		assert.equal(bn.pow(2, 0.5),
			'1.41421356237309504880168872420969807856967187537694807317667973799073247846210703885038753432764157273501384623091229702');
	});

	it ('can raise e to a power', function() {
		assert.equal(bn.exp(3.75),
			'42.5210820000627830555181726216038582235768666095557850421732128836972416130789500212682328384759442088202891014091151498');
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
			'32415.2701979511497402365388075835482197800214488004724598196995729581215380073626652063640217827097211425745858858951443');
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
			'0.000594883997620464009518143961927424152290303390838786436644854253420582986317668054729327781082688875669244497323022010707');
	});

	it ('can raise to a negative decimal power', function() {
		assert.equal(bn.pow('41', '-2.5'),
			'0.0000929052717957204435003586377827050284313985596932867904634185897863957684623971804571807475551699766859275377969529923138');
	});

	it ('raising a negative number to a fraction throws', function() {
		assert.throws(() => bn.pow('-4', '0.3'));
	});

	it ('positive times negative is negative', function() {
		assert.equal(
			bn.sign(bn.mul('304995912158948192180120121', '-9409019585412120501214')),
			-1);
	});

	it ('negative times negative is positive', function() {
		assert.equal(
			bn.sign(bn.mul('-304995912158948192180120121', '-9409019585412120501214')),
			1);
	});

	it ('positive divided by negative is negative', function() {
		assert.equal(
			bn.sign(bn.div('304995912158948192180120121', '-9409019585412120501214')),
			-1);
	});

	it ('negative divided by negative is positive', function() {
		assert.equal(
			bn.sign(bn.div('-304995912158948192180120121', '-9409019585412120501214')),
			1);
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
			bn.sign(bn.mod('-304995912158948192180120121', '-9409019585412120501214')),
			-1);
	});

	it ('modulo of a positive and negative is positive', function() {
		assert.equal(
			bn.sign(bn.mod('304995912158948192180120121', '-9409019585412120501214')),
			1);
	});

	it ('modulo of a negative and positive is negative', function() {
		assert.equal(
			bn.sign(bn.mod('-304995912158948192180120121', '9409019585412120501214')),
			-1);
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
		assert.equal(bn.int('-59312.8144'), '-59312');
		assert.equal(bn.int('59312.8144'), '59312');
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

	it ('can clamp numbers', function() {
		assert.equal(bn.clamp('32', '491', '491.41'), '491');
		assert.equal(bn.clamp('3200', '491', '491.41'), '491.41');
		assert.equal(bn.clamp('0', '8', '7'), '7');
		assert.equal(bn.clamp('-491.05', '-491.001', '-491.1'), '-491.05');
	});

	it ('can compute the log of numbers', function() {
		assert.equal(bn.log('5931.31452'), '8.68800114027589093759605228837063607042010476203796155932874146193280219543959316152195324191872776670258525122741804881');
		assert.equal(bn.log('5931.31452', 10), '3.77315095399097916014517147967723803314060781854651114825038849886671836014259950230092683633917626930430334829979937173');
		assert.equal(bn.log('256', 2), '8');
		assert.equal(bn.log('256', 2.5), '6.05176637892824023545684288768378697593552088470408250238860074483851198485707263637033211363705848388736471019217409844');
	});

	it ('can convert to integer', function() {
		assert.equal(bn.int('1234.5678'), '1234');
		assert.equal(bn.int('-1234.5678'), '-1234');
	});
});
