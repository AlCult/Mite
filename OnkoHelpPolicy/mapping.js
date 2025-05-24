'use strict';

const { setExampleLabelOverPrintoutText, getDocumentNameByTypeId, formattedDate } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { thousandsSeparators, dayToString } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
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
    const currentDate = dayToString(new Date().toLocaleDateString('ru-RU'));

    const boxVariant = input.body.insuranceConditions.boxVariant;
    const isBaseVariant = boxVariant.id == enums.boxVariants.onkoHelpBase;
    const isPremiumVariant = boxVariant.id == enums.boxVariants.onkoHelpPremium;

    const insuredSum = boxVariant.sumInsured ? thousandsSeparators(boxVariant.sumInsured) : 0;
    const insuredPremium = boxVariant.basePremium ? thousandsSeparators(boxVariant.basePremium) : 0;

    const risks = input.body.insuredRisks.groupRisk?.length ? input.body.insuredRisks.groupRisk[0] : [];
    let dmsRisk, vdzRisk;

    if (risks && risks.elRisks?.length) {
        dmsRisk = risks.elRisks.find(risk => risk.value == 'medicalInsure');
        vdzRisk = risks.elRisks.find(risk => risk.value == 'VDZ');
    }

    const insuranceDeductable = boxVariant.deductable;
    const boxVariantName = boxVariant.id == enums.boxVariants.onkoHelpPremium ? `${boxVariant.variantNameRu} РФ` : boxVariant.variantNameRu;

    const insuranceStartDate = formattedDate(input.body.insuranceConditions.validFrom);
    const insuranceEndDate = formattedDate(input.body.generalData.endDate);

    // policy holder data
    const policyHolder = input.body.parties.find(party => party.partyRoles.includes(partyRole.policyHolder));

    const policyHolderFullName = policyHolder?.fullName;
    const policyHolderEmail = policyHolder?.email;
    const policyHolderPhone = policyHolder?.mobilePhone;
    const policyHolderRegistrationAddress = policyHolder?.registrationAddress;
    const policyHolderDateOfBirth = formattedDate(policyHolder?.dateOfBirth);
    const policyHolderCitizenship = policyHolder?.resident ? 'РФ' : tr.getEnum('PartyCountry', _ => policyHolder?.attributes?.registrationCountry, 'PartyCountry');

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
    let insuredObjectFullName, insuredObjectEmail, insuredObjectPhone, insuredObjectRegistrationAddress, insuredObjectDateOfBirth, insuredObjectDocumentType,
        insuredObjectPassportSeries, insuredObjectPassportNumber, insuredObjectPassportIssueDate, insuredObjectPassportIssuer, insuredObjectPassportDepartmentCode;

    if (input.body.insuredObjects?.length > 0) {
        const insuredObjectIndex = input.body.insuredObjects.length - 1;

        insuredObjectFullName = input.body.insuredObjects[insuredObjectIndex].fullName;
        insuredObjectEmail = input.body.insuredObjects[insuredObjectIndex].email;
        insuredObjectPhone = input.body.insuredObjects[insuredObjectIndex].mobilePhone;
        insuredObjectRegistrationAddress = input.body.insuredObjects[insuredObjectIndex].registrationAddress;
        insuredObjectDateOfBirth = formattedDate(input.body.insuredObjects[insuredObjectIndex].dateOfBirth);

        if (input.body.insuredObjects[insuredObjectIndex].documents?.length > 0) {
            const insuredObjectDocumentIndex = input.body.insuredObjects[insuredObjectIndex].documents.length - 1;

            insuredObjectDocumentType = getDocumentNameByTypeId(input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.documentType, true);
            insuredObjectPassportSeries = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.series;
            insuredObjectPassportNumber = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.number;
            insuredObjectPassportIssueDate = formattedDate(input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.issueDate);
            insuredObjectPassportIssuer = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.issuer;
            insuredObjectPassportDepartmentCode = input.body.insuredObjects[insuredObjectIndex].documents[insuredObjectDocumentIndex]?.departmentCode;
        }
    }

    // signer data
    let signerShortName, signerPosition, signerFacsimile, signerProxyNumber, signerProxyDate;

    const signatories = input.dataSourceData?.data;

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
        currentDate,
        insuredSum,
        insuredPremium,
        documentNumber,
        isDocStateDraft,
        policyHolderFullName,
        policyHolderPassportSeries,
        policyHolderPassportNumber,
        policyHolderPassportIssueDate,
        policyHolderPassportIssuer,
        policyHolderDocumentType,
        policyHolderEmail,
        policyHolderPhone,
        policyHolderRegistrationAddress,
        policyHolderPassportDepartmentCode,
        policyHolderDateOfBirth,
        insuredObjectFullName,
        insuredObjectDocumentType,
        insuredObjectPassportSeries,
        insuredObjectPassportNumber,
        insuredObjectPassportIssueDate,
        insuredObjectPassportIssuer,
        insuredObjectPassportDepartmentCode,
        insuredObjectEmail,
        insuredObjectPhone,
        insuredObjectRegistrationAddress,
        insuredObjectDateOfBirth,
        signerProxyNumber,
        signerShortName,
        signerPosition,
        signerProxyDate,
        signerFacsimile,
        insuranceStartDate,
        insuranceEndDate,
        insuranceDeductable,
        boxVariant,
        isBaseVariant,
        policyHolderCitizenship,
        boxVariantName,
        isPremiumVariant,
        dmsPemium: dmsRisk?.premium ? thousandsSeparators(dmsRisk.premium) : undefined,
        dmsSumInsured: dmsRisk?.sumInsured ? thousandsSeparators(dmsRisk.sumInsured) : undefined,
        vdzPemium: vdzRisk?.premium ? thousandsSeparators(vdzRisk.premium) : undefined,
        vdzSumInsured: vdzRisk?.sumInsured ? thousandsSeparators(vdzRisk.sumInsured) : undefined,
    };
};

