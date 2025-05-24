'use strict';

const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');
const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const isDocStateDraft = this.businessContext.documentState === enums.states.draft;

    const boxVariant = input.body.insuranceConditions.boxVariant;

    return {
        setExampleLabel: isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>',
        isPlus: boxVariant.id == enums.boxVariants.antiMitePlus || boxVariant.id == enums.boxVariants.antiMitePlusExtended,
        antiMiteBasic: boxVariant.id == enums.boxVariants.antiMiteBase,
        antiMitePlusBasic: boxVariant.id == enums.boxVariants.antiMitePlus,
        isStraightSalesDepartment: enums.straightSalesDepartments.includes(input.body.orgStructure.initiator.orgUnitRegionName)
    };
};
