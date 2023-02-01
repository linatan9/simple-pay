import React from 'react';
import { IModal } from '@epam/uui';
import {
    FlexCell,
    ModalBlocker, ModalHeader, ModalWindow, Text,
} from '@epam/loveship';
import accounting from 'accounting';
import * as models from '../../../../server/models';
import css from './ContractorRateCardMobile.module.scss';
import { getDate, getSpecificDate } from '../../../../helpers/Helpers';
import { Status } from '../../../../components';
import { colorMapStatusRateCardContractors } from '../contractorsRateCardTableColumns';

interface ContractorCardsDetailsModalProps extends IModal<boolean> {
    rateCard: models.RateCard;
}

export const ContractorCardsDetailsModal: React.FC<ContractorCardsDetailsModalProps> = (props) => {
    const { rateCard } = props;

    return (
        <ModalBlocker blockerShadow="dark" { ...props }>
            <ModalWindow height="auto" width="300" cx={ css.modalMobile }>
                <ModalHeader title="Rate cards details" onClose={ props.abort } borderBottom />
                <div className={ css.modalContent }>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">ID</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{rateCard.id}</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Category</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{rateCard.rateCardCategory.name}</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Effective from</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{ `${getDate(rateCard.effectiveFromDate)}` }</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Effective to</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>
                            {
                                `${getSpecificDate(rateCard.effectiveToDate || rateCard.operationalEffectiveToDate, 'YYYY') !== '3000'
                                    ? getDate(rateCard.effectiveToDate || rateCard.operationalEffectiveToDate)
                                    : 'Open-end'}`
                            }
                        </Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Unit type</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{ rateCard.workUnitType.name }</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Net rate</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{ rateCard?.unitRate ? accounting.formatNumber(rateCard.unitRate, 2, ' ') : '-' }</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Currency</Text>
                        <Text lineHeight="18" cx={ css.textWithoutTopPadding }>{ rateCard.currency.code }</Text>
                    </FlexCell>
                    <FlexCell>
                        <Text lineHeight="18" color="night500">Status</Text>
                        <Text lineHeight="18" cx={ [css.textWithoutTopPadding, css.statusModal] }>
                            <Status colorMap={ colorMapStatusRateCardContractors } name={ rateCard.status.name } status={ rateCard.status.key as string } />
                        </Text>
                    </FlexCell>
                </div>
            </ModalWindow>
        </ModalBlocker>
    );
};
