import React from 'react';
import { Route, Routes } from 'react-router-dom';
import WorkplaceListCheck from './WorkplaceListCheck';
import RoomtypeListCheck from './RoomtypeListCheck';
import InsertLodging from './InsertLodging';
import InsertRoomtype from './InsertRoomtype';
import InsertOffice from './InsertOffice';
import PersonalInformation from './PersonalInformation';
import ReservationDetailCheck from './ReservationDetailCheck';
import HostLogin from './HostLogin';
import ResetPasswordH from './ResetPasswordH';
import UpdateLodging from './UpdateLodging';
import UpdateRoomtype from './UpdateRoomtype';
import UpdateOffice from './UpdateOffice';
import WorkplaceStateCheck from './WorkplaceStateCheck';
import HostHeader from '../../components/host/HostHeader';
import ReservationListCheck from './ReservationListCheck';
import DetailLodging from './DetailLodging';
import DetailOffice from './DetailOffice';
import ApprovalRoomType from './ApprovalRoomType';
import DetailRoomtype from './DetailRoomtype';

const HostPage = () => {
  return (
    <>
      <HostHeader />
      <Routes>
        <Route path="/workplace/list" element={<WorkplaceListCheck />} />
        <Route path="/workplace/state" element={<WorkplaceStateCheck />} />
        <Route
          path="/tempRoomtype/list/:lodgingNo"
          element={<RoomtypeListCheck />}
        />
        <Route
          path="/roomtype/list/:lodgingNo"
          element={<ApprovalRoomType />}
        />
        <Route path="/lodging/insert" element={<InsertLodging />} />
        <Route
          path="/tempRoomtype/insert/:lodgingNo"
          element={<InsertRoomtype />}
        />
        <Route path="/office/insert" element={<InsertOffice />} />
        <Route path="/lodging/update/:businessNo" element={<UpdateLodging />} />
        <Route path="/roomtype/update" element={<UpdateRoomtype />} />
        <Route path="/office/update/:businessNo" element={<UpdateOffice />} />
        <Route path="/update" element={<PersonalInformation />} />
        <Route
          path="/workplace/lodgingReserve/:businessNo"
          element={<ReservationListCheck />}
        />
        <Route
          path="/workplace/officeReserve/:businessNo"
          element={<ReservationListCheck />}
        />

        <Route
          path="/workplace/officeReserveDetail/:reservationNo"
          element={<ReservationDetailCheck />}
        />

        <Route path="lodging/detail/:businessNo" element={<DetailLodging />} />
        <Route path="office/detail/:businessNo" element={<DetailOffice />} />
        <Route path="tempRoomtype/detail/:no" element={<DetailRoomtype />} />
        <Route path="/login" element={<HostLogin />} />
        <Route path="/resetpassword" element={<ResetPasswordH />} />
      </Routes>
    </>
  );
};

export default HostPage;
