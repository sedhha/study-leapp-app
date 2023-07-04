'use client';
import { useState, useEffect } from 'react';
import classes from './Content.module.css';
import { IoIosAddCircle } from 'react-icons/io';
import useContent from '@@/store/content';
interface IContent {
	walletAddress: string;
	contentID: string;
}

function App({ walletAddress }: IContent) {
	const [upvoted, setUpvoted] = useState(false);
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState<
		{ by: string; content: string; me?: boolean }[]
	>([
		{ by: 'ABC', content: 'Hello guys, this looks good!' },
		// Add more comments as needed
	]);
	const [content, setContent] = useState({
		questionnaire: '[]',
		upvotes: 0,
		summaryOfText: '',
	});
	const addComment = () => {
		setComments((prev) => [
			{ by: walletAddress ?? 'Me', content: comment, me: true },
			...prev,
		]);
		setComment('');
	};
	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem('response.data') ?? '');
		console.log('stored', { storedData });
		setContent((prev) => ({
			...prev,
			questionnaire: JSON.stringify(storedData.questionnaire),
			summaryOfText: storedData.summaryOfText ?? '',
			upvotes: Math.round(Math.random() * 100),
		}));
	}, []);
	console.log('content = ', content);
	return (
		<div className={classes.container}>
			<h1 className={classes.h1}>Summary</h1>
			<p className={classes.p}>{content.summaryOfText}</p>

			<h1 className={classes.h1}>Questionnaire</h1>
			{(
				JSON.parse(content.questionnaire) as {
					question: string;
					options: string[];
					answer: string;
				}[]
			).map((questionData, index) => (
				<div
					key={index}
					className={classes.question}
				>
					<h2 className={classes.h2}>{questionData.question}</h2>
					<ul className={classes.ul}>
						{questionData.options.map((option, optionIndex) => (
							<li
								className={classes.li}
								key={optionIndex}
							>
								{option}
							</li>
						))}
					</ul>
					<p className={[classes.p, classes.answer].join(' ')}>
						Answer: {questionData.answer}
					</p>
				</div>
			))}
			<div className={classes.interactions}>
				<div className={classes.UpVoteContent}>
					<span className={classes.upvotes}>{`Upvotes: ${
						content.upvotes + (upvoted ? 1 : 0)
					}`}</span>
					<IoIosAddCircle
						className={[
							classes.upvotesIcon,
							upvoted ? classes.upVotesIconActive : null,
						].join(' ')}
						onClick={() => setUpvoted(!upvoted)}
					/>
				</div>
				<span className={classes.comments}>Comments: {comments.length}</span>
			</div>
			<br />
			<h1 className={classes.h1}>Comments</h1>
			<div className={classes.commentsSection}>
				<div className={classes.comment}>
					<textarea
						className={[classes.p, classes.textarea].join(' ')}
						placeholder='Add new comment'
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						className='StandardButton'
						onClick={addComment}
					>
						Add Comment
					</button>
				</div>
				{comments.map((comment, index) => (
					<div
						key={index}
						className={classes.comment}
					>
						<p
							className={[
								classes.p,
								classes.commentBy,
								comment.me ? classes.strong : null,
							].join(' ')}
						>
							By: {comment.by}
						</p>
						<p className={[classes.p, classes.commentContent].join(' ')}>
							{comment.content}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
