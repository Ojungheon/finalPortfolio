import React, { useEffect, useRef, useState } from 'react';

const InfiniteScroll = ({
  fetchData, // 데이터를 가져오는 함수
  hasMore, // 더 로드할 데이터가 있는지 여부
  threshold = 1.0, // 가시성 기준 (기본값은 100%)
  root = null, // 감지 기준 컨테이너 (기본값은 viewport)
  rootMargin = '0px', // 마진 설정
  children,
}) => {
  const targetRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasMore) return;

    const observerOptions = {
      root,
      rootMargin,
      threshold,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        setLoading(true);
        fetchData().finally(() => setLoading(false));
      }
    }, observerOptions);

    if (targetRef.current) observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [fetchData, hasMore, loading, root, rootMargin, threshold]);

  return (
    <div>
      {children}
      {hasMore && (
        <div
          ref={targetRef}
          style={{ height: '20px', background: 'transparent' }}
        />
      )}
      {loading && <p>Loading....</p>}
    </div>
  );
};

export default InfiniteScroll;
