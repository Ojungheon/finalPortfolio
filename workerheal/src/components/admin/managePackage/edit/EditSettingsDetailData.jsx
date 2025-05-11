import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { setImage, setPackageNo } from '../../../../redux/packageSlice';
import useAuthorityCheck from '../../../../hook/useAuthorityCheck';

const API_SERVER = process.env.REACT_APP_SERVER_ROOT;

const WholeArea = styled.div`
  & h3 {
    height: 24px;
  }
`;

const Layout = styled.div`
  width: 95%;
  height: 95%;
  border: 1px solid gray;
  display: grid;
  grid-template-rows: 4fr 3fr;
`;

const SettingDate = styled.div`
  display: flex;
  flex-direction: row; /* 가로로 배치 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: top; /* 세로 중앙 정렬 */

  & > div {
    display: flex;
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: center; /* 가로 중앙 정렬 */
    width: 120px;
    height: 40px;
    background-color: #ededed;
    border-radius: 5px;
    margin-right: 20px;
  }

  & h3 {
    margin-left: 10px; /* 불필요한 마진 제거 */
  }
`;

const SettingDc = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬 */

  & > div {
    display: flex; /* 내부 요소 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: space-evenly; /* 가로 중앙 정렬 */
    height: 40px;

    & > input {
      width: 100px;
      height: 40px;
      background-color: #ededed;
      border: none;
      border-radius: 5px;
      padding-left: 10px;
    }

    & > h3 {
      height: 10px;
    }
  }
`;

const InfoAreaOne = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
`;

const InfoAreaTwo = styled.div`
  display: grid;
  margin: 20px;
`;

const PackageImage = styled.div`
  display: grid;
  grid-template-rows: 1fr 12px;
  & > p {
    font-size: 12px;
    color: gray;
    position: relative;
    top: -20px;
    left: 24px;
  }
`;

const ImgBox = styled.div`
  display: grid;
  width: 700px;
  height: 300px;
  grid-template-columns: 1fr;
  border-radius: 15px;
  margin: 20px;
  background-color: gray;
  place-content: center;

  img {
    width: 100%;
    height: 100%;
    overflow: hidden;
    object-fit: cover; /* 비율 유지하면서 넘치는 부분 잘림 */
  }
`;

const MiddleInfo = styled.div`
  margin: 20px;
`;

const HashTagSetting = styled.div`
  margin: 20px;
  & > span {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
`;

const NaviButtons = styled.div`
  display: flex;
  flex-direction: rows;
  justify-content: space-between;
  width: 95%;
`;

const PrevStep = styled.div`
  color: #8041ff;
  font-size: 1.5em;
  margin-top: 20px;
  border-radius: 15px;
  cursor: pointer;
`;

const NextStep = styled.div`
  color: #8041ff;
  font-size: 1.5em;
  margin-top: 20px;
  border-radius: 15px;
  cursor: pointer;
`;

const TagInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  & input {
    background-color: #ededed;
    width: 250px;
    height: 40px;
    border: none;
    padding: 0 10px;
    border-radius: 5px;
  }

  & button {
    width: 40px;
    height: 40px;
    background-color: #8041ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2em;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const AddedTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background-color: #ededed;
  border-radius: 5px;
  font-size: 0.9em;

  & span {
    color: #8041ff; /* #8041ff 색상 적용 */
  }

  & button {
    background: none;
    border: none;
    color: red;
    cursor: pointer;
    font-size: 1.2em;
  }
`;

const PackageTitle = styled.div`
  width: 500px;
  height: 44px;
  margin-bottom: 10px;

  & > input {
    width: 500px;
    height: 44px;
    background-color: #ededed;
    margin-bottom: 10px;
    border: 0px solid #ededed;
    padding-left: 10px;
    border-radius: 5px;
  }
`;

const PackageContent = styled.div`
  width: 100%;
  height: 150px;
  border-radius: 5px;

  & > textarea {
    width: 99%;
    height: 150px;
    background-color: #ededed;
    margin-bottom: 10px;
    border: 0px solid #ededed;
    padding-left: 10px;
    border-radius: 5px;
    padding-top: 10px;
    resize: none; /* 크기 조절 없애기 */
    font-weight: 500;
  }
`;

const EditSettingsDetailData = ({ settingdata }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const checkLogin = useAuthorityCheck('MANAGER', '/manager/login');
  const [isChecking, setIsChecking] = useState(true);

  /* ################### 로그인 검증 ################### */
  useEffect(() => {
    if (checkLogin()) {
      setIsChecking(false);
    }
  }, []);

  const selectedLodging = useSelector((state) => state.package.selectedLodging);
  const selectedOffice = useSelector((state) => state.package.selectedOffice);
  const selectedProgram = useSelector((state) => state.package.selectedProgram);

  const [packageSettings, setPackageSettings] = useState({
    name: '',
    detail: '',
    discount: '',
    openDate: '',
    closeDate: '',
    isTemporary: 'N', // 초기값 'N'으로 설정
  });

  const [selectedRegion, setSelectedRegion] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImageState] = useState(null);

  const packageNo = useSelector((state) => state.package.packageNo);

  useEffect(() => {
    if (!packageNo) return;

    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(
          `http://${API_SERVER}/api/manager/packages/detail/${packageNo}`,
          {
            headers: {
              token: sessionStorage.getItem('token'),
            },
          }
        );
        const data = await response.json();
        console.log('data ::::::::::: ', data);

        setPackageSettings({
          name: data.name,
          detail: data.detail,
          discount: data.discount,
          openDate: data.openDate ? data.openDate.substring(0, 10) : '',
          closeDate: data.closeDate ? data.closeDate.substring(0, 10) : '',
          isTemporary:
            data.openDate || data.closeDate || data.discount ? 'Y' : 'N', // 초기값 설정
        });

        if (data.tags) {
          const tagsArray = data.tags.split(',');
          setTags(tagsArray);
        }

        if (data.image) {
          setImageState(data.image);
          dispatch(setImage(data.image));
        }

        setSelectedRegion(data.regionNo || '');
      } catch (error) {
        console.error('패키지 데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchPackageDetails();
  }, [packageNo, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPackageSettings((prev) => {
      const updatedSettings = { ...prev, [name]: value };
      updatedSettings.isTemporary =
        updatedSettings.openDate ||
        updatedSettings.closeDate ||
        updatedSettings.discount
          ? 'Y'
          : 'N';
      return updatedSettings;
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImageState(file);
      dispatch(setImage(imageUrl));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRegion) {
      alert('지역을 선택해주세요.');
      return;
    }

    const regionNo = parseInt(selectedRegion, 10);
    if (isNaN(regionNo)) {
      alert('유효한 지역을 선택해주세요.');
      return;
    }

    const packageData = {
      no: packageNo,
      name: packageSettings.name,
      detail: packageSettings.detail,
      discount: packageSettings.discount,
      openDate: packageSettings.openDate,
      closeDate: packageSettings.closeDate,
      regionNo,
      lodgingNo: selectedLodging[0]?.no || '',
      officeNo: selectedOffice?.no || '',
      tourSpotNo: selectedProgram?.no || '',
      tag: tags.join(','),
      isTemporary: packageSettings.isTemporary,
    };

    const formData = new FormData();
    formData.append(
      'package',
      new Blob([JSON.stringify(packageData)], { type: 'application/json' })
    );

    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(
        `http://${API_SERVER}/api/manager/packages/edit`,
        {
          method: 'POST',
          headers: {
            token: sessionStorage.getItem('token'),
          },
          body: formData,
        }
      );

      // 응답이 JSON이 아닌 경우 텍스트로 처리
      const responseText = await response.text(); // 텍스트 응답을 받아옴
      let result;

      try {
        result = JSON.parse(responseText); // 텍스트를 JSON으로 파싱
      } catch (e) {
        result = { message: responseText }; // JSON 파싱 실패 시 텍스트를 메시지로 처리
      }

      if (!response.ok) {
        throw new Error(
          `서버 오류: ${response.status} - ${result.message || result}`
        );
      }

      alert(result.message || '패키지가 성공적으로 수정되었습니다.');
      navigate('/manager/package/list');
    } catch (error) {
      console.error('❌ 에러 발생:', error);
      alert(`패키지 수정 중 오류가 발생했습니다.\n${error.message}`);
    }
  };

  return isChecking ? (
    <div></div>
  ) : (
    <WholeArea>
      <Layout>
        <InfoAreaOne>
          <PackageImage>
            <ImgBox onClick={() => fileInputRef.current.click()}>
              {image ? (
                <img
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt="Uploaded"
                />
              ) : (
                'image'
              )}
            </ImgBox>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <p>*화면기준 1920 X 543</p>
          </PackageImage>

          <MiddleInfo>
            <h3>기간설정</h3>
            <SettingDate>
              <input
                type="date"
                name="openDate"
                value={packageSettings.openDate}
                onChange={handleChange}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="date"
                name="closeDate"
                value={packageSettings.closeDate}
                onChange={handleChange}
              />
            </SettingDate>
            <h3>할인율 설정</h3>
            <SettingDc>
              <input
                type="number"
                name="discount"
                value={packageSettings.discount}
                onChange={handleChange}
                placeholder="%"
              />
            </SettingDc>
            <h3>지역 설정</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '5px',
              }}
            >
              {[
                { id: '01', name: '서울' },
                { id: '02', name: '경기' },
                { id: '03', name: '인천' },
                { id: '04', name: '강원' },
                { id: '05', name: '대전' },
                { id: '06', name: '충북' },
                { id: '07', name: '충남' },
                { id: '08', name: '전남' },
                { id: '09', name: '전북' },
                { id: '10', name: '광주' },
                { id: '11', name: '경북' },
                { id: '12', name: '경남' },
                { id: '13', name: '대구' },
                { id: '14', name: '울산' },
                { id: '15', name: '부산' },
                { id: '16', name: '제주' },
              ].map((region) => (
                <label
                  key={region.id}
                  style={{
                    borderRadius: '5px',
                    backgroundColor:
                      selectedRegion === region.id ? '#8041ff' : '#ededed',
                    color: selectedRegion === region.id ? 'white' : 'black',
                    cursor: 'pointer',
                    padding: '6px',
                    fontSize: '10pt',
                  }}
                  onClick={() => setSelectedRegion(region.id)}
                >
                  {region.name}
                  <input type="radio" name="region" value={region.id} hidden />
                </label>
              ))}
            </div>
          </MiddleInfo>

          <HashTagSetting>
            <h3>해쉬태그 설정</h3>
            <TagInputWrapper>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="태그 입력"
              />
              <button type="button" onClick={handleAddTag}>
                +
              </button>
            </TagInputWrapper>
            <TagList>
              {tags.map((tag, index) => (
                <AddedTag key={index}>
                  <span>#{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(index)}>
                    ×
                  </button>
                </AddedTag>
              ))}
            </TagList>
          </HashTagSetting>
        </InfoAreaOne>

        <InfoAreaTwo>
          <PackageTitle>
            <input
              type="text"
              name="name"
              value={packageSettings.name}
              onChange={handleChange}
              placeholder="제목 입력"
            />
          </PackageTitle>
          <PackageContent>
            <textarea
              name="detail"
              value={packageSettings.detail}
              onChange={handleChange}
              placeholder="내용 입력"
            ></textarea>
          </PackageContent>
        </InfoAreaTwo>
      </Layout>

      <NaviButtons>
        <PrevStep type="button" onClick={() => navigate(-1)}>
          뒤로
        </PrevStep>
        <NextStep onClick={handleSubmit}>패키지 수정 완료</NextStep>
      </NaviButtons>
    </WholeArea>
  );
};

export default EditSettingsDetailData;
