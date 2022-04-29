// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import {
    Button,
    InputGroup,
    Input,
    InputRightElement,
    FormControl,
    FormLabel,
    FormHelperText,
    FormErrorMessage,
    Stack,
} from '@chakra-ui/react';
import { Step, StepActions, StepBody, StepStatus } from '../../Step';
import { CommonStepProps } from './interfaces';

const { ACTIVE, NOT_ACTIVE } = StepStatus;

const HireNode = ({ stepNumber, inFocus }: CommonStepProps) => {
    return (
        <Step
            title="Set Allowance"
            subtitle="Final steps to run your node."
            stepNumber={stepNumber}
            status={inFocus ? ACTIVE : NOT_ACTIVE}
        >
            <StepBody>
                <FormControl pr={{ base: 0, md: '20vw' }} my={4}>
                    <FormLabel htmlFor="allowance_amount" fontWeight="medium">
                        Enter the allowance
                    </FormLabel>
                    <InputGroup>
                        <Input id="allowance_amount" type="number" size="lg" />
                        <InputRightElement
                            children="CTSI"
                            m={1}
                            mr={2}
                            color="gray"
                            fontSize={12}
                        />
                    </InputGroup>
                    <FormHelperText color="gray" fontSize={14}>
                        This is going to be the maximum amount of CTSI that
                        Cartesi’s staking contract will be able to receive from
                        your personal account.
                    </FormHelperText>
                    <FormErrorMessage></FormErrorMessage>
                </FormControl>
            </StepBody>
            <StepActions>
                <Stack direction={{ base: 'column', md: 'row' }}>
                    <Button
                        minWidth={{ base: '100%', md: '10rem' }}
                        colorScheme="blue"
                        onClick={() => console.log('go somewhere')}
                    >
                        RUN YOUR NODE
                    </Button>
                </Stack>
            </StepActions>
        </Step>
    );
};

export default HireNode;