// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PoolPerformanceTable, {
    PoolPerformanceTableProps,
} from '../../../../src/components/stake/tables/PoolPerformanceTable';
import stakingPoolsData from '../../../../src/stories/stake/tables/stakingPoolsData';
import { withChakraTheme } from '../../../test-utilities';
import { StakingPool, StakingPoolSort } from '../../../../src/graphql/models';

jest.mock('@chakra-ui/react', () => {
    const originalModule = jest.requireActual('@chakra-ui/react');
    return {
        __esModule: true,
        ...originalModule,
        useBreakpointValue: () => 'Stake/Info',
    };
});

const defaultProps = {
    account: '0x07b41c2b437e69dd1523bf1cff5de63ad9bb3dc6',
    chainId: 5,
    loading: false,
    sort: 'commissionPercentage' as StakingPoolSort,
    data: stakingPoolsData as unknown as StakingPool[],
    onSort: () => undefined,
};

const Component =
    withChakraTheme<PoolPerformanceTableProps>(PoolPerformanceTable);

describe('Pool Performance Table', () => {
    const renderComponent = (props) => render(<Component {...props} />);

    it('Should have required columns', () => {
        renderComponent(defaultProps);
        expect(screen.getByText('Pool Address')).toBeInTheDocument();
        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('Total Staked')).toBeInTheDocument();
        expect(screen.getByText('Total Rewards')).toBeInTheDocument();
        expect(screen.getByText('Configured Commission')).toBeInTheDocument();
        expect(screen.getByText('Accrued Commission')).toBeInTheDocument();
        expect(screen.getByText('Stake/Info')).toBeInTheDocument();
    });

    it('should sort by total users', () => {
        let sort = null;
        renderComponent({
            ...defaultProps,
            onSort: (nextSort) => {
                sort = nextSort;
            },
        });

        const button = screen.getByText('Total Users').closest('button');
        fireEvent.click(button);

        expect(sort).toBe('totalUsers');
    });

    it('should sort by total staked', () => {
        let sort = null;
        renderComponent({
            ...defaultProps,
            onSort: (nextSort) => {
                sort = nextSort;
            },
        });

        const button = screen.getByText('Total Staked').closest('button');
        fireEvent.click(button);

        // expect(button).toBe(null);
        expect(sort).toBe('amount');
    });

    it('should sort by accrued commission', () => {
        let sort = null;
        renderComponent({
            ...defaultProps,
            onSort: (nextSort) => {
                sort = nextSort;
            },
        });

        const button = screen.getByText('Accrued Commission').closest('button');
        fireEvent.click(button);

        expect(sort).toBe('commissionPercentage');
    });

    it('should display loading', () => {
        renderComponent({
            ...defaultProps,
            loading: true,
        });

        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should display no items', () => {
        renderComponent({
            ...defaultProps,
            data: [],
        });

        expect(screen.getByText('No items')).toBeInTheDocument();
    });

    it('should display some items', () => {
        renderComponent({
            ...defaultProps,
        });

        const rows = screen.getAllByTestId('pool-performance-table-row');

        expect(rows?.length).toBe(stakingPoolsData.length);
    });

    it('should display sort icon next to total users column', () => {
        renderComponent({
            ...defaultProps,
            sort: 'totalUsers',
        });

        const icon = screen
            .getByText('Total Users')
            .closest('th')
            .querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('should display sort icon next to total staked column', () => {
        renderComponent({
            ...defaultProps,
            sort: 'amount',
        });

        const icon = screen
            .getByText('Total Staked')
            .closest('th')
            .querySelector('svg');
        expect(icon).toBeInTheDocument();
    });

    it('should display sort icon next to commission  percentage column', () => {
        renderComponent({
            ...defaultProps,
            sort: 'commissionPercentage',
        });

        const icon = screen
            .getByText('Accrued Commission')
            .closest('th')
            .querySelector('svg');
        expect(icon).toBeInTheDocument();
    });
});
