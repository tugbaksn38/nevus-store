// src/components/Search.js
"use client";
import { useState } from 'react';

const Search = ({ onSearch, placeholder = "Ürün ara..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="search-component">
      <style jsx>{`
        .search-component {
          position: relative;
          background: linear-gradient(135deg, rgb(179, 208, 253) 0%, rgb(164, 202, 248) 100%);
          border-radius: 1000px;
          padding: 10px;
          display: grid;
          place-content: center;
          z-index: 0;
          max-width: 300px;
          margin: 0 10px;
        }

        .search-container {
          position: relative;
          width: 100%;
          border-radius: 50px;
          background: linear-gradient(135deg, rgb(218, 232, 247) 0%, rgb(214, 229, 247) 100%);
          padding: 5px;
          display: flex;
          align-items: center;
        }

        .search-container::after, .search-container::before {
          content: "";
          width: 100%;
          height: 100%;
          border-radius: inherit;
          position: absolute;
        }

        .search-container::before {
          top: -1px;
          left: -1px;
          background: linear-gradient(0deg, rgb(218, 232, 247) 0%, rgb(255, 255, 255) 100%);
          z-index: -1;
        }

        .search-container::after {
          bottom: -1px;
          right: -1px;
          background: linear-gradient(0deg, rgb(163, 206, 255) 0%, rgb(211, 232, 255) 100%);
          box-shadow: rgba(79, 156, 232, 0.7019607843) 3px 3px 5px 0px, rgba(79, 156, 232, 0.7019607843) 5px 5px 20px 0px;
          z-index: -2;
        }

        .input {
          padding: 10px;
          width: 100%;
          background: linear-gradient(135deg, rgb(218, 232, 247) 0%, rgb(214, 229, 247) 100%);
          border: none;
          color: #9EBCD9;
          font-size: 16px;
          border-radius: 50px;
        }

        .input:focus {
          outline: none;
          background: linear-gradient(135deg, rgb(239, 247, 255) 0%, rgb(214, 229, 247) 100%);
        }

        .search__icon {
          width: 40px;
          height: 40px;
          border-left: 2px solid white;
          border-top: 3px solid transparent;
          border-bottom: 3px solid transparent;
          border-radius: 50%;
          padding-left: 12px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: transparent;
        }

        .search__icon:hover {
          border-left: 3px solid white;
        }

        .search__icon svg {
          width: 20px;
          height: 20px;
        }

        .search__icon path {
          fill: white;
        }
      `}</style>
      
      <div className="search-container">
        <form onSubmit={handleSubmit} className="w-full flex items-center">
          <input 
            className="input" 
            type="text" 
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search__icon">
            <svg viewBox="0 0 24 24">
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Search;