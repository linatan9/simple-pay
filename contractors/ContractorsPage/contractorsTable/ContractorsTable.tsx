import { DataTableMods } from '@epam/loveship';
import {
    DataSourceState, IEditable, LazyDataSourceApiRequest, useLazyDataSource,
} from '@epam/uui';
import React from 'react';
import { TableFilter } from '../../../../components/table';
import { getApiBySettingsTableKey } from '../../../../helpers/Helpers';
import { KEY_SETTINGS, RsqlOperators, SearchField } from '../../../../server/apiModels';
import * as models from '../../../../server/models';
import { svc } from '../../../../services';
import { getContractorsColumns } from './columns';
import { getContractorsFilters } from './filters';
import { ListTable } from '../../../../components/table/ListTable';

const searchFields: SearchField[] = [
    {
        fieldName: 'name',
        operator: RsqlOperators.LIKE,
    },
    {
        fieldName: 'employee.manager.name',
        operator: RsqlOperators.LIKE,
    },
    {
        fieldName: 'employee.jobTitle.name',
        operator: RsqlOperators.LIKE,
    },
];

const api = async (r: LazyDataSourceApiRequest<models.ContractorList, any, any>) => getApiBySettingsTableKey<models.ContractorList>(KEY_SETTINGS.CONTRACTORS_TABLE, r, searchFields);

const getId = (p: models.ContractorList) => p.id;

export interface ContractorsTableProps extends IEditable<DataSourceState<TableFilter>>, DataTableMods {
}

export const ContractorsTable: React.FC<ContractorsTableProps> = (props) => {
    const isManager = svc.uuiApp.security.groups.includes('MANAGER');
    const dataSource = useLazyDataSource<models.ContractorList, any, any>({
        api,
        getId,
    }, []);

    const view = dataSource.useView(props.value, props.onValueChange, {
        getRowOptions: (item) => ({
            link: { pathname: isManager ? '' : `/contractors/${item.id}/profile` },
        }),
    });

    return (
        <ListTable
            { ...props }
            { ...view.getListProps() }
            getRows={ view.getVisibleRows }
            settingsKey={ KEY_SETTINGS.CONTRACTORS_TABLE }
            filters={ getContractorsFilters() }
            columns={ getContractorsColumns() }
            allowColumnsResizing
            searchTooltipContent="contractor, manager, job title"
        />
    );
};
