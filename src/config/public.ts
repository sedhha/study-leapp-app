import { z } from 'zod';

const ConfigSchema = z.object({
	CONTRACT_TX_ID: z.string(),
	PARTICLE_PROJECT_ID: z.string(),
	PARTICLE_CLIENT_KEY: z.string(),
	PARTICLE_APP_ID: z.string(),
	SOLIDITY_CONTENT_CREATOR_ABI: z.string(),
	SOLIDITY_REGISTRY_CREATOR_ABI: z.string(),
});

type ConfigSchema = z.infer<typeof ConfigSchema>;

const publicConfig: ConfigSchema = {
	CONTRACT_TX_ID: process.env.NEXT_PUBLIC_CONTRACT_TX_ID as string,
	PARTICLE_PROJECT_ID: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID as string,
	PARTICLE_CLIENT_KEY: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY as string,
	PARTICLE_APP_ID: process.env.NEXT_PUBLIC_PARTICLE_APP_ID as string,
	SOLIDITY_CONTENT_CREATOR_ABI: process.env
		.NEXT_PUBLIC_CONTRACT_CREATOR_ABI as string,
	SOLIDITY_REGISTRY_CREATOR_ABI: process.env
		.NEXT_PUBLIC_REGISTRY_CREATOR_ABI as string,
};

ConfigSchema.parse(publicConfig);

export { publicConfig };
