'use strict';

const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');
const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === enums.states.draft;
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const isLight = input.body.insuranceConditions.boxVariant.id == enums.boxVariants.askDoctorLight;

    return {
        setExampleLabel,
        isLight
    };
};
