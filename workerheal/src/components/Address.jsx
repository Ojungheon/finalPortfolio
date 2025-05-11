import React, { useState, useEffect } from 'react';

const Address = ({
  zipCode,
  setZipCode,
  streetAdr,
  setStreetAdr,
  detailAdr,
  setDetailAdr,
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setZipCode(data.zonecode);
        setStreetAdr(data.roadAddress);
      },
    }).open();
  };

  return (
    <div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={zipCode}
          placeholder="우편번호"
          readOnly
          onClick={handlePostcode}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={streetAdr}
          placeholder="도로명 주소"
          readOnly
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={detailAdr}
          placeholder="상세 주소"
          onChange={(e) => setDetailAdr(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Address;
