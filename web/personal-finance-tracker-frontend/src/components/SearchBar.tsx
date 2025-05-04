import "../css/search-bar.css"
import React from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultSize: number | 0;
};

const SearchBar: React.FC<Props> = ({ value, onChange, placeholder = "Search...", resultSize }) => {
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
            <span className="results-num">{resultSize} results</span>
        </div>
    </>
  );
};

export default SearchBar;
