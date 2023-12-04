import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button } from '@/components/ui';
import { userService } from '@/services/userService';
import { useUser } from '@/hooks/user/useUser';
import styles from '@/css/AdminPage.module.css';

const AdminPage = () => {
	const [userId, setUserId] = useState('');
	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [inProgressAuctions, setInProgressAuctions] = useState([]);
	const { logout } = useUser();

	useEffect(() => {
		// Fetch in-progress auctions sorted by soonest end time
		// Replace with actual function call to fetch auctions
		console.log("Fetching in-progress auctions");
		// setInProgressAuctions(fetchedAuctions);
	}, []);

	const handleUserIdChange = (e) => {
		setUserId(e.target.value);
	};

	const handleBlockUser = async () => {
		try {
			await userService.deleteUser(userId);
			toast.success('User blocked successfully');
		} catch (error) {
			toast.error('User does not exist')
		}
	};

	const handleCategoryChange = (e) => {
		setNewCategory(e.target.value);
	};

	const handleAddCategory = () => {
		console.log(`Adding new category: ${newCategory}`);
		// Implement logic to add new category
	};

	const handleSelectCategory = (e) => {
		setSelectedCategory(e.target.value);
	};

	const handleModifyCategory = () => {
		console.log(`Modifying category: ${selectedCategory}`);
		// Implement logic to modify selected category
	};

	const handleRemoveCategory = () => {
		console.log(`Removing category: ${selectedCategory}`);
		// Implement logic to remove selected category
	};

	return (
		<div className={styles.adminPage}>
			<Card className={styles.userBlockCard}>
				<input
					type="text"
					value={userId}
					onChange={handleUserIdChange}
					placeholder="Enter User ID"
				/>
				<Button onClick={handleBlockUser}>BLOCK</Button>
			</Card>

			<Card className={styles.categoryCard}>
				<h3>Manage Categories</h3>
				<div>
					<input
						type="text"
						value={newCategory}
						onChange={handleCategoryChange}
						placeholder="New Category Name"
					/>
					<Button onClick={handleAddCategory}>Add Category</Button>
				</div>
				<div>
					<select value={selectedCategory} onChange={handleSelectCategory}>
						{/* Populate categories here */}
					</select>
					<Button onClick={handleModifyCategory}>Modify</Button>
					<Button onClick={handleRemoveCategory}>Remove</Button>
				</div>
			</Card>

			<Card className={styles.auctionsCard}>
				<h3>In-Progress Auctions</h3>
				<ul>
					{inProgressAuctions.map(auction => (
						<li key={auction.id}>
							{auction.item_title} - Ends: {auction.end_time}
							{/* Additional auction details can be added here */}
						</li>
					))}
				</ul>
			</Card>

			<Button onClick={logout}>Logout</Button>
		</div>
	);
};

export default AdminPage;
