'use strict';

module.exports = function mapping(input) {
    return {
        data: {
            product: 'UniversalBoxConfiguration',
            searchDate: input.body.generalData.startDate || Date.now(),
            includeFacsimile: true
        }
    };
};
