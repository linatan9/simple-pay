import React from 'react';
import { DataSourceState } from '@epam/uui';
import { Page } from '../../../components/layout';
import { useValue } from '../../../hooks';
import { ContractorsTable } from './contractorsTable/ContractorsTable';
import { TableFilter } from '../../../components';

export function Contractors() {
    const table = useValue<DataSourceState<TableFilter>>({
        filter: { page: 0, size: 15 }, sorting: [{ field: 'name', direction: 'asc' }], visibleCount: 15, topIndex: 0,
    });

    return (
        <Page>
            <ContractorsTable { ...table } />
        </Page>
    );
}
