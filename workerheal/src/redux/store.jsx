import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import faqReducer from './faqSlice';
import faqCategoryReducer from './faqCategorySlice';
import dateReducer from './DateSlice';
import memberReducer from './MemberSlice';
import officeReducer from './officeSlice';
import officeDetailedReducer from './officeDetailedSlice';
import reviewReducer from './reviewSlice';
import userReducer from './userSlice';
import managerReducer from './managerSlice';
import hostReducer from './hostSlice';
import tourReducer from './tourSlice';
import tourDetailedReducer from './tourDetailedSlice';
import lodgingReducer from './LodgingSlice';
import lodgingDetailedReducer from './LodgingDetailedSlice';
import lodgingReviewReducer from './lodgingReviewSlice';
import packageListReducer from './packageListSlice';
import packageDetailReducer from './PackageDetailSlice';
import packageReviewReducer from './packageReviewSlice';
import packageReducer from './packageSlice';
import counterReducer from './counterSlice';
import peopleCounterReducer from './addPeopleSlice';
import favoriteReducer from './favoriteSlice';
import mainOfficeReducer from './mainOfficeList';
import mainPackageReducer from './mainPackageList';
import mainLodgingReducer from './mainLodgingListSlice';

const store = configureStore({
  reducer: {
    search: searchReducer, // 검색 상태 관리
    faqCategory: faqCategoryReducer, // faq 카테고리
    faq: faqReducer, // faq 질문 답변
    date: dateReducer, // 캘린더
    member: memberReducer, // 회원 관리
    office: officeReducer, // 오피스 리스트 관리
    officeDetailed: officeDetailedReducer, // 오피스 상페 관리
    review: reviewReducer, // 오피스 리뷰 관리
    lodging: lodgingReducer,
    lodgingDetailed: lodgingDetailedReducer,
    lodgingReview: lodgingReviewReducer,
    tour: tourReducer,
    tourDetailed: tourDetailedReducer,
    user: userReducer,
    host: hostReducer,
    manager: managerReducer,
    packageList: packageListReducer, // 사용자 페이지에서 패키지 목록관리
    packageDetail: packageDetailReducer, // 사용자 페이지 패키지 상세 관리
    packageReview: packageReviewReducer,
    package: packageReducer, // <<<패키지등록관련(두수)>>>
    counter: counterReducer, // 오피스, 숙소 수량 관리
    peopleCounter: peopleCounterReducer, // 예약 시 인원 추가 관리
    favorite: favoriteReducer, // 오피스, 숙소 찜 관리
    mainOffice: mainOfficeReducer,
    mainPackage: mainPackageReducer,
    mainLodging: mainLodgingReducer,
  },
});

export default store;
