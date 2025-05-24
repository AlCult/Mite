'use strict';

const { setExampleLabelOverPrintoutText, formattedDate } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';

    const currentDate = new Date().toLocaleDateString('ru-RU');

    // insured object data
    let insuredObjectFullName, insuredObjectPhone, insuredObjectRegistrationAddress, insuredObjectDateOfBirth,
        insuredObjectPassportSeries, insuredObjectPassportNumber, insuredObjectPassportIssueDate, insuredObjectPassportIssuer;

    if (input.body.insuredObjects?.length > 0) {
        const insuredObjectIndex = input.body.insuredObjects.length - 1;

        insuredObjectFullName = input.body.insuredObjects[insuredObjectIndex].fullName;
        insuredObjectPhone = input.body.insuredObjects[insuredObjectIndex].mobilePhone;
        insuredObjectRegistrationAddress = input.body.insuredObjects[insuredObjectIndex].registrationAddress;
        insuredObjectDateOfBirth = formattedDate(input.body.insuredObjects[insuredObjectIndex].dateOfBirth);

        if (input.body.insuredObjects[insuredObjectIndex].documents?.length > 0) {
            const insuredObjectDocumentIndex = input.body.insuredObjects[insuredObjectIndex].documents.length - 1;

            insuredObjectPassportSeries = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].series;
            insuredObjectPassportNumber = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].number;
            insuredObjectPassportIssueDate = formattedDate(input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].issueDate);
            insuredObjectPassportIssuer = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].issuer;
        }
    }

    return {
        setExampleLabel,
        currentDate,
        isDocStateDraft,
        insuredObjectFullName,
        insuredObjectPassportSeries,
        insuredObjectPassportNumber,
        insuredObjectPassportIssueDate,
        insuredObjectPassportIssuer,
        insuredObjectPhone,
        insuredObjectRegistrationAddress,
        insuredObjectDateOfBirth,
    };
};

