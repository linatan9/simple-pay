import { Text } from '@epam/loveship';
import { DataColumnProps } from '@epam/uui';
import React from 'react';
import * as models from '../../../../server/models';
import { getDate } from '../../../../helpers/Helpers';

export const getContractorsColumns: () => DataColumnProps<models.ContractorList>[] = () => [
    {
        key: 'name',
        caption: 'CONTRACTOR',
        render: (contractor) => <Text>{ contractor.name }</Text>,
        grow: 1,
        shrink: 0,
        width: 200,
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'email',
        caption: 'EMAIL ADDRESS',
        render: (contractor) => <Text>{ contractor.email }</Text>,
        grow: 1,
        shrink: 0,
        width: 300,
        isAlwaysVisible: true,
    },
    {
        key: 'contractorVendors.vendor.name',
        caption: 'VENDOR',
        render: (contractor) => <Text>{ contractor?.vendors.length ? contractor.vendors[0].name : '-' }</Text>,
        grow: 1,
        shrink: 0,
        width: 200,
        isSortable: true,
    },
    {
        key: 'employee.manager.name',
        caption: 'MANAGER',
        render: (contractor) => <Text>{ contractor?.manager?.name || '-' }</Text>,
        grow: 1,
        shrink: 0,
        width: 200,
        isSortable: true,
        isAlwaysVisible: true,
    },
    {
        key: 'employee.jobTitle.name',
        caption: 'JOB TITLE',
        render: (contractor) => <Text>{ contractor?.jobTitle?.name || '-' }</Text>,
        grow: 1,
        shrink: 0,
        width: 200,
        isSortable: true,
    },
    {
        key: 'employee.startDate',
        caption: 'HIRE DATE',
        render: (contractor) => <Text>{ contractor.startDate ? getDate(contractor.startDate) : '-' }</Text>,
        grow: 1,
        shrink: 0,
        width: 100,
        isSortable: true,
    },
    {
        key: 'employee.exitDate',
        caption: 'TERMINATION DATE',
        render: (contractor) => <Text>{ contractor.exitDate ? getDate(contractor.exitDate) : '-' }</Text>,
        grow: 1,
        shrink: 0,
        width: 160,
        isSortable: true,
    },
    {
        key: 'actions',
        caption: '',
        render: () => null,
        grow: 0,
        shrink: 0,
        width: 58,
        textAlign: 'center',
        fix: 'right',
    },
];
