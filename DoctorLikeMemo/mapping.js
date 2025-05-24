'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    let boxVariant = input.body.insuranceConditions.boxVariant?.variantNameRu;

    return {
        setExampleLabel,
        boxVariant
    };
};
