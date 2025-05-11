import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Pagination from '../../Pagination';

const TableWrapper = styled.div`
  width: 94%;
  margin-top: 20px;
  padding-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
`;

const NoDataRow = styled.tr`
  text-align: center;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const HostListData = ({ hosts, totalPages, currentPage, setCurrentPage }) => {
  const navigate = useNavigate(); // ✅ React Router 네비게이션 훅

  // ✅ 클릭 시 상세 페이지로 이동하는 함수
  const handleSelectHost = (hostNo) => {
    navigate(`/manager/host/${hostNo}`);
  };

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader>번호</TableHeader>
            <TableHeader>아이디</TableHeader>
            <TableHeader>이름</TableHeader>
            <TableHeader>등록일자</TableHeader>
            <TableHeader>사업장 수</TableHeader>
            <TableHeader>상태</TableHeader>
          </tr>
        </thead>
        <tbody>
          {hosts.length > 0 ? (
            hosts.map((host) => (
              <tr key={host.no} onClick={() => handleSelectHost(host.no)}>
                {' '}
                {/* ✅ tr 클릭 시 이동 */}
                <TableCell>{host.no}</TableCell>
                <TableCell>{host.id}</TableCell>
                <TableCell>{host.name}</TableCell>
                <TableCell>{host.enrollDate}</TableCell>
                <TableCell>{host.businessCount}</TableCell>
                <TableCell>{host.delYn}</TableCell>
              </tr>
            ))
          ) : (
            <NoDataRow>
              <TableCell colSpan="6">데이터가 없습니다.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>

      <PaginationWrapper>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default HostListData;

// 백 코드
// HostController.java
// @GetMapping("/manage/host/list")
// public ResponseEntity<Map<String, Object>> getHostList(@RequestParam int page, @RequestParam int pageSize) {
//     List<HostWithBusinessCountVO> hosts = hostService.getAllHostsWithTotalBusinessCount();
//     int totalPages = (int) Math.ceil((double) hosts.size() / pageSize);

//     Map<String, Object> response = new HashMap<>();
//     response.put("content", hosts);
//     response.put("totalPages", totalPages);

//     return ResponseEntity.ok(response);
// }

// HostService.java
// public List<HostWithBusinessCountVO> getAllHostsWithTotalBusinessCount() {
//   return hostMapper.findAllHostsWithTotalBusinessCount();
// }

// HostMapper.xml
// <select id="findAllHostsWithTotalBusinessCount" resultType="HostWithBusinessCountVO">
//     SELECT
//         h.NO,
//         h.ID,
//         h.NAME,
//         h.ENROLL_DATE,
//         (
//             (SELECT COUNT(*) FROM LODGING l WHERE l.HOST_NO = h.NO) +
//             (SELECT COUNT(*) FROM OFFICE o WHERE o.HOST_NO = h.NO)
//         ) AS businessCount,
//         h.DEL_YN
//     FROM HOST h
//     WHERE h.DEL_YN = 'N'
// </select>

// HostWithBusinessCountVO.java
// public class HostWithBusinessCountVO {
//   private int no;
//   private String id;
//   private String name;
//   private String enrollDate;
//   private int businessCount; // 숙소 + 오피스 개수 합산
//   private String delYn;
// }
