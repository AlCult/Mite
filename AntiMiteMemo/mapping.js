'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');

module.exports = function mapping(input) {
    const isDocStateDraft = this.businessContext.documentState === 'Draft';
    const id = input.body.insuranceConditions.boxVariant.id;

    return {
        isDocStateDraft,
        setExampleLabel: isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>',
        isPlus: id == enums.boxVariants.antiMitePlus || id == enums.boxVariants.antiMitePlusExtended,
        antiMiteBasic: id == enums.boxVariants.antiMiteBase,
        antiMitePlusBasic: id == enums.boxVariants.antiMitePlus
    };
};

