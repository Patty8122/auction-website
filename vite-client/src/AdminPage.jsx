import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Card, Button } from '@/components/ui';
import { userService } from '@/services/userService';
import { itemService } from '@/services/itemService';
import { useUser } from '@/hooks/user/useUser';
import AdminAuctions from '@/components/adminAuctions/AdminAuctions';
import styles from '@/css/AdminPage.module.css';

const AdminPage = () => {
	const [userId, setUserId] = useState('');
	const [newCategory, setNewCategory] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const { logout } = useUser();

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

	const handleAddCategory = async () => {
		try {
			await itemService.createCategory(newCategory);
			toast.success('Category created successfully');
		} catch (error) {
			toast.error('Could not create category');
		}
	};
	

	const handleSelectCategory = (e) => {
		setSelectedCategory(e.target.value);
	};

	const handleModifyCategory = async () => {
		try {
			const res = await itemService.getCategoryByName(selectedCategory);
			const category_id = res[0].id;
			await itemService.changeCategoryName(category_id, newCategory);
			toast.success('Category modified successfully');
		} catch (error) {
			toast.error('Could not modify category');
		}
	};

	const handleRemoveCategory = async () => {
		try {
			const res = await itemService.getCategoryByName(selectedCategory);
			const category_id = res[0].id;
			itemService.deleteCategory(category_id);
			toast.success('Category removed successfully');
		} catch (error) {
			toast.error('Could not remove category');
		}
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

				{/* Row for Add Category */}
				<div className={styles.categoryAction}>
					<input
						type="text"
						value={newCategory}
						onChange={handleCategoryChange}
						placeholder="New Category Name"
					/>
					<Button onClick={handleAddCategory}>Create</Button>
				</div>

				{/* Row for Modify Category */}
				<div className={styles.categoryAction}>
					<input
						type="text"
						value={selectedCategory}
						placeholder="Current Category Name"
						onChange={handleSelectCategory} // or another appropriate handler
					/>
					<span className={styles.arrow}>→</span>
					<input
						type="text"
						value={newCategory}
						placeholder="New Category Name"
						onChange={handleCategoryChange}
					/>
					<Button onClick={handleModifyCategory}>Modify</Button>
				</div>

				{/* Row for Remove Category */}
				<div className={styles.categoryAction}>
					<input
						type="text"
						value={selectedCategory}
						onChange={handleSelectCategory}
						placeholder="Category to Remove"
					/>
					<Button onClick={handleRemoveCategory}>Remove</Button>
				</div>
			</Card>

			<AdminAuctions />

			<Button onClick={logout}>Logout</Button>
		</div>
	);
};

export default AdminPage;
