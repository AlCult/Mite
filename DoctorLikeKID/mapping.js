'use strict';

const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { getAge } = require("@config-sogaz/global-library/lib/DateHelper");

module.exports = function mapping(input) {
    const isDocStateDraft = this.businessContext.documentState === 'Draft';

    let isAdult;

    if (input.body.insuredObjects?.length > 0) {
        const insuredObjectIndex = input.body.insuredObjects.length - 1;

        isAdult = getAge(input.body.insuredObjects[insuredObjectIndex].dateOfBirth, Date.now()) >= 18;
    }

    return {
        setExampleLabel: isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>',
        isDisp: ['ApoTelemedDisp', 'ApoTelemedDispDent'].includes(input.body.insuranceConditions.boxVariant?.id),
        isDent: ['ApoTelemedDent', 'ApoTelemedDispDent'].includes(input.body.insuranceConditions.boxVariant?.id),
        isAdult,
        isStandart: input.body.insuranceConditions.boxVariant?.id === 'ApoTelemed',
        isFranchiseZero: input.body.insuranceConditions.attributes?.insuranceRule == '0%',
    };
};
