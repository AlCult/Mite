'use strict';

const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');
const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === enums.states.draft;
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const boxVariant = input.body.insuranceConditions.boxVariant;
    const boxVariantName = boxVariant.variantNameRu;

    const isBasic = boxVariant.id == enums.boxVariants.vmtBase;
    const isPremium = boxVariant.id == enums.boxVariants.vmtPremium;
    const isOptimal = boxVariant.id == enums.boxVariants.vmtOptimal;

    return {
        setExampleLabel,
        isBasic,
        isPremium,
        isOptimal,
        boxVariantName
    };
};
