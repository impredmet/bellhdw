import { Psbt } from "belcoinjs-lib";

export type Base58String = string;

export interface PrivateKeyOptions {
  seed: string;
}

export interface PublicKeyOptions
  extends Omit<PrivateKeyOptions, "privateKey"> {
  xkey: Base58String;
  publicKey: Uint8Array;
}

interface SerializedBase {
  addressType: AddressType;
}

export interface SerializedHDKey extends SerializedBase {
  seed: string;
  numberOfAccounts?: number;
}

export interface SerializedSimpleKey extends SerializedBase {
  privateKey: string;
}

export type Hex = string;

export interface ToSignInput {
  index: number;
  publicKey: string;
  sighashTypes?: number[];
}

export enum AddressType {
  P2PKH,
  P2WPKH,
  P2TR,
  P2SH_P2WPKH,
  M44_P2WPKH,
  M44_P2TR,
}

export type Keyring<State> = {
  addressType?: AddressType;
  generate?: (seed: Uint8Array, entropy: Uint8Array) => Keyring<State>;

  getAccounts(): Hex[];
  addAccounts?(number: number): string[];
  serialize(): State;
  deserialize(state: State): Keyring<State>;
  exportAccount(address: Hex, options?: Record<string, unknown>): string;
  exportPublicKey(address: Hex): string;
  verifyMessage(address: Hex, text: string, sig: string): boolean;
  signPsbt(psbt: Psbt, inputs: ToSignInput[]): void;
  signMessage(address: Hex, message: Hex, seed: Uint8Array): string;
  signPersonalMessage(address: Hex, message: Hex, seed: Uint8Array): string;
  signTypedData(
    address: Hex,
    typedData: Record<string, unknown>,
    seed: Uint8Array
  ): string;
};

export const DISALLOWED_CHILD_METHODS: (keyof Keyring<any>)[] = [
  "deserialize",
  "serialize",
  "getAccounts",
  "generate",
];