// Copyright (C) 2021-2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { EditIcon } from '@chakra-ui/icons';
import {
    Box,
    Text,
    Flex,
    HStack,
    Stack,
    useColorModeValue,
    Button,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react';

import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC } from 'react';
import { NodeBalanceModal } from './modals/NodeBalanceModal';
import { NodeRetireModal } from './modals/NodeRetireModal';

export interface INodeInfoSection {
    address: string;
    userBalance: BigNumber;
    nodeBalance: BigNumber;
    onRetire: () => void;
    onDeposit: (funds: BigNumber) => void;
}

export const NodeInfoSection: FC<INodeInfoSection> = ({
    address,
    userBalance,
    nodeBalance,
    onRetire,
    onDeposit,
}) => {
    // dark mode support
    const bg = useColorModeValue('white', 'gray.800');

    const retireModal = useDisclosure();
    const depositModal = useDisclosure();

    const toETH = (value: BigNumber) => {
        const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
        };

        const numberFormat = new Intl.NumberFormat('en-US', options);
        const valueFormatted = numberFormat.format(
            value ? parseFloat(formatUnits(value, 18)) : 0
        );

        return valueFormatted;
    };

    const onConfirmRetire = () => {
        retireModal.onClose();
        onRetire();
    };

    return (
        <>
            <Box
                bg={bg}
                borderRadius="lg"
                shadow="sm"
                px={{ base: 2, lg: 4, xl: 8 }}
                py={{ base: 2, sm: 4, lg: 8 }}
                mb={6}
            >
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                    p={2}
                >
                    <Text>Address</Text>
                    <Text isTruncated>{address}</Text>
                </Stack>
                <Stack
                    spacing={4}
                    justifyContent="space-between"
                    alignContent="flex-start"
                    direction={{ base: 'column', md: 'row' }}
                    p={2}
                >
                    <Text>Deposit Funds</Text>
                    <HStack spacing={4} alignItems="flex-end">
                        <Box>
                            <Flex align="baseline">
                                <Text>{toETH(nodeBalance)}</Text>
                                <Text pl={1}>ETH</Text>
                            </Flex>
                        </Box>
                        <Box alignSelf="flex-end">
                            <IconButton
                                aria-label="Edit"
                                size="sm"
                                icon={<EditIcon />}
                                variant="ghost"
                                onClick={depositModal.onOpen}
                            />
                        </Box>
                    </HStack>
                </Stack>
            </Box>
            <Button
                onClick={retireModal.onOpen}
                bgColor={bg}
                w={{ base: '100%', md: 'auto' }}
                minW="15rem"
                me={2}
            >
                RETIRE NODE
            </Button>

            <NodeRetireModal
                address={address}
                disclosure={retireModal}
                onConfirmRetire={onConfirmRetire}
            />

            <NodeBalanceModal
                disclosure={depositModal}
                userBalance={userBalance}
                onDepositFunds={onDeposit}
            />
        </>
    );
};
