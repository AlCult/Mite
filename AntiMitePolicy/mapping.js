'use strict';

const { setExampleLabelOverPrintoutText, getDocumentNameByTypeId, formattedDate } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { thousandsSeparators, dayToString, numberToWordsCurrency } = require('@config-sogaz/global-library/lib/PrintoutsHelper');
const { getValue } = require('@config-sogaz/global-library/lib/ObjectHelper');
const { setImg } = require('@config-sogaz/global-library/lib/PrintoutsHTMLHelper');
const { partyRole } = require("@config-sogaz/party/lib/PartyEnums");
const { enums } = require('@config-sogaz/universal-box-configuration/lib/UBCEnums');

module.exports = function mapping(input) {
    const { businessContext } = this;

    const isDocStateDraft = businessContext.documentState === 'Draft';
    const boxVariant = input.body.insuranceConditions.boxVariant;

    let dmsRiskPremium = 0;
    let nsizRiskPremium = 0;
    let dmsSumInsured = 0;
    let nsizSumInsured = 0;

    input.body.insuredRisks.groupRisk.forEach((risk) => {
        risk.elRisks.forEach((elRisk) => {
            if (elRisk.value == enums.defaultRisk) {
                dmsRiskPremium += elRisk.premium;
                dmsSumInsured = dmsSumInsured || elRisk.sumInsured;
            }
            else {
                nsizRiskPremium += elRisk.premium;
                nsizSumInsured = nsizSumInsured || elRisk.sumInsured;
            }
        });
    });

    // policy holder data
    const policyHolder = input.body.parties.find(party => party.partyRoles.includes(partyRole.policyHolder));

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
    let insuredObjectFullName, insuredObjectRegistrationAddress, insuredObjectDateOfBirth;

    if (input.body.insuredObjects.length) {
        const insuredObjectIndex = input.body.insuredObjects.length - 1;

        insuredObjectFullName = input.body.insuredObjects[insuredObjectIndex].fullName;
        insuredObjectRegistrationAddress = input.body.insuredObjects[insuredObjectIndex].registrationAddress;
        insuredObjectDateOfBirth = formattedDate(input.body.insuredObjects[insuredObjectIndex].dateOfBirth);
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
        setExampleLabel: isDocStateDraft ? setExampleLabelOverPrintoutText() : '<style></style>',
        currentDate: dayToString(new Date().toLocaleDateString('ru-RU')),
        insuredSum: boxVariant.sumInsured ? thousandsSeparators(boxVariant.sumInsured) : undefined,
        insuredPremium: boxVariant.basePremium ? thousandsSeparators(boxVariant.basePremium) : undefined,
        documentNumber: getValue(businessContext, 'documentNumber', ''),
        isDocStateDraft,
        policyHolderFullName: policyHolder?.fullName,
        policyHolderPassportSeries,
        policyHolderPassportNumber,
        policyHolderPassportIssueDate,
        policyHolderPassportIssuer,
        policyHolderDocumentType,
        policyHolderEmail: policyHolder?.email,
        policyHolderPhone: policyHolder?.mobilePhone,
        policyHolderRegistrationAddress: policyHolder?.registrationAddress,
        policyHolderPassportDepartmentCode,
        policyHolderDateOfBirth: policyHolder?.dateOfBirth ? formattedDate(policyHolder?.dateOfBirth) : '',
        signerProxyNumber,
        signerShortName,
        signerPosition,
        signerProxyDate,
        signerFacsimile,
        boxVariant,
        isPlus: boxVariant.id == enums.boxVariants.antiMitePlus || boxVariant.id == enums.boxVariants.antiMitePlusExtended,
        antiMiteBasic: boxVariant.id == enums.boxVariants.antiMiteBase,
        antiMitePlusBasic: boxVariant.id == enums.boxVariants.antiMitePlus,
        dmsSumInsured: dmsSumInsured ? thousandsSeparators(dmsSumInsured) : undefined,
        nsizSumInsured: dmsSumInsured ? thousandsSeparators(nsizSumInsured) : undefined,
        insuredSumText: boxVariant.sumInsured ? numberToWordsCurrency(boxVariant.sumInsured, "", false, false, true) : '',
        insuredPremiumText: boxVariant.basePremium ? numberToWordsCurrency(boxVariant.basePremium, "", false, false, true) : '',
        dmsSumInsuredText: dmsSumInsured ? numberToWordsCurrency(dmsSumInsured, "", false, false, true) : '',
        nsizSumInsuredText: nsizSumInsured ? numberToWordsCurrency(nsizSumInsured, "", false, false, true) : '',
        dmsPremium: dmsRiskPremium ? thousandsSeparators(dmsRiskPremium) : undefined,
        dmsPremiumText: dmsRiskPremium ? numberToWordsCurrency(dmsRiskPremium, "", false, false, true) : '',
        nsizPremium: nsizRiskPremium ? thousandsSeparators(nsizRiskPremium) : undefined,
        nsizPremiumText: nsizRiskPremium ? numberToWordsCurrency(nsizRiskPremium, "", false, false, true) : '',
        insuredObjectFullName,
        insuredObjectRegistrationAddress,
        insuredObjectDateOfBirth,
        isStraightSalesDepartment: enums.straightSalesDepartments.includes(input.body.orgStructure.initiator.orgUnitRegionName),
        isNotOnePerson: input.body.insuredObjects.length > 1
    };
};

