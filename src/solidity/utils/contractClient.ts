import contentCreatorMetaData from '../artifacts/contracts/AddContent.sol/ContentCreator.json';
import creatorRegistryMetaData from '../artifacts/contracts/AddCreator.sol/CreatorRegistry.json';
import { publicConfig } from '../../config/public';

const { abi: contentCreatorABI } = contentCreatorMetaData;
const { abi: creatorRegistryABI } = creatorRegistryMetaData;
const { SOLIDITY_CONTENT_CREATOR_ABI: contentCreatorAddress } = publicConfig;
const { SOLIDITY_REGISTRY_CREATOR_ABI: creatorRegistryAddress } = publicConfig;

export {
	contentCreatorABI,
	creatorRegistryABI,
	contentCreatorAddress,
	creatorRegistryAddress,
};
