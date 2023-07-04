import { config } from '@@/config/config';
import axios from 'axios';
import admin from '@@/server/supabase';
import { tables } from '@@/server/supabase/tables';

// const getResponseFromCache = async (key: string): Promise<string | void> =>
// 	admin
// 		.from(tables.cache.name)
// 		.select(tables.cache.columns.value)
// 		.eq(tables.cache.columns.key, key)
// 		.then(({ data, error }) => {
// 			console.log('Data = ', data, error);
// 			if (error || !data.length) return;
// 			return (data[0] as unknown as { value: string }).value;
// 		});

const imageToText = async (b64String: string): Promise<string | void> => {
	const body = {
		requests: [
			{
				image: {
					content: b64String,
				},
				features: [
					{
						type: 'TEXT_DETECTION',
						maxResults: 20,
					},
				],
			},
		],
	};
	return axios
		.post(config.CLOUD_VISION_API_URL, body)
		.then(async ({ data }) => {
			if (data) {
				const text = data?.responses?.[0]?.fullTextAnnotation?.text;
				if (typeof text !== 'string') return;
				try {
					await admin.from(tables.cache.name).insert([
						{
							[tables.cache.columns.key]: b64String,
							[tables.cache.columns.value]: text,
						},
					]);
					return text;
				} catch (error) {
					return;
				}
			}
			return;
		});
};

export { imageToText };
