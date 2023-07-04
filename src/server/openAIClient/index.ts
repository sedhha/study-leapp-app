import admin from '@@/server/supabase';
import { tables } from '@@/server/supabase/tables';
import axios from 'axios';
const dummyContent = {
	questionnaire: [
		{
			question:
				'What were the major changes in human evolution during the 15th century?',
			options: [
				'A. Increased use of technology',
				'B. Increased population growth',
				'C. Increased migration',
				'D. Increased agricultural production',
			],
			answer: 'C. Increased migration',
		},
		{
			question:
				'What was the primary cause of human evolution during the 15th century?',
			options: [
				'A. Climate change',
				'B. Technological advances',
				'C. Social and political changes',
				'D. Economic development',
			],
			answer: 'C. Social and political changes',
		},
		{
			question:
				'What were the effects of human evolution during the 15th century?',
			options: [
				'A. Increased global trade',
				'B. Increased cultural exchange',
				'C. Increased economic inequality',
				'D. Increased environmental degradation',
			],
			answer: 'B. Increased cultural exchange',
		},
	],
	upvotes: 22,
	summaryOfText:
		'The 15th century saw a major shift in human evolution due to social and political changes. This shift resulted in increased migration, cultural exchange, and global trade. These changes had both positive and negative effects on the world.',
};

const getResponseFromCache = async (key: string): Promise<string | void> =>
	admin
		.from(tables.cache.name)
		.select(tables.cache.columns.value)
		.eq(tables.cache.columns.key, key)
		.then(({ data, error }) => {
			if (error || !data.length) return;
			return (data[0] as unknown as { value: string }).value;
		});

const reformatPromptMessage = (promptMessage: string) =>
	(promptMessage ?? '').slice(0, 50).toLowerCase();

const generatePromptForCriticalThinking = (promptMessage: string): string =>
	`Generate me a summary and a set of questions with need of critical thinking for the text: "${promptMessage}", and a set of answer key. You can only respond in JSON format, nothing else. Return JSON array in following format: '{questionnaire: {question:string;options:string[];answer:string}[], summaryOfText: string; }'`;

const getPromptArrayFromMessage = async <T>(
	prompt: string,
	cacheString: string
): Promise<T> => {
	const cachedResponse = await getResponseFromCache(cacheString);
	console.log(`Cache String = "${cacheString}"`);
	if (
		!cachedResponse &&
		process.env.OPENAI_BASE_URL &&
		process.env.OPENAI_API_KEY
	)
		return axios
			.post(
				process.env.OPENAI_BASE_URL,
				{
					model: 'text-davinci-003',
					prompt,
					max_tokens: 2000,
					temperature: 0,
				},
				{
					headers: {
						Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					},
				}
			)
			.then(async ({ data }) => {
				try {
					await admin.from(tables.cache.name).insert([
						{
							[tables.cache.columns.key]: cacheString,
							[tables.cache.columns.value]: data?.choices?.[0]?.text ?? '[]',
						},
					]);
					return JSON.parse(data?.choices?.[0]?.text ?? '[]');
				} catch (err) {
					console.error(
						'Error occured while decoding responde from Open AI 01 - ',
						(err as { message: string }).message
					);
					return {
						questionnaire: [],
						summaryOfText: (err as { message: string }).message,
					} as T;
				}
			})
			.catch((err) => {
				// console.log('Error = ', `Bearer ${process.env.OPENAI_API_KEY}`);
				// console.error(
				// 	'Error occured while decoding responde from Open AI - ',
				// 	(err as { message: string }).message
				// );
				return dummyContent as T;
			});
	else if (cachedResponse != undefined) {
		try {
			return JSON.parse(cachedResponse);
		} catch (err) {
			console.error(
				'Error occured while decoding responde from cache - ',
				(err as { message: string }).message
			);
			return {
				questionnaire: [],
				summaryOfText: (err as { message: string }).message,
			} as T;
		}
	} else
		return {
			questionnaire: [],
			summaryOfText:
				'No access allowed ' +
				process.env.OPENAI_BASE_URL +
				' ' +
				process.env.OPENAI_API_KEY,
		} as T;
};

const getPromptResponseForCriticalThinking = async (
	message: string
): Promise<{ question: string; options: string[]; answer: string[] }[]> => {
	const formattedMessage = generatePromptForCriticalThinking(message);
	const cachedString = reformatPromptMessage(message);
	return getPromptArrayFromMessage(formattedMessage, cachedString);
};

export { getPromptResponseForCriticalThinking };
