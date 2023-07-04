import { z } from 'zod';

const ConfigSchema = z.object({
	JWT_SECRET: z.string(),
	BACKEND_API_KEY: z.string(),
	SUPABASE_PROJECT_ID: z.string(),
	SUPABASE_SERVICE_ROLE: z.string(),
	CONTRACT_TX_ID: z.string(),
	PARTICLE_AUTH_USERNAME: z.string(),
	PARTICLE_AUTH_PASSWORD: z.string(),
	CLOUD_VISION_API_URL: z.string(),
});

type ConfigSchema = z.infer<typeof ConfigSchema>;

const config: ConfigSchema = {
	JWT_SECRET: process.env.JWT_SECRET as string,
	BACKEND_API_KEY: process.env.BACKEND_API_KEY as string,
	SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID as string,
	SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE as string,
	CONTRACT_TX_ID: process.env.NEXT_PUBLIC_CONTRACT_TX_ID as string,
	PARTICLE_AUTH_USERNAME: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID as string,
	PARTICLE_AUTH_PASSWORD: process.env.SERVER_KEY as string,
	CLOUD_VISION_API_URL: process.env.CLOUD_VISION_URL as string,
};

ConfigSchema.parse(config);

export { config };
