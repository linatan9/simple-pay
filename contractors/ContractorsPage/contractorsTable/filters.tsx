import { LazyDataSourceApiRequest } from '@epam/uui';
import { FilterModel } from '../../../../components/filter';
import { getDate } from '../../../../helpers/Helpers';
import { RsqlOperators, SearchField } from '../../../../server/apiModels';
import * as models from '../../../../server/models';
import { svc } from '../../../../services';

export const getContractorsFilters: () => FilterModel[] = () => ([
    {
        key: 'id',
        name: 'Contractor',
        type: 'MULTI',
        getName: (i) => i.entity.name,
        getItems: async (dataSourceProps: LazyDataSourceApiRequest<any, any, any>, filter: any) => {
            const searchFields: SearchField[] = [{ fieldName: 'name', operator: RsqlOperators.LIKE }];
            const res = await svc.api.contractors.getContractorsGroupsWithOffset<models.ContractorList>('id,name', filter,
                dataSourceProps.range.from, dataSourceProps.range.count, dataSourceProps.search, searchFields, [{ field: 'name', direction: 'asc' }]);
            return { items: res.content, count: res.totalElements };
        },
    },
    {
        key: 'contractorVendors.vendor.name',
        name: 'Vendor',
        type: 'MULTI',
        getName: (i) => i.entity.name,
        getItems: async (dataSourceProps: LazyDataSourceApiRequest<any, any, any>, filter: any) => {
            const searchFields: SearchField[] = [{ fieldName: 'contractorVendors.vendor.name', operator: RsqlOperators.LIKE }];
            const res = await svc.api.contractors.getContractorsGroupsWithOffset<models.ContractorList>('contractorVendors.vendor.name', filter,
                dataSourceProps.range.from, dataSourceProps.range.count, dataSourceProps.search, searchFields, [{ field: 'contractorVendors.vendor.name', direction: 'asc' }]);
            return { items: res.content, count: res.totalElements };
        },
    },
    {
        key: 'employee.manager.name',
        name: 'Manager',
        type: 'MULTI',
        getName: (i) => i.entity.name,
        getItems: async (dataSourceProps: LazyDataSourceApiRequest<any, any, any>, filter: any) => {
            const searchFields: SearchField[] = [{ fieldName: 'employee.manager.name', operator: RsqlOperators.LIKE }];
            const res = await svc.api.contractors.getContractorsGroupsWithOffset<models.ContractorList>('employee.manager.name', filter,
                dataSourceProps.range.from, dataSourceProps.range.count, dataSourceProps.search, searchFields);
            return { items: res.content, count: res.totalElements };
        },
    },
    {
        key: 'employee.jobTitle.name',
        name: 'Job title',
        type: 'MULTI',
        getName: (i) => i.entity.name,
        getItems: async (dataSourceProps: LazyDataSourceApiRequest<any, any, any>, filter: any) => {
            const searchFields: SearchField[] = [{ fieldName: 'employee.jobTitle.name', operator: RsqlOperators.LIKE }];
            const res = await svc.api.contractors.getContractorsGroupsWithOffset<models.ContractorList>('employee.jobTitle.name', filter,
                dataSourceProps.range.from, dataSourceProps.range.count, dataSourceProps.search, searchFields);
            return { items: res.content, count: res.totalElements };
        },
    },
    {
        key: 'employee.startDate',
        name: 'Start date',
        type: 'DATE',
        dateValueFormat: 'YYYY-MM-DD',
        getName: (i) => getDate(i.entity),
        searchPosition: 'none',
    },
    {
        key: 'employee.exitDate',
        name: 'Exit date',
        type: 'DATE',
        dateValueFormat: 'YYYY-MM-DD',
        getName: (i) => getDate(i.entity),
        searchPosition: 'none',
    },
]);
