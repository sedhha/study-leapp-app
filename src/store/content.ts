// src/store.ts
import { create } from 'zustand';

interface StoreState {
	questionnaire: string;
	upvotes: number;
	summaryOfText: string;
	setContent: (content: {
		questionnaire: { question: string; options: string[]; answer: string }[];
		summaryOfText: string;
	}) => void;
}

const useContent = create<StoreState>((set) => ({
	questionnaire: '[]',
	upvotes: 0,
	summaryOfText: 'No summary',
	setContent: (content) =>
		set(() => ({
			questionnaire: JSON.stringify(content.questionnaire),
			summaryOfText: content.summaryOfText,
			upvotes: Math.round(Math.random() * 100),
		})),
}));

export default useContent;
