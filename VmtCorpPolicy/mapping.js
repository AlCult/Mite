'use strict';

const { setExampleLabelOverPrintoutText, getDocumentNameByTypeId, formattedDate } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { thousandsSeparators, numberToWordsCurrency } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { getValue } = require('@config-sogaz/global-library/lib/ObjectHelper');
const { setImg } = require('@config-sogaz/global-library/lib/PrintoutsHTMLHelper');
const { partyRole } = require("@config-sogaz/party/lib/PartyEnums");
const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');
const { Translator } = require('@config-sogaz/global-library/lib/PrintoutsHelper');

module.exports = function mapping(input) {
    const { businessContext } = this;
    let tr = new Translator('masterEntity/NaturalPerson');

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const setExampleLabel = isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>';
    const documentNumber = getValue(businessContext, 'documentNumber', '');
    const currentDate = new Date().toLocaleDateString('ru-RU');

    const insuredSum = thousandsSeparators(input.commonBody.summary.sumInsured);
    const insuredPremium = thousandsSeparators(input.commonBody.summary.totalPremium);
    const insuredPremiumLiteral = numberToWordsCurrency(insuredPremium);
    const paymentFrequency = input.body.dataSources.defaultPaymentFrequency.find(payment => payment.value == input.body.paymentData.paymentFrequency).name;
    const isMultiPayment = input.body.paymentData.paymentFrequency != "Single";
    const isCashBank = input.body.paymentData.paymentMethod == "cashBank";
    const paymentPlanTable = input.body.paymentData.paymentPlan;
    const lightTitle = input.body.insuranceConditions.boxVariant.id == enums.boxVariants.askDoctorLight ? ' Лайт' : '';
    const boxVariantName = input.body.insuranceConditions.boxVariant.variantNameRu;
    let title = `«Спроси врача${lightTitle}»`;

    const insuranceStartDate = formattedDate(input.body.insuranceConditions.validFrom);
    const insuranceEndDate = formattedDate(input.body.generalData.endDate);

    // policy holder data
    const policyHolder = input.body.parties.find(party => party.partyRoles.includes(partyRole.policyHolder));

    const policyHolderFullName = policyHolder?.fullName;
    const policyHolderEmail = policyHolder?.email;
    const policyHolderPhone = policyHolder?.mobilePhone;
    const policyHolderAddress = policyHolder?.registrationAddress;
    const policyHolderDateOfBirth = formattedDate(policyHolder?.dateOfBirth);
    const policyHolderIsResident = policyHolder?.resident;
    const policyHolderCitizenship = policyHolderIsResident ? 'РФ' : tr.getEnum('PartyCountry', _ => policyHolder?.attributes?.registrationCountry, 'PartyCountry');

    let policyHolderPassportIssuer, policyHolderDocumentType, policyHolderPassportSeries, policyHolderPassportNumber, policyHolderPassportIssueDate, policyHolderPassportDepartmentCode;

    if (policyHolder?.documents?.length > 0) {
        const policyHolderDocumentIndex = policyHolder.documents.length - 1;

        policyHolderPassportIssuer = policyHolder.documents[policyHolderDocumentIndex]?.issuer;
        policyHolderDocumentType = getDocumentNameByTypeId(policyHolder.documents[policyHolderDocumentIndex]?.documentType, true);
        policyHolderPassportSeries = policyHolder.documents[policyHolderDocumentIndex]?.series;
        policyHolderPassportNumber = policyHolder.documents[policyHolderDocumentIndex]?.number;
        policyHolderPassportIssueDate = formattedDate(policyHolder.documents[policyHolderDocumentIndex]?.issueDate);
        policyHolderPassportDepartmentCode = policyHolder.documents[policyHolderDocumentIndex]?.departmentCode;
    }

    // insured object data
    let insuredObjectFullName, insuredObjectEmail, insuredObjectPhone, insuredObjectAddress, insuredObjectDateOfBirth, insuredObjectDocumentType,
        insuredObjectPassportSeries, insuredObjectPassportNumber, insuredObjectPassportIssueDate, insuredObjectPassportIssuer, insuredObjectIsResident, insuredObjectCitizenship, insuredObjectPassportDepartmentCode;

    if (input.body.insuredObjects?.length > 0) {
        const insuredObjectIndex = input.body.insuredObjects.length - 1;

        insuredObjectFullName = input.body.insuredObjects[insuredObjectIndex].fullName;
        insuredObjectEmail = input.body.insuredObjects[insuredObjectIndex].email;
        insuredObjectPhone = input.body.insuredObjects[insuredObjectIndex].mobilePhone;
        insuredObjectAddress = input.body.insuredObjects[insuredObjectIndex].registrationAddress;
        insuredObjectDateOfBirth = formattedDate(input.body.insuredObjects[insuredObjectIndex].dateOfBirth);
        insuredObjectIsResident = input.body.insuredObjects[insuredObjectIndex]?.resident;
        insuredObjectCitizenship = insuredObjectIsResident ? 'РФ' : tr.getEnum('PartyCountry', _ => input.body.insuredObjects[insuredObjectIndex]?.attributes?.registrationCountry, 'PartyCountry');

        if (input.body.insuredObjects[insuredObjectIndex].documents?.length > 0) {
            const insuredObjectDocumentIndex = input.body.insuredObjects[insuredObjectIndex].documents.length - 1;

            insuredObjectDocumentType = getDocumentNameByTypeId(input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].documentType, true);
            insuredObjectPassportSeries = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].series;
            insuredObjectPassportNumber = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].number;
            insuredObjectPassportIssueDate = formattedDate(input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].issueDate);
            insuredObjectPassportIssuer = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex].issuer;
            insuredObjectPassportDepartmentCode = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.departmentCode;
        }
    }

    // signer data
    let signerShortName, signerPosition, signerFacsimile, signerProxyNumber, signerProxyDate;

    const signatories = input.dataSourceData.data;

    if (signatories?.length > 0) {
        const signatory = signatories[0];

        signerProxyNumber = signatory.powersOfAttorney[0].number;
        signerProxyDate = signatory.powersOfAttorney[0].localDate;
        signerShortName = signatory.shortName.normal;
        signerPosition = signatory.position.nominativeCapital;
        signerFacsimile = signatory.facsimile ? setImg(signatory.facsimile, undefined, 'facsimile') : '';
    }

    return {
        setExampleLabel,
        title,
        boxVariantName,
        currentDate,
        insuredSum,
        insuredPremium,
        insuredPremiumLiteral,
        documentNumber,
        isDocStateDraft,
        policyHolderFullName,
        policyHolderPassportSeries,
        policyHolderPassportNumber,
        policyHolderPassportIssueDate,
        policyHolderPassportIssuer,
        policyHolderPassportDepartmentCode,
        policyHolderDocumentType,
        policyHolderEmail,
        policyHolderPhone,
        policyHolderAddress,
        policyHolderDateOfBirth,
        policyHolderIsResident,
        policyHolderCitizenship,
        insuredObjectFullName,
        insuredObjectCitizenship,
        insuredObjectIsResident,
        insuredObjectDocumentType,
        insuredObjectPassportSeries,
        insuredObjectPassportNumber,
        insuredObjectPassportIssueDate,
        insuredObjectPassportIssuer,
        insuredObjectPassportDepartmentCode,
        insuredObjectEmail,
        insuredObjectPhone,
        insuredObjectAddress,
        insuredObjectDateOfBirth,
        signerProxyNumber,
        signerShortName,
        signerPosition,
        signerProxyDate,
        signerFacsimile,
        insuranceStartDate,
        insuranceEndDate,
        paymentFrequency,
        isCashBank,
        isMultiPayment,
        paymentPlanTable
    };
};

