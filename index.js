'use strict';

const groupBy = require('group-by-with');

module.exports = groupBy({
  totalCalculator: function(value) {
    const total = value.reduce(function(sum, val) {
      return sum + val;
    }, 0);
    return total / value.length;
  }
});