import React, { useState } from 'react';
import useCreateAuction from '@/hooks/auction/useCreateAuction';
import useGetAuctions from '@/hooks/auction/useGetAuctions';
import useGetUserAuctions from '@/hooks/auction/useGetUserAuctions';

const TestPage = () => {
	const [responseMessage, setResponseMessage] = useState('');
	const { createAuction } = useCreateAuction();
	const { getAuctions } = useGetAuctions();

	const createTestAuction = async () => {
		setResponseMessage('');

		try {
			await createAuction({
				itemId: 1,
				sellerId: 1,
				startDateTime: new Date().toISOString(),
				endDateTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
				startingPrice: 100,
				bidIncrement: 10,
			});
			setResponseMessage('Success: Auction created');
		} catch (error) {
			console.error(error);
			setResponseMessage('Error creating auction');
		}
	};

	const auctions = async () => {
		setResponseMessage('');

		try {
			await getAuctions();
			setResponseMessage('Success: Auctions retrieved');
		} catch (error) {
			console.error(error);
			setResponseMessage('Error getting auctions');
		}
	};

	return (
		<div className="test-page">
			<h1>Test Client</h1>
			<div className="service-container">
				<button onClick={createTestAuction}>
					Create Test Auction
				</button>
			</div>
			<div className="service-container">
				<button onClick={auctions}>
					Get Auctions
				</button>
			</div>
			{responseMessage && <div className="response"><pre>{responseMessage}</pre></div>}
		</div>
	);
};

export default TestPage;
