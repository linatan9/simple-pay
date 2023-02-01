import { Text } from '@epam/loveship';
import { DataColumnProps } from '@epam/uui';
import accounting from 'accounting';
import React from 'react';
import { Status } from '../../../components/table';
import { getDate, getSpecificDate } from '../../../helpers/Helpers';
import * as models from '../../../server/models';

export const colorMapStatusRateCardContractors: Record<string, string> = {
    [models.RateCardStatus.DRAFT]: '#E1E3EB',
    [models.RateCardStatus.EXPIRED]: 'rgba(252,170,0,0.4)',
    [models.RateCardStatus.REJECTED]: 'rgba(251,99,87,0.4)',
    [models.RateCardStatus.SUBMITTED]: 'rgba(48,182,221,0.2)',
    [models.RateCardStatus.TERMINATED]: 'rgba(211,193,235,0.5)',
    [models.RateCardStatus.VERIFIED]: 'rgba(155,200,55,0.4)',
};

export const getRateCardsColumns: () => DataColumnProps<models.RateCard>[] = () => [
    {
        key: 'id',
        caption: 'ID',
        render: (rateCard) => <Text>{ rateCard.id }</Text>,
        grow: 0.4,
        shrink: 0,
        width: 80,
    },
    {
        key: 'rateCardCategory.name',
        caption: 'CATEGORY',
        render: (rateCard) => <Text>{ rateCard.rateCardCategory.name }</Text>,
        grow: 0.4,
        shrink: 0,
        width: 100,
    },
    {
        key: 'effectiveFromDate',
        caption: 'EFFECTIVE FROM',
        render: (rateCard) => <Text>{ `${getDate(rateCard.effectiveFromDate)}` }</Text>,
        grow: 0.5,
        shrink: 0,
        width: 130,
    },
    {
        key: 'effectiveToDate',
        caption: 'EFFECTIVE TO',
        render: (rateCard) => (
            <Text>
                { `${getSpecificDate(rateCard.effectiveToDate || rateCard.operationalEffectiveToDate, 'YYYY') !== '3000'
                    ? getDate(rateCard.effectiveToDate || rateCard.operationalEffectiveToDate)
                    : 'Open-end'}` }
            </Text>
        ),
        grow: 0.5,
        shrink: 0,
        width: 130,
        isAlwaysVisible: true,
    },
    {
        key: 'workUnitType.name',
        caption: 'UNIT TYPE',
        render: (rateCard) => <Text>{ rateCard.workUnitType.name }</Text>,
        grow: 0.4,
        shrink: 0,
        width: 110,
    },
    {
        key: 'unitRate',
        caption: 'NET RATE',
        render: (rateCard) => <Text>{ rateCard?.unitRate ? accounting.formatNumber(rateCard.unitRate, 2, ' ') : '-' }</Text>,
        grow: 0.3,
        shrink: 0,
        width: 80,
        textAlign: 'right',
    },
    {
        key: 'currency.code',
        caption: 'CURRENCY',
        render: (rateCard) => <Text>{ rateCard.currency.code }</Text>,
        grow: 0.3,
        shrink: 0,
        width: 100,
        textAlign: 'center',
    },
    {
        key: 'status.name',
        caption: 'STATUS',
        render: (rateCard) => <Status colorMap={ colorMapStatusRateCardContractors } name={ rateCard.status.name } status={ rateCard.status.key as string } />,
        grow: 0.4,
        shrink: 0,
        width: 120,
    },
];
