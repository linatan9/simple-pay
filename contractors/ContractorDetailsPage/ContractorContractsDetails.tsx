import React from 'react';
import {
    FlexCell, FlexRow, Panel, Text,
} from '@epam/loveship';
import { useMedia } from 'react-use';
import { ContractorsRateCardTable } from './ContractorsRateCardTable';
import { ContractorRateCardMobile } from './ContractorRateCardMobile/ContractorRateCardMobile';
import * as models from '../../../server/models';
import css from './ContractorDetailsPage.module.scss';
import { tooltipForDate } from '../../contracts/ContractDetailsPage/ContractDetailsComponent/ContractDetails';
import { ContractActivationEventCodes } from '../../../server/apiModels';

interface ContractorContractsDetailsProps {
    contract: models.Contract;
    contractorId: number;
    isSbc: boolean;
}

const emptyRateCards = () => (
    <FlexRow cx={ css.emptyRateCardsRow }>
        <Text color="night600" fontSize="16">The contract does not have a rate card.</Text>
    </FlexRow>
);

export const ContractorContractsDetails: React.FC<ContractorContractsDetailsProps> = (props) => {
    const mobileView = useMedia('(max-width: 720px)');
    const fixedDueDate = ContractActivationEventCodes[props.contract.activationEvent.code as keyof typeof ContractActivationEventCodes] === ContractActivationEventCodes.Inv_FixDay;
    return (
        <Panel cx={ css.contractPanel }>
            <FlexRow cx={ css.contractPanelTitle }>
                { !mobileView ? (
                    <>
                        <FlexCell grow={ 1 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>Currency</Text>
                            <Text cx={ css.contractPanelText }>{props.contract.paymentCurrency?.code}</Text>
                        </FlexCell>
                        <FlexCell grow={ 2 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>Invoice payment event</Text>
                            <Text cx={ css.contractPanelText }>{ props.contract.activationEvent.name }</Text>
                        </FlexCell>
                        <FlexCell grow={ 1 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>{ fixedDueDate ? 'Fixed due day' : 'Days from event' }</Text>
                            <FlexRow cx={ css.contractPanelTextWithTooltip }>
                                <Text cx={ css.dueDateText }>{ props.contract.paymentTerm }</Text>
                                { tooltipForDate(fixedDueDate, props.contract.paymentTerm) }
                            </FlexRow>
                        </FlexCell>
                        <FlexCell grow={ 3 }>
                            <Text color="night400" cx={ css.contractPanelTitleText }>Other conditions</Text>
                            <Text cx={ css.contractPanelText }>{ props.contract.otherConditions || '-' }</Text>
                        </FlexCell>
                    </>
                ) : (
                    <div className={ css.contractPanelTitleMobile }>
                        <FlexCell grow={ 1 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>Currency</Text>
                            <Text cx={ css.contractPanelText }>{props.contract.paymentCurrency?.code}</Text>
                        </FlexCell>
                        <FlexCell grow={ 2 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>Invoice payment event</Text>
                            <Text cx={ css.contractPanelText }>{ props.contract.activationEvent.name }</Text>
                        </FlexCell>
                        <FlexCell grow={ 1 } alignSelf="top">
                            <Text color="night400" cx={ css.contractPanelTitleText }>{ fixedDueDate ? 'Fixed due day' : 'Days from event' }</Text>
                            <FlexRow cx={ css.contractPanelTextWithTooltip }>
                                <Text cx={ css.dueDateText }>{ props.contract.paymentTerm }</Text>
                                { tooltipForDate(fixedDueDate, props.contract.paymentTerm) }
                            </FlexRow>
                        </FlexCell>
                        <FlexCell grow={ 3 }>
                            <Text color="night400" cx={ css.contractPanelTitleText }>Other conditions</Text>
                            <Text cx={ css.contractPanelText }>{ props.contract.otherConditions || '-' }</Text>
                        </FlexCell>
                    </div>
                )}
            </FlexRow>
            {
                (props.contract.rateCards?.length && (
                    mobileView ? (
                        <ContractorRateCardMobile isSbc={ props.isSbc } contractorId={ props.contractorId } rateCards={ props.contract.rateCards } />
                    ) : (
                        <ContractorsRateCardTable isSbc={ props.isSbc } contractorId={ props.contractorId } rateCards={ props.contract.rateCards } />
                    )
                )) || (
                    emptyRateCards()
                )
            }
        </Panel>
    );
};
