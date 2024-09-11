import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent = ({ searchType, setSearchType, searchKeyword, setSearchKeyword, handleSearch }) => {

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };

  return (
    <div className="search-container">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-category"
      >
        <option value="c">내용</option>
        <option value="w">작성자</option>
        <option value="t">태그</option>
      </select>
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="검색"
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        <SearchIcon />
      </button>
    </div>
  );
};

export default SearchComponent;