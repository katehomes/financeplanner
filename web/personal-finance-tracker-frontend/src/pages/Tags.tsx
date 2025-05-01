import React from 'react';
import { useNavigate } from 'react-router-dom';
import TagTable from '../components/Tag/TagTable';

const Tags = () => {
	const navigate = useNavigate();
	return (
		<div className="container">
			<button className="btn" onClick={() => navigate(-1)}>
				Go Back
			</button>
			<div className="title">
				<h1>Tags</h1>
			</div>
			<div className="tags-container">
				<TagTable />
			</div>
		</div>
	);
};

export default Tags;