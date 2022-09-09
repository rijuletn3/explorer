// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { FC } from 'react';
import { Box, Td, Tr, useColorModeValue, Link } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { PoolBalance } from '../../graphql/models';
import { StakeInfo } from '../Icons';
import Address from '../../components/Address';
import { formatCTSI } from '../../utils/token';
import { userShare } from '../../graphql/hooks/usePoolBalances';
import { useStakingPool } from '../../services/pool';

export interface UserStakingPoolsTableRowProps {
    chainId: number;
    balance: PoolBalance;
    account?: string;
}

const UserStakingPoolsTableRow: FC<UserStakingPoolsTableRowProps> = ({
    chainId,
    account,
    balance,
}) => {
    const borderColor = useColorModeValue('gray.100', 'header');
    const percentFormatter = new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 4,
    });
    const address = balance.pool.id;
    const {
        balance: unstakedBalance,
        stakedShares,
        sharesToAmount,
    } = useStakingPool(address, account);
    const stakedBalance = sharesToAmount(stakedShares);

    return (
        <Tr key={balance.pool.id}>
            <Td borderColor={borderColor}>
                <Address
                    ens
                    address={balance.pool.id}
                    chainId={chainId}
                    truncated
                    borderRadius="full"
                    size="md"
                    bg="blue.50"
                    px="0.5rem"
                    py="0.25rem"
                    color="gray.900"
                    minWidth="120px"
                />
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(unstakedBalance, 2)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {formatCTSI(stakedBalance, 2)} CTSI
            </Td>
            <Td isNumeric borderColor={borderColor}>
                {percentFormatter.format(userShare(balance))}
            </Td>
            <Td
                isNumeric
                borderColor={borderColor}
                position={['sticky', 'sticky', 'initial', 'initial']}
                top={0}
                right={0}
                backgroundColor={['white', 'white', 'transparent']}
                padding={0}
            >
                <Box
                    shadow={['md', 'md', 'none', 'none']}
                    padding={[0, 0, 8, 8]}
                    minHeight={['71px', '71px', 'auto', 'auto']}
                    width={['80px', '80px', 'auto', 'auto']}
                    display={['flex', 'flex', 'block', 'block']}
                    alignItems="center"
                    justifyContent="center"
                    ml="auto"
                >
                    <Link href={`/stake/${balance.pool.id}`} mr={[0, 0, 3]}>
                        <StakeInfo w={8} h={8} />
                    </Link>
                </Box>
            </Td>
        </Tr>
    );
};

export default UserStakingPoolsTableRow;
