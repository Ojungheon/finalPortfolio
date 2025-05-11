import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ActionButtons from '../../components/host/ActionButtons';
import Pagination from '../../components/Pagination';
import Button1 from '../../components/Button1';
import { useNavigate } from 'react-router-dom';

const ActionButtonWrapper = styled.div``;

const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  max-width: 1800px;
  margin: 0 auto;
`;

const SideButtonWrapper = styled.div`
  flex: 0 0 auto;
`;

const Table = styled.table`
  width: 90%;
  background: inherit;
  box-shadow: none;
  border: none;
  border-collapse: collapse;
  border-spacing: 0 6px;
  margin: 0 auto;
  margin-top: 20px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 20px;
`;

const Thead = styled.thead`
  background: white;
  color: black;
  padding: 6px;
`;

const Th = styled.th`
  text-align: center;
  width: ${({ width }) => width || 'auto'};
  border-bottom: 2px solid #ffaa0c;
  padding-bottom: 20px;
  padding-top: 20px;
`;

const Td = styled.td`
  text-align: center;
  font-size: 14px;
  padding: 7px;
  white-space: nowrap;
`;

const Tr = styled.tr`
  &:nth-child(10) td {
    border-bottom: 2px solid #ffaa0c;
  }
`;

const ListCheck = ({ title, columns, fetchUrl }) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetchUrl) return;

    const token = localStorage.getItem('token');
    console.log('토큰확인 :', token);

    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/host/login');
      return;
    }

    const option = {
      headers: {
        'Content-Type': 'application/json',
        token: `${token}`,
      },
    };

    fetch(fetchUrl, option)
      .then((response) => {
        console.log(`응답 상태 코드: ${response.status}`);
        console.log('응답 헤더:', response.headers.get('content-type'));

        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }

        // JSON 응답이 맞는지 확인
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('서버에서 JSON이 아닌 응답을 보냈습니다.');
        }

        return response.json();
      })
      .then((result) => {
        // console.log('서버 응답 데이터:', result); // 추가
        // setData(result || []);
        const resultArray = Array.isArray(result) ? result : [];
        setData(resultArray);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error('데이터 불러오기 실패:', error);
        setData([]); // 오류 발생 `시 빈 배열 설정
      });
  }, [fetchUrl]);

  // 전체 페이지
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 페이지에 해당하는 데이터 슬라이스
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const handleSelect = (uniqueKey) => {
    console.log('고유키:', uniqueKey);

    setSelected((prev) =>
      prev.includes(uniqueKey)
        ? prev.filter((key) => key !== uniqueKey)
        : [...prev, uniqueKey]
    );
  };

  const handleSelectAll = (e) => {
    if (!data || !Array.isArray(data)) return;

    if (e.target.checked) {
      setSelected(
        data.map((item) => `${item.businessType}_${item.businessNo}`)
      );
    } else {
      setSelected([]);
    }
  };

  return (
    <div style={{ minHeight: '80vh' }}>
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'black',
          marginBottom: '16px',
          paddingLeft: '32px',
        }}
      >
        {title}
      </h2>
      <TableWrapper>
        <Table>
          <Thead>
            <tr>
              <Th width="5%">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={data.length > 0 && selected.length === data.length}
                />
              </Th>
              {columns.map((col, index) => (
                <Th key={index} width={col.width}>
                  {col.label}
                </Th>
              ))}
              {/* <Th width="15%">작업</Th> */}
            </tr>
          </Thead>
          <tbody>
            {(currentData || []).map((item, index) => {
              // 10번째 행이면 <Tr>를 사용, 아니면 일반 <tr> 사용
              const uniqueKey = `${item.businessType}_${item.businessNo}`;
              return (
                <tr key={uniqueKey}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selected.includes(uniqueKey)}
                      onChange={() => handleSelect(uniqueKey)}
                    />
                  </Td>
                  {columns.map((col, idx) => (
                    <Td key={`col-${col.key}-${idx}`}>
                      {col.render ? col.render(item) : item[col.key]}
                    </Td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrapper>
      {/* {Pagination 컴포넌트 적용} */}
      <BottomContainer>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </BottomContainer>
    </div>
  );
};

export default ListCheck;
