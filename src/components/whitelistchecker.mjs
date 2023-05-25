import { ethers } from 'ethers';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from "@ethersproject/keccak256";


const whitelist = [
    '0xce1f70bFE140b21451d67fDeD9cb689f7B7d7D37',
    '0x56E13D06C6b8cb04A59c75bc81560255a12EB0e6',
    '0x2289df3f3E8a7aA856DE51b756840BE7677Ee7dc',
    '0x2E7D80e610a9fD15a220C23F0254bb3BbC17aC15',
    '0x23e1FB6c3412195AC2A9410512491F1D89eD2B29',
    '0x358FD9C96D9d84D53A919F88Db377573E1D4da82',

]
const leafNodes = whitelist.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });


export async function getRootHash() {

    const rootHash = merkleTree.getRoot();
    console.log('Whitelist Merkle Tree\n', merkleTree.toString());
    console.log("Root Hash: ", rootHash);
}

export function getProof(userAddress) {
    const claimingAddress = keccak256(userAddress);

    const hexProof = merkleTree.getHexProof(claimingAddress);
    return hexProof;

}

export async function checkWhitelist(userAddress) {


    const claimingAddress = keccak256(userAddress);
    const hexProof = merkleTree.getHexProof(claimingAddress);
    const rootHash = merkleTree.getRoot();

    const isWhitelisted = merkleTree.verify(hexProof, claimingAddress, rootHash);
    return isWhitelisted;
}