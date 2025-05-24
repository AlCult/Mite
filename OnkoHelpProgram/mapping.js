'use strict';

const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');
const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { thousandsSeparators } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === enums.states.draft;
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const boxVariant = input.body.insuranceConditions.boxVariant;
    const boxVariantName = boxVariant.variantNameRu;
    const insuredSum = boxVariant.sumInsured ? thousandsSeparators(boxVariant.sumInsured) : 0;

    const isBasic = boxVariant.id == enums.boxVariants.onkoHelpBase;

    return {
        setExampleLabel,
        isBasic,
        boxVariantName,
        insuredSum
    };
};
