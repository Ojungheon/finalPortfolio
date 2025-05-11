import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../common/styles/theme';
import SideBar from '../../common/components/admin/SideBar';
import Header from '../../common/components/admin/Header';
import PackageList from './managePackage/list/PackageList';
import EnrollLodgingDetail from './managePackage/enroll/EnrollLodgingDetail';
import EnrollOfficeDetail from './managePackage/enroll/EnrollOfficeDetail';
import EnrollProgramDetail from './managePackage/enroll/EnrollProgramDetail';
import EnrollLodgingList from './managePackage/enroll/EnrollLodgingList';
import EnrollOfficeList from './managePackage/enroll/EnrollOfficeList';
import EnrollProgramList from './managePackage/enroll/EnrollProgramList';
import EnrollSettingsDetailData from '../../components/admin/managePackage/enroll/EnrollSettingsDetailData';
import EnrollSettingsDetail from './managePackage/enroll/EnrollSettingsDetail';
import HostList from './manageHost/HostList';
import HostDetail from './manageHost/HostDetail';
import EnrollHost from '../../components/admin/manageHost/EnrollHost';
import MemberList from './manageMember/MemberList';
import AddressParents from '../../components/AddressParents';
import TourList from './manageTour/TourList';
import TourEnroll from './manageTour/TourEnroll';
import OfficeList from './managerWorkplace/OfficeList';
import LodgingList from './managerWorkplace/LodgingList';
import ManagerLogin from './ManagerLogin';
import TourEdit from './manageTour/TourEdit';
import EditSettingsDetail from './managePackage/edit/EditSettingsDetail';
import EditLodgingList from './managePackage/edit/EditLodgingList';
import EditLodgingDetail from './managePackage/edit/EditLodgingDetail';
import EditOfficeList from './managePackage/edit/EditOfficeList';
import EditOfficeDetail from './managePackage/edit/EditOfficeDetail';
import EditProgramList from './managePackage/edit/EditProgramList';
import EditProgramDetail from './managePackage/edit/EditProgramDetail';

const LayOut = styled.main`
  display: flex;
`;

const AdminPage = () => {
  const location = useLocation(); // 현재 경로 확인

  // 🔹 로그인 관련 경로에서는 Footer를 숨김
  const hideSideBarRoutes = ['/manager/login', '/manager/resetpassword'];
  const shouldHideSideBar = hideSideBarRoutes.includes(location.pathname);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header />
        <LayOut>
          <SideBar />
          {/* 🔹 특정 페이지가 아닐 때만 Footer를 표시 */}
          {!shouldHideSideBar && <SideBar />}
          <Routes>
            <Route path="/*" element={<h1>홈</h1>} />
            <Route path="/package/list" element={<PackageList />} />
            <Route
              path="/enroll/package/lodging/list"
              element={<EnrollLodgingList />}
            />
            <Route
              path="/enroll/package/lodging/:no"
              element={<EnrollLodgingDetail />}
            />
            <Route
              path="/enroll/package/office/list"
              element={<EnrollOfficeList />}
            />
            <Route
              path="/enroll/package/office/:no"
              element={<EnrollOfficeDetail />}
            />
            <Route
              path="/enroll/package/program/list"
              element={<EnrollProgramList />}
            />
            <Route
              path="/enroll/package/program/:no"
              element={<EnrollProgramDetail />}
            />
            <Route
              path="/enroll/package/settings"
              element={<EnrollSettingsDetail />}
            />

            <Route
              path="/edit/package/settings/:no"
              element={<EditSettingsDetail />}
            />

            <Route
              path="/edit/package/lodging/list"
              element={<EditLodgingList />}
            />
            <Route
              path="/edit/package/lodging/:no"
              element={<EditLodgingDetail />}
            />
            <Route
              path="/edit/package/office/list"
              element={<EditOfficeList />}
            />
            <Route
              path="/edit/package/office/:no"
              element={<EditOfficeDetail />}
            />
            <Route
              path="/edit/package/program/list"
              element={<EditProgramList />}
            />
            <Route
              path="/edit/package/program/:no"
              element={<EditProgramDetail />}
            />
            <Route
              path="/edit/package/settings"
              element={<EditSettingsDetail />}
            />

            <Route path="/office/list" element={<OfficeList />} />
            <Route path="/lodging/list" element={<LodgingList />} />
            <Route path="/tour/list" element={<TourList />} />
            <Route path="/tour/enroll" element={<TourEnroll />} />
            <Route path="/tour/edit/*" element={<TourEdit />} />
            <Route path="/member/list" element={<MemberList />} />
            <Route
              path="/member/reservation"
              element={<h1>예약내역 조회</h1>}
            />
            <Route path="/host/list" element={<HostList />} />
            <Route path="/host/:id" element={<HostDetail />} />
            <Route path="/host/enroll" element={<EnrollHost />} />
            <Route path="/faq/list" element={<h1>FAQ 목록</h1>} />
            <Route path="/faq/enroll" element={<h1>FAQ 등록</h1>} />
            <Route path="/login" element={<ManagerLogin />} />
          </Routes>
        </LayOut>
      </ThemeProvider>
    </>
  );
};

export default AdminPage;
