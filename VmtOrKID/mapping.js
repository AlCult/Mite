'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const id = input.body.insuranceConditions.boxVariant.id;

    const isBasic = id == enums.boxVariants.vmtBase;
    const isPremium = id == enums.boxVariants.vmtPremium;

    return {
        setExampleLabel,
        isPremium,
        isBasic
    };
};
