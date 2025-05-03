import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionImport from '../components/Transaction/TransactionImport';
import '../css/page-route-container.css'

const Import = () => {
	const navigate = useNavigate();
	return (
		<div className="page-route-container">
			<div className='sticky-header'>
				<h1>Tags</h1>
				<button className="btn" onClick={() => navigate(-1)}>
					Go Back
				</button>
			</div>
			<div className="import-container">
				<br />
				<TransactionImport />
				<br />
			</div>
		</div>
	);
};

export default Import;