'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const { id, variantNameRu } = input.body.insuranceConditions.boxVariant;
    const isPremium = id == enums.boxVariants.onkoHelpPremium;
    const isBasic = id == enums.boxVariants.onkoHelpBase;

    return {
        setExampleLabel,
        isDocStateDraft,
        isPremium,
        isBasic,
        variantNameRu
    };
};

