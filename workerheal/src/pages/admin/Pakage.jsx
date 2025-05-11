import React from 'react';
import { Link } from 'react-router-dom';
import Styled from 'styled-components';
import PackageCard from '../../common/components/PackageCard';

const CardContainer = Styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 🔹 항상 2개씩 배치 */
  gap: 20px;
  width: 100%;
  max-width: 1300px; /* 🔹 전체가 너무 넓어지지 않도록 조정 */
  margin: 0 auto;
  justify-content: center; /* 🔹 가운데 정렬 */
`;

const packageDataList = [
  {
    id: 1, // 추가된 id
    image:
      'https://media.licdn.com/dms/image/C4E12AQGgvQRQVcJmRg/article-cover_image-shrink_600_2000/0/1580461425272?e=2147483647&v=beta&t=fyK3x2fgJIj8sB4YkKrkUw5aiV4EtXa3n7HUONlOduM',
    title: '데스커 워케이션',
    date: '2025-01-03 ~ 2025-02-25',
    favorite: '찜',
    rating: '★4.3(124)',
    discount: '12%',
    details: '최대 15명 #체험 #공기좋은',
  },
  {
    id: 2, // 추가된 id
    image:
      'https://media.licdn.com/dms/image/C4E12AQGgvQRQVcJmRg/article-cover_image-shrink_600_2000/0/1580461425272?e=2147483647&v=beta&t=fyK3x2fgJIj8sB4YkKrkUw5aiV4EtXa3n7HUONlOduM',
    title: '비즈니스 여행',
    date: '2025-03-10 ~ 2025-04-15',
    favorite: '찜',
    rating: '★4.5(98)',
    discount: '10%',
    details: '최대 10명 #비즈니스 #편안한',
  },
  {
    id: 3, // 추가된 id
    image:
      'https://media.licdn.com/dms/image/C4E12AQGgvQRQVcJmRg/article-cover_image-shrink_600_2000/0/1580461425272?e=2147483647&v=beta&t=fyK3x2fgJIj8sB4YkKrkUw5aiV4EtXa3n7HUONlOduM',
    title: '힐링 캠프',
    date: '2025-05-01 ~ 2025-06-10',
    favorite: '찜',
    rating: '★4.8(75)',
    discount: '15%',
    details: '최대 8명 #힐링 #자연속에서',
  },
];

const Pakage = () => {
  return (
    <div>
      <CardContainer>
        {packageDataList.map((data) => (
          <Link to={`/details/${data.id}`}>
            {' '}
            <PackageCard data={data} />
          </Link>
        ))}
      </CardContainer>
    </div>
  );
};

export default Pakage;
