import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryTable from '../components/Category/CategoryTable';

const Categories = () => {
	const navigate = useNavigate();
	return (
		<div className="page-route-container">
			<div className='sticky-header'>
				<h1>Categories</h1>
				<button className="btn" onClick={() => navigate(-1)}>
					Go Back
				</button>
			</div>
			<div className="categories-container">
				<br />
				<CategoryTable />
				<br />
			</div>
		</div>
	);
};

export default Categories;