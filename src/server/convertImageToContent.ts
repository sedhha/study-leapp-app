import { imageToText } from '@@/server/cloudVision/imageToText';
import { getPromptResponseForCriticalThinking } from './openAIClient';
const convertB64ToContent = async (b64: string) => {
	const text = await imageToText(b64);
	console.log('Text = ', text);
	if (!text)
		return {
			questionnaire: [],
			summaryOfText: 'Unable to form content from given Image.',
		};
	return getPromptResponseForCriticalThinking(text);
};

export { convertB64ToContent };
