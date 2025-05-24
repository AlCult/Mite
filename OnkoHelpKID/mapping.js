'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const id = input.body.insuranceConditions.boxVariant.id;

    const isPremium = id === 'Premium';
    const isBase = id === 'Base';
    const isAdvanced = id === 'Advanced';

    return {
        setExampleLabel,
        isPremium,
        isBase,
        isAdvanced,
    };
};
