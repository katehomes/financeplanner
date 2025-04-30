import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';

const Finance = () => {
    const navigate = useNavigate();
    
    return (
        <div className="container">
            <button className="btn" onClick={() => navigate(-1)}>
                Go Back
            </button>
            <button className="btn" onClick={() => navigate("../category")}>
                Categories
            </button>
            <div className="title">
                <h1>Finance</h1>
            </div>
            <div className="finance-container">
                <TransactionTable />
            </div>
            
        </div>
    );
};

export default Finance;