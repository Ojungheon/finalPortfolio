import React, { useState } from 'react';
import Address from './Address';

const AddressParents = () => {
  const [zipCode, setZipCode] = useState('');
  const [streetAdr, setStreetAdr] = useState('');
  const [detailAdr, setDetailAdr] = useState('');

  return (
    <div>
      <h1>어드레스 부모요소</h1>
      <form>
        {/* 주소 입력 컴포넌트 */}
        <Address
          zipCode={zipCode}
          setZipCode={setZipCode}
          streetAdr={streetAdr}
          setStreetAdr={setStreetAdr}
          detailAdr={detailAdr}
          setDetailAdr={setDetailAdr}
        />
      </form>
    </div>
  );
};

export default AddressParents;
