import React from 'react';
import {
    DataTable, Text, FlexRow, ScrollBars,
} from '@epam/loveship';
import { DataRowOptions, DataSourceState, useArrayDataSource } from '@epam/uui';
import { TableFilter } from '../../../components/table';
import { useValue } from '../../../hooks';
import * as models from '../../../server/models';
import css from './ContractorDetailsPage.module.scss';
import { getRateCardsColumns } from './contractorsRateCardTableColumns';

interface ContractorsRateCardTableProps {
    rateCards: models.RateCard[];
    contractorId: number;
    isSbc: boolean;
}
export const ContractorsRateCardTable: React.FC<ContractorsRateCardTableProps> = (props) => {
    const table = useValue<DataSourceState<TableFilter>>({
        filter: { page: 0, size: 15 }, sorting: [], visibleCount: 15, topIndex: 0,
    });

    const dataSource = useArrayDataSource<models.RateCard, any, any>({
        items: props.rateCards || [],
        getId: (p) => p.id,
    }, [props.rateCards]);
    // eslint-disable-next-line
    const rowOptions = (rateCard: models.RateCard): DataRowOptions<models.RateCard, number> => props.isSbc ? ({
        link: { pathname: `/rateCards/${rateCard.id}`, search: `contractorId=${props.contractorId}` },
    }) : ({});

    const view = dataSource.useView(table.value, table.onValueChange, {
        getRowOptions: rowOptions,
    });
    return (
        <div className={ css.contractorsRateCards }>
            <FlexRow padding="24">
                <Text font="sans-semibold">Rate cards</Text>
            </FlexRow>
            <div className={ css.contractorsRateCardsTableContainer }>
                <ScrollBars>
                    <DataTable
                        { ...table }
                        { ...view.getListProps() }
                        getRows={ view.getVisibleRows }
                        border="night300"
                        columns={ getRateCardsColumns() }
                        headerTextCase="upper"
                    />
                </ScrollBars>
            </div>
        </div>
    );
};
