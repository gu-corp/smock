/* Imports: External */
import { Fragment, Interface, JsonFragment } from '@ethersproject/abi';
import { Signer } from '@ethersproject/abstract-signer';
import { Address } from '@nomicfoundation/ethereumjs-util';
import { BaseContract, ContractFactory, ethers, Provider } from 'ethers';
import { EditableStorageLogic } from './logic/editable-storage-logic';
import { ReadableStorageLogic } from './logic/readable-storage-logic';
import { WatchableFunctionLogic } from './logic/watchable-function-logic';

type Abi = ReadonlyArray<
  Fragment | Pick<JsonFragment, 'name' | 'type' | 'anonymous' | 'payable' | 'constant' | 'stateMutability' | 'inputs' | 'outputs'> | string
>;
export type FakeContractSpec = { abi?: Abi; interface?: Interface } | Abi | ethers.Interface | string;

export interface FakeContractOptions {
  provider?: Provider;
  address?: string;
}

export type ProgrammedReturnValue = any;

export interface SmockVMManager {
  putContractCode: (address: Address, code: Buffer) => Promise<void>;
  getContractStorage: (address: Address, slotHash: Buffer) => Promise<Buffer>;
  putContractStorage: (address: Address, slotHash: Buffer, slotValue: Buffer) => Promise<void>;
}

export interface WatchableContractFunction {
  _watchable: WatchableFunctionLogic;
  atCall: (index: number) => WatchableFunctionLogic;
  getCall: (index: number) => ContractCall;
}

export interface ContractCall {
  args: unknown[] | string;
  nonce: number;
  target: string;
  value: bigint;
  delegatedFrom?: string;
}

export interface SetVariablesType {
  [variablesName: string]: any;
}

export type WhenCalledWithChain = {
  returns: (value?: ProgrammedReturnValue) => void;
  reverts: (reason?: string) => void;
};

export interface ProgrammableContractFunction extends WatchableContractFunction {
  returns: (value?: ProgrammedReturnValue) => void;
  returnsAtCall: (index: number, value?: ProgrammedReturnValue) => void;
  reverts: (reason?: string) => void;
  revertsAtCall: (index: number, reason?: string) => void;
  whenCalledWith: (...args: unknown[]) => WhenCalledWithChain;
  reset: () => void;
  (...args: any[]): Promise<any>;
}

export type SmockContractBase<T extends BaseContract> = Omit<BaseContract, 'connect'> &
  Omit<T, 'connect'> & {
    wallet: Signer;
    fallback: ProgrammableContractFunction;
  };

export type FakeContract<T extends BaseContract = BaseContract> = SmockContractBase<T> & {
  connect: (...args: Parameters<T['connect']>) => FakeContract<T>;
} & {
  [Property in Parameters<T['interface']['getFunction']>[0]]: ProgrammableContractFunction;
};

export type MockContract<T extends BaseContract = BaseContract> = SmockContractBase<T> & {
  connect: (...args: Parameters<T['connect']>) => MockContract<T>;
  setVariable: EditableStorageLogic['setVariable'];
  setVariables: EditableStorageLogic['setVariables'];
  getVariable: ReadableStorageLogic['getVariable'];
} & {
  [Property in Parameters<T['interface']['getFunction']>[0]]: ProgrammableContractFunction;
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type MockContractFactory<F extends ContractFactory> = Omit<F, 'deploy' | 'connect'> & {
  connect: (...args: Parameters<F['connect']>) => MockContractFactory<F>;
  deploy: (...args: Parameters<F['deploy']>) => Promise<MockContract<ThenArg<ReturnType<F['deploy']>>>>;
};

export interface EVMResult {}
export interface Message {
  to?: Address;
  codeAddress?: Address;
  value: bigint;
  data: Buffer;
  caller: Address;
}
export interface VM {
  stateManager: SmockVMManager;
  evm: {
    events: any;
  };
}

export type CallOverrideCallback = (address: Buffer, data: Buffer) => Promise<{ result: Buffer; shouldRevert: boolean } | undefined>;

export interface EDRProvider {
  _setCallOverrideCallback(callback: CallOverrideCallback): void;
  _node: {
    _vm: VM;
  };
}
