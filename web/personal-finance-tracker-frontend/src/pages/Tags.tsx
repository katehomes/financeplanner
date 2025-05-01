import React from 'react';
import { useNavigate } from 'react-router-dom';
import TagTable from '../components/Tag/TagTable';
import '../css/page-route-container.css'

const Tags = () => {
	const navigate = useNavigate();
	return (
		<div className="page-route-container">
			<div className='sticky-header'>
				<h1>Tags</h1>
				<button className="btn" onClick={() => navigate(-1)}>
					Go Back
				</button>
			</div>
			<div className="tags-container">
				<br />
				<TagTable />
				<br />
			</div>
		</div>
	);
};

export default Tags;