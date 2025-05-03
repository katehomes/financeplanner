import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionImport from '../components/Transaction/Import/TransactionImport';
import '../css/page-route-container.css'
import ImportPreviewTable from '../components/Transaction/Import/ImportPreviewTable';
import TxImpTableContainer from '../components/Transaction/Import/TxImpTableContainer';

const Import = () => {
	const navigate = useNavigate();
	return (
		<div className="page-route-container">
			<div className='sticky-header'>
				<h1>Import</h1>
				<button className="btn" onClick={() => navigate(-1)}>
					Go Back
				</button>
			</div>
			<div className="import-container">
				<br />
                {/* <ImportPreviewTable /> */}
				<TxImpTableContainer />
				<br />
			</div>
		</div>
	);
};

export default Import;