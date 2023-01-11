'use strict';

module.exports = hooks;

const _ = require('lodash');

function hooks() {
	const array = [false, undefined, '', null, [], {}];

	return _.eachRight(array, (x) => {
		console.log('[x]:', x);
	});
}
