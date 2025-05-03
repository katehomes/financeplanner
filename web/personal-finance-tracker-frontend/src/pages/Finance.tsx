import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/Transaction/TransactionTable';
import TransactionImport from '../components/Transaction/TransactionImport';
const Finance = () => {
    const navigate = useNavigate();
    
    return (
        <div className="page-route-container">
            <div className='sticky-header'>
				<h1>Finance</h1>
				<button className="btn" onClick={() => navigate(-1)}>
                    Go Back
                </button>
                <button className="btn" onClick={() => navigate("../category")}>
                    Categories
                </button>
                <button className="btn" onClick={() => navigate("../tag")}>
                    Tags
                </button>
                <button className="btn" onClick={() => navigate("../import")}>
                    Import
                </button>
			</div>
            <div className="finance-container">
                <br/>
                <TransactionTable />
                <br/>
            </div>
            
        </div>
    );
};

export default Finance;