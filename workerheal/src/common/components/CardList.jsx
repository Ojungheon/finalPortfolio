import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFavorite,
  clearFavorites,
  removeFavorite,
  setFavorites,
} from '../../redux/favoriteSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const CardContainer = styled.div`
  display: flex;
  width: 600px;
  height: 250px;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  width: 450px;
  height: 210px;
  margin-top: 20px;
  margin-left: 25px;

  img {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: -22px;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  position: relative;
`;

const Header = styled.div`
  display: grid;
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;

  span {
    margin-left: 8px;
    color: #6a6b6c;
    font-size: 16px;
  }
`;

const Tag = styled.p`
  display: flex;
  justify-content: center;
  font-size: 16px;
  color: #747474;
  margin: 4px 0;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  p {
    margin-left: 6px;
    font-size: 25px;
    font-weight: bold;
  }

  span {
    margin-left: 15px;
    font-size: 20px;
    color: #747474;
  }
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: -17px;
`;

const Price = styled.p`
  font-size: 22px;
  font-weight: bold;
  margin: 0;

  span {
    font-size: 16px;
    color: #747474;
  }
`;

const LimitPeople = styled.p`
  font-size: 16px;
  color: #747474;
  margin: 5px 0 0 0;
`;

const Heart = styled.div`
  display: grid;
  margin-left: 60px;
  justify-content: end;
  margin-top: -29px;
  cursor: pointer;
`;

const CardList = ({
  no,
  type,
  cardSrc,
  cardName,
  cardLocation,
  cardTag,
  cardPrice,
  cardScope,
  cardCount,
  cardLimitPeople,
  onClick,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorite.favorites);
  const token = sessionStorage.getItem('token');

  // 세션에서 로그인한 사용자의 memberNo 직접 가져옴
  const [memberNo, setMemberNo] = useState(null);

  useEffect(() => {
    const memberData = sessionStorage.getItem('member');
    if (memberData) {
      const member = JSON.parse(memberData);
      setMemberNo(member.no);
    }
  }, []);

  console.log('memberNo ::::', memberNo);

  useEffect(() => {
    if (!token || !memberNo) return; // memberNo가 설정된 후 실행

    const fetchFavorites = async () => {
      try {
        const resp = await fetch(
          `http://${API_SERVER}/api/member/saved/${memberNo}`,
          {
            method: 'GET',
            headers: {
              token: token,
              'Content-Type': 'application/json',
            },
          }
        );

        if (resp.ok) {
          const favoriteData = await resp.json();
          dispatch(setFavorites(favoriteData)); // Redux에 최신 찜 목록 저장
        } else {
          console.error('찜 목록 불러오기 실패', await resp.text());
        }
      } catch (error) {
        console.error('API 요청 실패:', error);
      }
    };

    fetchFavorites();
  }, [token, memberNo, dispatch]); // ✅ memberNo가 설정된 후 실행되도록 수정

  //  isFavorite` 상태를 Redux 기반으로 설정 (새로고침해도 유지됨)
  const isFavorite = useMemo(() => {
    return favorites.some((e) => e.no === no && e.type === type);
  }, [favorites, no, type]);

  // 찜 추가/삭제 기능
  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트 방지

    // if (!memberNo) {
    //   console.error('memberNo가 없습니다. 로그인이 필요합니다.');
    //   Swal.fire({
    //     title: '로그인 정보 오류',
    //     text: '회원 정보를 불러올 수 없습니다. 다시 로그인해주세요.',
    //     icon: 'error',
    //     confirmButtonText: '확인',
    //   });
    //   return;
    // }

    if (!token) {
      Swal.fire({
        title: '로그인이 필요합니다!',
        text: '찜하기 기능을 사용하려면 로그인하세요.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '로그인하기',
        cancelButtonText: '취소',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/member/login'); // 로그인 페이지로 이동
        }
      });
      return;
    }

    try {
      const addUrl = `http://${API_SERVER}/api/${type}/favorite`;
      const deleteUrl =
        type === 'lodging'
          ? `http://${API_SERVER}/api/${type}/favorite?memberNo=${memberNo}&lodgingNo=${no}`
          : `http://${API_SERVER}/api/${type}/favorite?memberNo=${memberNo}&officeNo=${no}`;

      let resp;
      if (isFavorite) {
        // 찜 취소
        resp = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            token: token,
            'Content-Type': 'application/json',
          },
        });

        if (resp.ok) {
          dispatch(removeFavorite({ no, type }));
        } else {
          console.error('찜 삭제 실패', await resp.text());
        }
      } else {
        // 찜 추가
        resp = await fetch(addUrl, {
          method: 'POST',
          headers: {
            token: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            memberNo: memberNo,
            officeNo: type === 'office' ? no : null,
            lodgingNo: type === 'lodging' ? no : null,
          }),
        });

        if (resp.ok) {
          dispatch(addFavorite({ no, type }));
        } else {
          console.error('찜 추가 실패', await resp.text());
        }
      }

      // 최신 찜 목록 다시 불러오기
      const updatedFavorites = await fetch(
        `http://${API_SERVER}/api/member/saved/${memberNo}`,
        {
          method: 'GET',
          headers: {
            token: token,
            'Content-Type': 'application/json',
          },
        }
      );

      if (updatedFavorites.ok) {
        const favoriteData = await updatedFavorites.json();
        // dispatch(setFavorites(favoriteData));
      }
    } catch (error) {
      console.error('API 요청 실패:', error);
    }

    console.log('요청 데이터:', {
      memberNo: memberNo,
      officeNo: type === 'office' ? no : null,
      lodgingNo: type === 'lodging' ? no : null,
    });
  };

  return (
    <CardContainer onClick={onClick}>
      <ImageWrapper>
        <img src={cardSrc} alt={cardName} />
      </ImageWrapper>
      <ContentWrapper>
        <Header>
          <Title>{cardName}</Title>
        </Header>

        <Heart onClick={handleFavoriteClick}>
          <FontAwesomeIcon
            icon={faHeart}
            size="xl"
            style={{
              color: isFavorite ? '#e83d30' : '#dbdbdb',
            }}
          />
        </Heart>

        <LocationWrapper>
          <FontAwesomeIcon icon={faLocationDot} color="#6a6b6c" />
          <span>{cardLocation}</span>
        </LocationWrapper>

        <Tag>#{cardTag}</Tag>

        <RatingWrapper>
          <FontAwesomeIcon icon={faStar} color="#FFD43B" />
          <p>{Number(cardScope).toFixed(1)}</p>
          <span>({cardCount})</span>
        </RatingWrapper>

        <PriceWrapper>
          <Price>
            {cardPrice} <span>원/일</span>
          </Price>
          <LimitPeople>최대 {cardLimitPeople}명</LimitPeople>
        </PriceWrapper>
      </ContentWrapper>
    </CardContainer>
  );
};

export default CardList;
