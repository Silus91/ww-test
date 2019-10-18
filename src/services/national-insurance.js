const R = require('ramda');
const moment = require('moment');
const RD = require('../utils/ramda-decimal');

const allBands = require('../config/ni');

const isDateOnOrAfter = R.curry(
  (date, dateString) => moment.utc(dateString, 'YYYY-MM-DD')
    .isSameOrBefore(date),
);

const noBandsError = date => new Error(`National Insurance bands unavailable for date ${date}`);

const bandsOnDate = (date) => {
  const month = moment.utc(date, 'YYYY-MM-DD');

  return R.compose(
    R.when(R.isNil, () => {
      throw noBandsError(date);
    }),
    R.prop('bands'),
    R.last,
    R.filter(R.propSatisfies(isDateOnOrAfter(month), 'startDate')),
  )(allBands);
};


// Run this command to see the result of the unit tests,
//  you will need to implement the empty function
//  at `line:27` of `src/services/national-insurance.js`
//   in order to make the failing unit tests pass.
// TODO this should do more than return the number it's given

// allowance === celing
// floor == value not enough for rate
const slice = R.curry((floor, ceiling, income) => {
  
                                // £581
                    // == 718 floor        // ceiling
  // £166 to £962 a week (£719 -> £1300 <- sdfsdfssdff£4,167 a month)	12%

  // over ceiling 0.02

  // Over £962 a week (£4,167 a month)	2%

  if (income <= floor) {
    return 0;
  }

  if (income >= floor && income <= ceiling) {
    return income - floor;
  }

  if (income >= floor && income >= ceiling) {
    return (ceiling - floor);
  }
  // [5, 10, 10, 5, 'number when input == ceiling with nonzero floor'],

  if (floor + income - ceiling) {
    return ;
  }

  return 0;
});

const calcForBand = R.curry(
  (income, { floor, ceiling, rate }) => RD.multiply(
    slice(floor, ceiling, income),
    rate,
  )
);

module.exports = (runDate) => {
  const bands = bandsOnDate(runDate || moment.utc());
  return R.compose(
    RD.sum,
    R.flip(R.map)(bands),
    calcForBand,
  );
};

// for unit tests
module.exports.bandsOnDate = bandsOnDate;
module.exports.slice = slice;
