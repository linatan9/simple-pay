import React, { useEffect, useState } from 'react';
import {
    FlexRow, IconButton, IconContainer, Panel, Spinner, Text,
} from '@epam/loveship';
import { useMedia } from 'react-use';
import {
    chevronDown24, chevronRight24, emptyDetailsPicture, successAlert,
} from '../../../components';
import { showConfirmationModal } from '../../../components/modals/confirmationModal/ConfirmationModal';
import { NavigationPanel } from '../../../components/navigation/NavigationPanel';
import { StatusDot } from '../../../components/table';
import { svc } from '../../../services';
import { ContractorAdditionalInfo } from './ContractorAdditionalInfo';
import { ContractorContractsList } from './ContractorContractsList';
import css from './ContractorDetailsPage.module.scss';
import * as models from '../../../server/models';

interface ContractorDetailsPageProps {
    id: number;
}

const ColorMap: Record<string, string> = {
    production: '#67A300',
};

export const regExpEmail = /^(?!^\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/;

export const ContractorDetailsPage: React.FC<ContractorDetailsPageProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isUnsavedAdditionalInfo, setIsUnsavedAdditionalInfo] = useState(false);
    const currentPath = svc.uuiRouter.getCurrentLink().pathname.match(/\d+/g);
    const contractorIdFromPath = currentPath && currentPath[0];
    const [contractorId] = useState(props.id || +contractorIdFromPath);
    const [contractorDetails, setContractorDetails] = useState<models.Profile>(null);
    const mobileView = useMedia('(max-width: 720px)');
    const isSbc = svc.uuiApp.security.groups.includes('SBC_OPERATIONS') || svc.uuiApp.security.groups.includes('SBC_LEADS');
    const isDelegate = svc.uuiApp.security.roles.includes('DELEGATE');
    const isContractor = svc.uuiApp.security.roles.includes('CONTRACTOR', 'DELEGATE');
    const isBusinessAdmin = svc.uuiApp.security.groups.includes('BUSINESS_ADMINS');
    const isAuditor = svc.uuiApp.security.groups.includes('AUDITORS');
    const isRegionalAuditor = svc.uuiApp.security.groups.includes('REGIONAL_AUDITORS');
    const production = 'production';

    const [expandedVendorIds, setExpandedVendorIds] = useState([]);
    const [expandedContractIds, setExpandedContractIds] = useState([]);
    const [isEditAdditionalInfoMode, setEditAdditionalInfoMode] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        svc.api.contractors.getContractorProfileDetails(contractorId).then((profileDetails: models.Profile) => {
            setIsLoading(false);
            setContractorDetails(profileDetails);
            if (profileDetails.vendors?.length) {
                expandVendorDetails(profileDetails.vendors[0].id);
            }
        }).catch(() => {
            setIsLoading(false);
            svc.uuiApi.reset();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractorId]);

    const expandVendorDetails = (id: number) => {
        let copyExpandedVendorIds = [];
        if (expandedVendorIds.includes(id)) {
            copyExpandedVendorIds = expandedVendorIds.filter((expandedId) => expandedId !== id);
        } else {
            copyExpandedVendorIds = [...expandedVendorIds];
            copyExpandedVendorIds.push(id);
        }
        setExpandedVendorIds(copyExpandedVendorIds);
    };

    const expandContractDetails = (id: number) => {
        let copyExpandedContractIds = [];
        if (expandedContractIds.includes(id)) {
            copyExpandedContractIds = expandedContractIds.filter((expandedId) => expandedId !== id);
        } else {
            copyExpandedContractIds = [...expandedContractIds];
            copyExpandedContractIds.push(id);
        }
        setExpandedContractIds(copyExpandedContractIds);
    };

    const emptyContracts = () => (
        <FlexRow cx={ css.emptyContractsRow }>
            <Text color="night600" fontSize="16">The vendor does not have a contract with the legal entity.</Text>
        </FlexRow>
    );

    const emptyVendors = () => (
        <Panel cx={ css.emptyVendors }>
            <IconContainer icon={ emptyDetailsPicture } />
            <Text color="night600" fontSize="16">There is no related information</Text>
        </Panel>
    );

    const onSaveAdditionInfo = (contactInfoEmail: string, note: string) => {
        const { contractor } = contractorDetails;
        const trimEmail = contactInfoEmail && contactInfoEmail.trim();
        const trimNote = note && note.trim();
        if (trimEmail && !regExpEmail.test(trimEmail)) {
            setIsValidEmail(false);
            return;
        }
        if (contractor.contactInfoEmail !== trimEmail || contractor.note !== trimNote) {
            contractor.note = trimNote;
            contractor.contactInfoEmail = trimEmail;
            svc.api.contractors.changeContractorProfileDetails(contractor.id, contractor).then(() => {
                setEditAdditionalInfoMode(false);
                setIsUnsavedAdditionalInfo(false);
                svc.uuiNotifications.show((notificationProps) => successAlert('The contractor page was updated.', notificationProps));
            });
        } else {
            setEditAdditionalInfoMode(false);
            setIsUnsavedAdditionalInfo(false);
        }
    };

    const onBackToContractorsList = () => {
        if (isUnsavedAdditionalInfo) {
            showConfirmationModal('Warning!', () => <Text>The information wasn't saved. All your changes will be lost. Continue?</Text>)
                .then(() => {
                    svc.uuiRouter.transfer({ pathname: '/contractors' });
                }).catch(() => {});
        } else {
            svc.uuiRouter.transfer({ pathname: '/contractors' });
        }
    };

    return (
        isLoading ? (
            <div className={ css.spinnerContainer }>
                <Spinner />
            </div>
        ) : (
            <div className={ `${css.container} ${(!isContractor) && (!mobileView ? css.marginTopContainer : css.marginTopContainerMobile)}` }>
                { !isContractor && <NavigationPanel text="Back to contractors" onClick={ onBackToContractorsList } /> }
                <Panel cx={ css.mainPanel }>
                    <Panel shadow cx={ css.titlePanel } background="white">
                        <FlexRow spacing="12">
                            <Text color="night700" font="sans-semibold">{contractorDetails?.contractor?.name}</Text>
                            {!contractorDetails?.contractor?.active && <Text color="fire">(Inactive)</Text>}
                            <Text color="night400">{contractorDetails?.contractor?.title}</Text>
                            {
                                contractorDetails?.contractor?.employmentCategory && +contractorDetails?.contractor?.employmentCategory?.externalId !== 0 && (
                                    <FlexRow>
                                        <StatusDot color={ ColorMap[production] } />
                                        <Text color="grass">Production</Text>
                                    </FlexRow>
                                )
                            }
                        </FlexRow>
                    </Panel>
                    <Panel background="white" shadow cx={ css.finDetailsPanel }>
                        <FlexRow borderBottom cx={ css.finDetailsPanelTitle }>
                            <Text color="night700" font="sans-semibold">Financial details</Text>
                        </FlexRow>
                        {
                            contractorDetails?.vendors?.length ? (
                                contractorDetails?.vendors?.map((vendor: models.ProfileVendor) => (
                                    <Panel key={ vendor.id } cx={ css.vendorDetailsPanelContainer }>
                                        <FlexRow borderBottom={ !mobileView || !expandedVendorIds.includes(vendor.id) } cx={ css.finDetailsPanelTitle }>
                                            {
                                                expandedVendorIds.includes(vendor.id) ? <IconButton icon={ chevronDown24 } onClick={ () => expandVendorDetails(vendor.id) } />
                                                    : <IconButton icon={ chevronRight24 } onClick={ () => expandVendorDetails(vendor.id) } />

                                            }
                                            <FlexRow>
                                                <Text color="night700" font="sans-semibold">{vendor.name}</Text>
                                                <Text color="night400">Vendor</Text>
                                            </FlexRow>
                                        </FlexRow>
                                        {
                                            expandedVendorIds.includes(vendor.id) && (
                                                <Panel cx={ css.vendorDetailsPanel }>
                                                    {
                                                        vendor.legalEntities.map((le: models.ProfileLegalEntity) => (
                                                            <Panel key={ 1 }>
                                                                <FlexRow>
                                                                    <Text color="night700" font="sans-semibold">{le.name}</Text>
                                                                    <Text color="night400">Legal entity</Text>
                                                                </FlexRow>
                                                                {
                                                                    le.contracts && le.contracts.length ? (
                                                                        le.contracts.map((contract: models.Contract) => (
                                                                            <ContractorContractsList
                                                                                key={ contract.id }
                                                                                contractorId={ contractorDetails?.contractor.id }
                                                                                expandContractDetails={ expandContractDetails }
                                                                                expandedContractIds={ expandedContractIds }
                                                                                contract={ contract }
                                                                                isAllowedSeeDetails={ isSbc || isBusinessAdmin || isAuditor || isRegionalAuditor }
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        emptyContracts()
                                                                    )
                                                                }
                                                            </Panel>
                                                        ))
                                                    }
                                                </Panel>
                                            )
                                        }
                                    </Panel>
                                ))

                            ) : (
                                emptyVendors()
                            )
                        }
                    </Panel>
                    {
                        contractorDetails && (
                            <ContractorAdditionalInfo
                                onEditClick={ () => setEditAdditionalInfoMode(true) }
                                isEditAdditionalInfoMode={ isEditAdditionalInfoMode }
                                onCancelClick={ () => setEditAdditionalInfoMode(false) }
                                onSaveClick={ onSaveAdditionInfo }
                                contractor={ contractorDetails?.contractor }
                                isSbc={ isSbc }
                                isDelegate={ isDelegate }
                                isValidEmail={ isValidEmail }
                                setIsValidEmail={ setIsValidEmail }
                                setIsUnsavedAdditionalInfo={ setIsUnsavedAdditionalInfo }
                                isUnsavedAdditionalInfo={ isUnsavedAdditionalInfo }
                            />
                        )
                    }
                </Panel>
            </div>
        )

    );
};
