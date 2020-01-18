import {artifacts as erc1155Artifacts} from '@powerchain/contracts-erc1155';
import {artifacts as erc20Artifacts} from '@powerchain/contracts-erc20';
import {artifacts as erc721Artifacts} from '@powerchain/contracts-erc721';

export const dependencyArtifacts = {
    ...erc20Artifacts,
    ...erc721Artifacts,
    ...erc1155Artifacts,
};
