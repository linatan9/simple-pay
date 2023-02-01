import {
    FlexRow, FlexSpacer, Panel, Text,
} from '@epam/loveship';
import accounting from 'accounting';
import React from 'react';
import * as models from '../../../../server/models';
import { svc } from '../../../../services';
import css from './ContractorRateCardMobile.module.scss';
import { ContractorCardsDetailsModal } from './ContractorCardsDetailsModal';

interface ContractorsRateCardTableProps {
    rateCards: models.RateCard[];
    contractorId: number;
    isSbc: boolean;
}
export const ContractorRateCardMobile: React.FC<ContractorsRateCardTableProps> = (props) => {
    const { rateCards } = props;

    return (
        <div className={ css.contractorsRateCardsMobile }>
            <FlexRow>
                <Text lineHeight="18" font="sans-semibold" cx={ css.rateCardHeader }>Rate cards</Text>
            </FlexRow>
            {rateCards.map((rateCard) => (
                <Panel
                    key={ rateCard.id }
                    cx={ css.rateCardPanel }
                    onClick={ () => svc.uuiModals
                        .show((modalProps) => <ContractorCardsDetailsModal rateCard={ rateCard } { ...modalProps } />) }
                >
                    <FlexRow cx={ css.rateCardContent }>
                        <Text>{ rateCard.workUnitType.name }</Text>
                        <FlexSpacer />
                        <Text>{ rateCard?.unitRate ? `${accounting.formatNumber(rateCard.unitRate, 2, ' ')} ${rateCard.currency.code}` : '-' }</Text>
                    </FlexRow>
                </Panel>
            ))}
        </div>
    );
};
