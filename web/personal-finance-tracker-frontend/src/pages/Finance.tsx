import React from 'react';
import { useNavigate } from 'react-router-dom';
import TxTable from '../components/Transaction/Table/TxTable';
const Transactions = () => {
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
                <TxTable />
                <br/>
            </div>
            
        </div>
    );
};

export default Transactions;