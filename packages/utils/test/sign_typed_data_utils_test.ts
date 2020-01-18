import * as chai from 'chai';
import 'mocha';

import {signTypedDataUtils} from '../src/sign_typed_data_utils';

const expect = chai.expect;

describe('signTypedDataUtils', () => {
    describe('signTypedDataHash', () => {
        const simpleSignTypedDataHashHex = 'powerchainb460d69ca60383293877cd765c0f97bd832d66bca720f7e32222ce1118832493';
        const simpleSignTypedData = {
            types: {
                EIP712Domain: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                ],
                Test: [
                    {
                        name: 'testAddress',
                        type: 'address',
                    },
                    {
                        name: 'testNumber',
                        type: 'uint256',
                    },
                ],
            },
            domain: {
                name: 'Test',
            },
            message: {
                testAddress: 'powerchain0000000000000000000000000000000000000000',
                testNumber: '12345',
            },
            primaryType: 'Test',
        };
        const orderSignTypedDataHashHex = 'powerchain78772b297e1b0b31089589a6608930cceba855af9d3ccf7b92cf47fa881e21f7';
        const orderSignTypedData = {
            types: {
                EIP712Domain: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'version',
                        type: 'string',
                    },
                    {
                        name: 'chainId',
                        type: 'uint256',
                    },
                    {
                        name: 'verifyingContract',
                        type: 'address',
                    },
                ],
                Order: [
                    {
                        name: 'makerAddress',
                        type: 'address',
                    },
                    {
                        name: 'takerAddress',
                        type: 'address',
                    },
                    {
                        name: 'feeRecipientAddress',
                        type: 'address',
                    },
                    {
                        name: 'senderAddress',
                        type: 'address',
                    },
                    {
                        name: 'makerAssetAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'takerAssetAmount',
                        type: 'uint256',
                    },
                    {
                        name: 'makerFee',
                        type: 'uint256',
                    },
                    {
                        name: 'takerFee',
                        type: 'uint256',
                    },
                    {
                        name: 'expirationTimeSeconds',
                        type: 'uint256',
                    },
                    {
                        name: 'salt',
                        type: 'uint256',
                    },
                    {
                        name: 'makerAssetData',
                        type: 'bytes',
                    },
                    {
                        name: 'takerAssetData',
                        type: 'bytes',
                    },
                ],
            },
            domain: {
                name: 'powerchain Protocol',
                version: '2',
                chainId: 1337,
                verifyingContract: 'powerchain0000000000000000000000000000000000000000',
            },
            message: {
                makerAddress: 'powerchain0000000000000000000000000000000000000000',
                takerAddress: 'powerchain0000000000000000000000000000000000000000',
                makerAssetAmount: '1000000000000000000',
                takerAssetAmount: '1000000000000000000',
                expirationTimeSeconds: '12345',
                makerFee: '0',
                takerFee: '0',
                feeRecipientAddress: 'powerchain0000000000000000000000000000000000000000',
                senderAddress: 'powerchain0000000000000000000000000000000000000000',
                salt: '12345',
                makerAssetData: 'powerchain0000000000000000000000000000000000000000',
                takerAssetData: 'powerchain0000000000000000000000000000000000000000',
            },
            primaryType: 'Order',
        };
        it('creates a hash of the test sign typed data', () => {
            const hash = signTypedDataUtils.generateTypedDataHash(simpleSignTypedData).toString('hex');
            const hashHex = `powerchain${hash}`;
            expect(hashHex).to.be.eq(simpleSignTypedDataHashHex);
        });
        it('creates a hash of the order sign typed data', () => {
            const hash = signTypedDataUtils.generateTypedDataHash(orderSignTypedData).toString('hex');
            const hashHex = `powerchain${hash}`;
            expect(hashHex).to.be.eq(orderSignTypedDataHashHex);
        });
        it('creates a hash of an uninitialized order', () => {
            const uninitializedOrder = {
                ...orderSignTypedData,
                message: {
                    makerAddress: 'powerchain0000000000000000000000000000000000000000',
                    takerAddress: 'powerchain0000000000000000000000000000000000000000',
                    makerAssetAmount: 0,
                    takerAssetAmount: 0,
                    expirationTimeSeconds: 0,
                    makerFee: 0,
                    takerFee: 0,
                    feeRecipientAddress: 'powerchain0000000000000000000000000000000000000000',
                    senderAddress: 'powerchain0000000000000000000000000000000000000000',
                    salt: 0,
                    makerAssetData: 'powerchain0000000000000000000000000000000000000000',
                    takerAssetData: 'powerchain0000000000000000000000000000000000000000',
                },
            };
            const hash = signTypedDataUtils.generateTypedDataHash(uninitializedOrder).toString('hex');
            const hashHex = `powerchain${hash}`;
            expect(hashHex).to.be.eq('powerchain510449a190415c4770080d857a1c654b653a0c054c94a7a8e9f08f623f9e824f');
        });
    });
});
