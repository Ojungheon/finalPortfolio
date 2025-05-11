import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setKeyword, setCategory } from '../../redux/searchSlice';

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 735px;
  height: 42px;
  border-radius: 20px;
  border: 1px solid #8041ff;
  padding: 0 15px;
  background-color: #fff;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 18px;
  color: #333;

  ::placeholder {
    color: #c8c8c8;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  svg {
    width: 20px;
    height: 20px;
    color: #8041ff;
  }
`;

/**
 * 검색바 컴포넌트
 * @param {string} category - 검색 대상 ("office", "lodging", "package" , "tour")
 */
const SearchBox = ({ category }) => {
  const dispatch = useDispatch();
  const keyword = useSelector((state) => state.search.keyword);
  const data = useSelector((state) => state.search.data) || []; // undefined방지를 위함

  const [filteredResult, setFilteredResult] = useState([]);

  // 카테고리 설정
  useEffect(() => {
    if (category) {
      dispatch(setCategory(category));
    }
  }, [dispatch, category]);

  // 검색어가 변경될 때마다 필터링 실행
  useEffect(() => {
    if (!keyword.trim() || !Array.isArray(data)) {
      setFilteredResult([]); // 검색어가 없으면 결과 초기화
      return;
    }

    const results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.regionName.toLowerCase().includes(keyword.toLowerCase())
    );

    setFilteredResult(results);
  }, [keyword, data]);

  const handleInputChange = (e) => {
    dispatch(setKeyword(e.target.value));
  };

  return (
    <>
      <SearchBar>
        <IconWrapper>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </IconWrapper>
        <SearchInput
          value={keyword}
          onChange={handleInputChange}
          type="text"
          placeholder="어디로 떠나볼까요?"
        />
      </SearchBar>
    </>
  );
};

export default SearchBox;
