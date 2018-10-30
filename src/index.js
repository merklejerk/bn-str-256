'use strict';
const _ = require('lodash');
const _Decimal = require('decimal.js-light');

const Decimal = _Decimal.clone({precision: 80});
const HEX_REGEX = /^0x[0-9a-f]*$/i;
const BIN_REGEX = /^0b[01]*$/i;
const OCTAL_REGEX = /^0[0-9]*$/;
const HEX_DIGITS =
	['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
const HEX_DIGIT_VALUES =
	_.zipObject(HEX_DIGITS, _.times(HEX_DIGITS.length));
const OCTAL_DIGITS =
	['0','1','2','3','4','5','6','7'];
const OCTAL_DIGIT_VALUES =
	_.zipObject(OCTAL_DIGITS, _.times(OCTAL_DIGITS.length));
const BIN_DIGITS =
	['0','1'];
const BIN_DIGIT_VALUES =
	_.zipObject(BIN_DIGITS, _.times(BIN_DIGITS.length));

function toDecimal(v) {
	if (_.isNaN(v) || _.isNil(v))
		throw new Error(`Cannot parse number "${v}"`);
	if (v instanceof Decimal)
		return v;
	if (typeof(v) == 'string') {
		// Catch hex encoding.
		if (v.match(HEX_REGEX))
			return baseDecode(v.substr(2).toLowerCase(), HEX_DIGIT_VALUES);
		// Catch binary encoding.
		else if (v.match(BIN_REGEX))
			return baseDecode(v.substr(2), BIN_DIGIT_VALUES);
		// Catch octal encoding.
		else if (v.match(OCTAL_REGEX))
			return baseDecode(v.substr(1), OCTAL_DIGIT_VALUES);
	}
	else if (_.isBuffer(v)) {
		return baseDecode(v.toString('hex').toLowerCase(), HEX_DIGIT_VALUES);
	}
	return new Decimal(v);
}

function baseDecode(s, digitValues) {
	s = s || digitValues[0];
	const base = _.keys(digitValues).length;
	const values = _.map(s, ch => digitValues[ch]);
	let r = new Decimal(0);
	for (let v of values)
		r = r.mul(base).add(v);
	return r;
}

function toOctal(v, length=null) {
	return '0' + baseEncode(toDecimal(v), OCTAL_DIGITS, length);
}

function toHex(v, length=null) {
	return '0x' + baseEncode(toDecimal(v), HEX_DIGITS, length);
}

function toBinary(v, length=null) {
	return '0b' + baseEncode(toDecimal(v), BIN_DIGITS, length);
}

function baseEncode(d, digits, length=null) {
	const base = digits.length;
	if (d.dp() > 0 || d.lt(0))
		throw new Error(`Can only base-${base} encode positive integers`);
	length = length || 0;
	let r = '';
	do {
		if (length > 0 && r.length >= length)
			break;
		r = digits[d.mod(base)] + r;
		d = d.idiv(base);
	} while (d.gt(0)) ;
	// Left pad.
	if (r.length < length)
		return _.repeat(digits[0], length - r.length) + r;
	return r;
}

function expand(v) {
	return toDecimal(v).toFixed();
}

function add(a, b) {
	return toDecimal(a).plus(toDecimal(b)).toFixed();
}

function sub(a, b) {
	return toDecimal(a).minus(toDecimal(b)).toFixed();
}

function mul(a, b) {
	return toDecimal(a).times(toDecimal(b)).toFixed();
}

function div(a, b) {
	return toDecimal(a).div(toDecimal(b)).toFixed();
}

function mod(a, b) {
	return toDecimal(a).mod(toDecimal(b)).toFixed();
}

function eq(a, b) {
	return toDecimal(a).eq(toDecimal(b));
}

function ne(a, b) {
	return !eq(a, b);
}

function gt(a, b) {
	return toDecimal(a).gt(toDecimal(b));
}

function gte(a, b) {
	return toDecimal(a).gte(toDecimal(b));
}

function lt(a, b) {
	return toDecimal(a).lt(toDecimal(b));
}

function lte(a, b) {
	return toDecimal(a).lte(toDecimal(b));
}

function max(a,b) {
	a = toDecimal(a);
	b = toDecimal(b);
	if (a.gt(b))
		return a.toFixed();
	return b.toFixed();
}

function min(a,b) {
	a = toDecimal(a);
	b = toDecimal(b);
	if (a.lt(b))
		return a.toFixed();
	return b.toFixed();
}

function int(a) {
	return toDecimal(a).toint().toFixed();
}

function round(a) {
	return toDecimal(a).todp(0).toFixed();
}

function abs(a) {
	return toDecimal(a).abs().toFixed();
}

function idiv(a, b) {
	return toDecimal(a).idiv(toDecimal(b)).toFixed();
}

function sum(...vals) {
	let r = new Decimal(0);
	vals = _.flatten(vals);
	for (let v of vals)
		r = r.add(toDecimal(v));
	return r.toFixed();
}

function neg(v) {
	return toDecimal(v).neg().toFixed();
}

function cmp(a, b) {
	a = toDecimal(a);
	b = toDecimal(b);
	if (a.lt(b))
		return -1;
	if (a.gt(b))
		return 1;
	return 0;
}

function pow(x, y) {
	x = toDecimal(x);
	y = toDecimal(y);
	return x.pow(y).toFixed();
}

function toBuffer(v, size) {
	let hex = toHex(v, size ? size*2 : null).substr(2);
	if (hex.length % 2)
		hex = '0' + hex;
	return Buffer.from(hex, 'hex');
}

function toNumber(v) {
	return toDecimal(v).toNumber();
}

function split(v) {
	v = expand(v);
	const m = /^([-+])?(\d+)(\.(\d+))?$/.exec(v);
	return {
		sign: m[1] || '',
		integer: m[2],
		decimal: m[4] || ''
	};
}

function sd(v, n=null) {
	v = toDecimal(v);
	if (!_.isNumber(n))
		return v.sd().toFixed();
	return v.tosd(n).toFixed();
}

function dp(v, n=null) {
	v = toDecimal(v);
	if (!_.isNumber(n))
		return v.dp();
	return v.todp(n).toFixed();
}

function sign(v) {
	v = toDecimal(v);
	if (v.gte(0))
		return 1;
	return -1;
}

module.exports = {
	expand: expand,
	parse: expand,
	add: add,
	plus: add,
	sub: sub,
	minus: sub,
	mul: mul,
	times: mul,
	div: div,
	over: div,
	mod: mod,
	eq: eq,
	ne: ne,
	gt: gt,
	lt: lt,
	gte: gte,
	lte: lte,
	max: max,
	min: min,
	int: int,
	round: round,
	idiv: idiv,
	sum: sum,
	neg: neg,
	negate: neg,
	cmp: cmp,
	abs: abs,
	pow: pow,
	sqrt: (x) => pow(x, 0.5),
	raise: pow,
	split: split,
	sign: sign,
	dp: dp,
	sd: sd,
	toHex: toHex,
	toHexadecimal: toHex,
	toBinary: toBinary,
	toOctal: toOctal,
	toBuffer: toBuffer,
	toNumber: toNumber
};
