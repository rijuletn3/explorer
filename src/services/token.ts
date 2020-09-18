// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { CartesiToken } from '../contracts/CartesiToken';
import { CartesiTokenFactory } from '../contracts/CartesiTokenFactory';
import { networks } from '../utils/networks';
import { BigNumber, BigNumberish } from 'ethers';
import { formatUnits, parseUnits } from '@ethersproject/units';

export const useCartesiToken = () => {
    const { library, chainId } = useWeb3React<Web3Provider>();
    const [cartesiToken, setCartesiToken] = useState<CartesiToken>();

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // create the CartesiToken, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            const tokenArtifact = require(`@cartesi/token/deployments/${network}/CartesiToken.json`);
            const address =
                tokenArtifact?.address ||
                tokenArtifact?.networks[chainId]?.address;
            if (!address) {
                setError(`CartesiToken not deployed at network '${chainId}'`);
                return;
            }
            console.log(
                `Attaching CartesiToken to address '${address}' deployed at network '${chainId}'`
            );
            setCartesiToken(
                CartesiTokenFactory.connect(address, library.getSigner())
            );
        }
    }, [library, chainId]);

    const balanceOf = async (address: string): Promise<BigNumber> => {
        if (cartesiToken) {
            try {
                setError('');
                return cartesiToken.balanceOf(address);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const allowance = async (
        owner: string,
        spender: string
    ): Promise<BigNumber> => {
        if (cartesiToken) {
            try {
                setError('');
                return cartesiToken.allowance(owner, spender);
            } catch (e) {
                setError(e.message);
            }
        }
    };

    const approve = async (spender: string, amount: BigNumberish) => {
        if (cartesiToken) {
            try {
                setError('');
                setSubmitting(true);

                // send transaction
                const transaction = await cartesiToken.approve(spender, amount);

                // wait for confirmation
                const receipt = await transaction.wait(1);

                setSubmitting(false);
            } catch (e) {
                setError(e.message);
                setSubmitting(false);
            }
        }
    };

    const parseCTSI = (amount: BigNumberish): BigNumber => {
        return parseUnits(amount.toString(), 18);
    }

    const formatCTSI = (amount: BigNumberish): string => {
        return formatUnits(amount, 18);
    }

    return {
        cartesiToken,
        submitting,
        error,
        balanceOf,
        allowance,
        approve,
        parseCTSI,
        formatCTSI
    };
};