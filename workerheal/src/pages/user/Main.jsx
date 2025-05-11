import React from 'react';
import styled from 'styled-components';
import { Routes, Route, useLocation } from 'react-router-dom'; // useLocation 추가
import Header from '../../common/components/user/Header';
import Footer from '../../common/components/user/Footer';
import OfficeDetailed from '../user/OfficeDetailed';
import TourDetailed from './TourDetailed';
import ReviewsDetailed from './ReviewsDetailed';
import ImageModal from './ImageModal';
import LodgingDetailed from './LodgingDetailed';
import LodgingList from './LodgingList';
import OfficeList from './OfficeList';
import TourList from './TourList';
import Login from '../member/Login';
import FloatingButtons from '../../components/FloatingButton';
import Join from '../member/Join';
import ResetPassword from '../member/ResetPassword';
import Mypage from '../member/Mypage';
import Edit from '../member/Edit';
import ChangePassword from '../member/ChangePassword';
import DeleteAccount from '../member/DeleteAcount';
import Points from '../member/Points';
import Saved from '../member/Saved';
import Reservated from '../member/Reservated';
import ReservatedDetail from '../member/ReservatedDetail';
import PackageDetailed from './PackageDetailed';
import PackageList from './PackageList';
import LodgingReviewsDetailed from './LodgingReviewsDetailed';
import PackageReviewsDetailed from './PackageReviewsDetailed';
import PackageReservation from './PackageReservation';
import OfficeReservatedDetail from '../member/OfficeReservatedDetail';
import LodgingReservatedDetail from '../member/LodgingReservatedDetail';
import PackageReservatedDetail from '../member/PackageReservatedDetail';
import Home from './Home';
import OfficeReservation from './OfficeReservation';

const Layout = styled.div`
  display: grid;
  grid-template-rows: 85px 1fr 300px;
`;

// 공백 영역
const MainLayout = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWorkspace = styled.div`
  background-color: white;
  width: 1420px;
  height: 100%;
`;

const Main = () => {
  const location = useLocation(); // 현재 경로 확인

  // 🔹 로그인 관련 경로에서는 Footer를 숨김
  const hideFooterRoutes = [
    '/member/login',
    '/member/join',
    '/member/resetpassword',
  ];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <>
      <Layout>
        <Header />
        <MainLayout>
          {/* 작업한 페이지 영역 */}
          <StyledWorkspace>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tour/list/*" element={<TourList />} />
              <Route path="/tour/detail" element={<TourDetailed />} />
              <Route path="/lodging/list" element={<LodgingList />} />
              <Route path="/lodging/detail" element={<LodgingDetailed />} />
              <Route
                path="/lodging/review"
                element={<LodgingReviewsDetailed />}
              />

              {/* 오피스 */}
              <Route path="/office/review" element={<ReviewsDetailed />} />
              <Route path="/office/list" element={<OfficeList />} />
              <Route path="/office/detail" element={<OfficeDetailed />} />
              <Route
                path="/office/reviews/imageModal"
                element={<ImageModal />}
              />
              <Route
                path="/office/reservation"
                element={<OfficeReservation />}
              />

              {/* 패키지 */}
              <Route path="/package/list" element={<PackageList />} />
              <Route path="/package/detail" element={<PackageDetailed />} />
              <Route
                path="/package/review"
                element={<PackageReviewsDetailed />}
              />
              <Route
                path="/package/reservation"
                element={<PackageReservation />}
              />
              <Route path="/member/login" element={<Login role={'회원'} />} />
              <Route path="/member/join" element={<Join />} />
              <Route path="/member/mypage" element={<Mypage />} />
              <Route path="/member/mypage/edit" element={<Edit />} />
              <Route path="/member/mypage/points" element={<Points />} />
              <Route path="/member/saved" element={<Saved />} />
              <Route path="/member/reservated" element={<Reservated />} />
              <Route
                path="/member/reservated/officeDetail/:reservationNo"
                element={<OfficeReservatedDetail />}
              />
              <Route
                path="/member/reservated/lodgingDetail/:reservationId"
                element={<LodgingReservatedDetail />}
              />
              <Route
                path="/member/reservated/packageDetail/:reservationNo"
                element={<PackageReservatedDetail />}
              />
              <Route
                path="/member/mypage/deleteAccount"
                element={<DeleteAccount />}
              />
              <Route
                path="/member/mypage/changepassword"
                element={<ChangePassword />}
              />
              <Route path="/member/resetpassword" element={<ResetPassword />} />
              <Route
                path="/member/reservated/officeDetail/:reservationNo"
                element={<OfficeReservatedDetail />}
              />
              <Route
                path="/member/reservated/lodgingDetail/:reservationId"
                element={<LodgingReservatedDetail />}
              />
              <Route
                path="/member/reservated/packageDetail/:reservationNo"
                element={<PackageReservatedDetail />}
              />
            </Routes>
            <FloatingButtons />
          </StyledWorkspace>
        </MainLayout>

        {/* 🔹 특정 페이지가 아닐 때만 Footer를 표시 */}
        {!shouldHideFooter && <Footer />}
      </Layout>
    </>
  );
};

export default Main;
