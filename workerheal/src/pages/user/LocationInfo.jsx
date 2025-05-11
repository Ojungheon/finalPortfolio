import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const InfoContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const Location = styled.p`
  color: #6a6b6c;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  margin: 10px 0;
`;

const Tag = styled.span`
  background-color: #cbcbcb;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 14px;
`;

const LocationInfo = ({ name, location, tags }) => {
  console.log('🚀 태그 데이터:', tags);
  console.log('🚀 태그 타입:', typeof tags);
  console.log('🚀 tags isArray:', Array.isArray(tags));

  const safeTags =
    typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : [];

  return (
    <InfoContainer>
      <Title>{name}</Title>
      <Location>
        <FontAwesomeIcon icon={faLocationDot} style={{ color: '#6a6b6c' }} />
        {location}
      </Location>

      {safeTags.length > 0 ? (
        <TagContainer>
          {safeTags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagContainer>
      ) : (
        <p>태그 정보 없음</p> // ✅ 태그가 없을 경우 대비
      )}
    </InfoContainer>
  );
};

export default LocationInfo;
