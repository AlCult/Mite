
const { setExampleLabelOverPrintoutText } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const isDocStateDraft = this.businessContext.documentState === 'Draft';

    return {
        setExampleLabel: isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>',
        boxVariant: input.body.insuranceConditions.boxVariant?.variantNameRu,
        isFranchiseZero: input.body.insuranceConditions.attributes?.insuranceRule == '0%',
    };
};
