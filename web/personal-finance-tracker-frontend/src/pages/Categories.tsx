import React from 'react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
	const navigate = useNavigate();
	return (
		<div className="container">
			<button className="btn" onClick={() => navigate(-1)}>
				Go Back
			</button>
			<div className="title">
				<h1>Categories</h1>
			</div>
			<div className="categories-container">
				
			</div>
		</div>
	);
};

export default Categories;