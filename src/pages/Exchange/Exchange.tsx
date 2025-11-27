import { Link } from 'react-router-dom';
import { useState } from 'react';

import { api } from '@/api/client';

type PurchaseLog = {
  logUuid: string;
  itemUuid: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPoints: number;
  pointsUuid: string;
  createdAt: string;
};

export default function Exchange() {
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<PurchaseLog[]>([]);
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
    setShowModal(true);
    await fetchLogs();
  };

  const closeModal = () => setShowModal(false);

  // 구매내역 불러오기
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/trade/my/logs', {
        params: { page: 0, size: 20 },
      });
      setLogs(res.data.data.content);
    } catch (err) {
      console.error('구매내역 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 헤더 */}
      <div className="w-[1920px] h-[200px] mx-auto flex items-center px-4 bg-gray-200">
        <h1 className="ml-10 text-4xl font-bold">거래소</h1>
      </div>

      {/* 내 구매내역 버튼 */}
      <div className="max-w-[1500px] mx-auto mt-10 px-4 flex justify-end">
        <button
          onClick={openModal}
          className="px-5 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          내 구매내역 보기
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="max-w-[1500px] mx-auto mt-10 grid grid-cols-3 gap-8 px-4 py-25">
        {/* 간식 구매 페이지 */}
        <Link
          to="/exchange/snacks"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">간식 구매</h2>
          <p className="mb-5 text-gray-600">
            초코바, 젤리, 음료 등 다양한 간식을 구매할 수 있어요.
          </p>
          <div className="px-4 py-2 text-white bg-blue-600 rounded-lg w-fit hover:bg-blue-700">
            이동하기
          </div>
        </Link>

        {/* 장비 구매 */}
        <Link
          to="/exchange/devices"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">장비 / 키보드 구매</h2>
          <p className="mb-5 text-gray-600">키보드, 마우스 등 아이템을 구매해 업그레이드하세요.</p>
          <div className="px-4 py-2 text-white bg-green-600 rounded-lg w-fit hover:bg-green-700">
            이동하기
          </div>
        </Link>

        {/* 장식 구매 */}
        <Link
          to="/exchange/profile-decor"
          className="block p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
        >
          <h2 className="mb-3 text-2xl font-bold">장식 구매</h2>
          <p className="mb-5 text-gray-600">프로필 이미지, 배너 등 내 페이지를 꾸며보세요.</p>
          <div className="px-4 py-2 text-white bg-purple-600 rounded-lg w-fit hover:bg-purple-700">
            이동하기
          </div>
        </Link>
      </div>

      {/* 구매내역 모달 영역 */}
      {showModal && (
        <div
          onClick={closeModal}
          className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-opacity-50"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-[700px] max-h-[80vh] bg-white rounded-xl shadow-xl p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">내 구매내역</h2>
              <button onClick={closeModal} className="text-xl text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* 로딩 */}
            {loading && <p className="mt-10 text-center text-gray-500">불러오는 중...</p>}

            {/* 구매내역 리스트 */}
            {!loading && logs.length === 0 && (
              <p className="mt-10 text-center text-gray-500">구매내역이 없습니다.</p>
            )}

            {!loading &&
              logs.map(log => (
                <div
                  key={log.logUuid}
                  className="p-4 mb-4 transition rounded-lg shadow-sm bg-gray-50 hover:shadow-md"
                >
                  <div className="flex justify-between">
                    <strong className="text-lg">{log.itemName}</strong>
                    <span className="text-sm text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 text-gray-700">
                    <p>구매 수량: {log.quantity}개</p>
                    <p>개당 가격: {log.unitPrice.toLocaleString()}P</p>
                    <p className="font-semibold text-blue-600">
                      총 사용 포인트: {log.totalPoints.toLocaleString()}P
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
}
