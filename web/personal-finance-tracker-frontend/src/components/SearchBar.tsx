import "../css/search-bar.css"
import React from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showingResultSize: number | 0;
  totalResultSize?: number | 0;
  showTotal?: boolean;
};

const SearchBar: React.FC<Props> = ({ 
  value, onChange, placeholder = "Search...", 
  showingResultSize, totalResultSize, showTotal = false
}) => {

  return (
    <>
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-input"
            />
            <span className="results-num">
              <>{showingResultSize} </>
              { showTotal && (showingResultSize != totalResultSize)  &&
                (<>/ {totalResultSize} </>) }
              results
            </span>
        </div>
    </>
  );
};

export default SearchBar;
