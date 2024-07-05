import { randomBytes } from 'crypto';
import { getAddress } from 'ethers';

export const makeRandomAddress = (): string => {
  return getAddress(randomHex(20));
};

function randomHex(size: number) {
  return '0x' + randomBytes(size).toString('hex');
}
