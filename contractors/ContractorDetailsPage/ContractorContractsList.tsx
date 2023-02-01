import React from 'react';
import {
    FlexRow, IconButton, Panel, Text,
} from '@epam/loveship';
import { useMedia } from 'react-use';
import { chevronDown24, chevronRight24, sharepointContractLinkIcon } from '../../../components';
import { getDate } from '../../../helpers/Helpers';
import * as models from '../../../server/models';
import { svc } from '../../../services';
import { ContractorContractsDetails } from './ContractorContractsDetails';
import css from './ContractorDetailsPage.module.scss';

interface ContractorContractsListProps {
    contract: models.Contract;
    expandContractDetails: (contractId: number) => void;
    expandedContractIds: number[];
    contractorId: number;
    isAllowedSeeDetails: boolean;
}

export const ContractorContractsList: React.FC<ContractorContractsListProps> = (props) => {
    const mobileView = useMedia('(max-width: 720px)');
    const getContractDates = (contract: models.Contract) => {
        const startDate = getDate(contract.startDate);
        const endDate = contract.openDateContract ? 'Open-end' : getDate(contract.endDate);
        return `${startDate} - ${endDate}`;
    };
    return (
        <Panel cx={ css.contractPanelContainer }>
            <FlexRow alignItems={ mobileView ? 'top' : 'center' } cx={ css.contractTitleRow }>
                {
                    props.expandedContractIds.includes(props.contract.id) ? (
                        <IconButton icon={ chevronDown24 } onClick={ () => props.expandContractDetails(props.contract.id) } />
                    )
                        : (
                            <IconButton icon={ chevronRight24 } onClick={ () => props.expandContractDetails(props.contract.id) } />
                        )

                }
                {
                    mobileView ? (
                        <div className={ css.contractTitleContentMobile }>
                            <Text
                                color="sky"
                                font="sans-semibold"
                                cx={ [css.contractorIdText, props.isAllowedSeeDetails && css.contractorIdTextHoverForSbc] }
                                onClick={ () => props.isAllowedSeeDetails && svc.uuiRouter.redirect({ pathname: `/contracts/${props.contract.id}` }) }
                            >
                                Contract ID&nbsp;
                                {props.contract.id}
                            </Text>
                            <Text>{ getContractDates(props.contract) }</Text>
                        </div>
                    ) : (
                        <>
                            <Text
                                color="sky"
                                font="sans-semibold"
                                cx={ [css.contractorIdText, props.isAllowedSeeDetails && css.contractorIdTextHoverForSbc] }
                                onClick={ () => props.isAllowedSeeDetails && svc.uuiRouter.redirect({ pathname: `/contracts/${props.contract.id}` }) }
                            >
                                Contract ID&nbsp;
                                {props.contract.id}
                            </Text>
                            <Text>{ getContractDates(props.contract) }</Text>
                        </>
                    )
                }
                {props.isAllowedSeeDetails && props.contract.link && <IconButton icon={ sharepointContractLinkIcon } onClick={ () => window.open(`${props.contract.link}`, '_blank') } />}
            </FlexRow>
            {
                props.expandedContractIds.includes(props.contract.id) && (
                    <ContractorContractsDetails isSbc={ props.isAllowedSeeDetails } contract={ props.contract } contractorId={ props.contractorId } />
                )
            }
        </Panel>
    );
};
