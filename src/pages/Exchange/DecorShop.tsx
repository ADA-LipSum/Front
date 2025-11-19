/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Snack/SnackShop.tsx
import { useEffect, useState } from "react";
import { api } from "../../api/client";

type Point = {
  userUuid: string;
  totalPoints: number;
};

type Item = {
  id: number;
  itemUuid: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  category: string;
  imageUrl: string;
  createdAt: string;
};

export default function DecorShop() {
  const [point, setPoint] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // ✔ 수량 상태 (각 itemUuid별로 저장)
  const [quantity, setQuantity] = useState<Record<string, number>>({});

  // ✔ 구매 요청 함수
  const handlePurchase = async (item: Item) => {
    let count = quantity[item.itemUuid] || 0;

    if (count <= 0) {
      count = 1; // ⭐ 최소 1 보장
    }

    const isOk = confirm(
      `${item.name}을(를) ${count}개 구매하시겠습니까?\n총 가격: ${(item.price * count).toLocaleString()}P`
    );
    if (!isOk) return;

    try {
      const res = await api.post("/api/trade/purchase", {
        itemUuid: item.itemUuid,
        quantity: count,
      });

      alert("구매 성공!");
      window.location.reload();
    } catch (err: any) {
      console.error("구매 실패:", err);

      if (err.response?.status === 400) {
        alert("포인트가 부족합니다!");
      } else {
        alert("구매 중 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        setLoading(true);
        const es = await api.get("/api/points/balance", {
          params: {
            userUuid: localStorage.getItem("user_uuid"),
          },
        });

        const pointData: Point = es.data.data;
        setPoint(pointData.totalPoints);
      } catch (err) {
        console.error("포인트 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/trade/items/search", {
          params: {
            category: "ETC",
            active: true,
            page: 0,
            size: 20,
            sort: "createdAt",
            dir: "desc",
          },
        });

        setItems(res.data.data.content);

        // 초기 수량 0으로 설정
        const initQty: Record<string, number> = {};
        res.data.data.content.forEach((item: Item) => {
          initQty[item.itemUuid] = 0;
        });
        setQuantity(initQty);
      } catch (err) {
        console.error("아이템 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPoints();
    fetchFoodItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="w-[1920px] h-[200px] mx-auto flex items-center px-4 bg-purple-400 text-white">
        <h1 className="ml-10 text-4xl font-bold">장식 거래소</h1>
      </div>

      {/* 로딩 */}
      {loading && (
        <p className="mt-10 text-xl font-semibold text-center text-gray-600">
          불러오는 중...
        </p>
      )}

      {/* 사용자 포인트 */}
      <div className="max-w-[1500px] mx-auto mt-10 px-4 py-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold">내 포인트</h2>
        <p className="mt-2 text-lg text-gray-700">
          현재 보유 포인트:{" "}
          <span className="font-bold text-blue-600">
            {point.toLocaleString()}P
          </span>
        </p>
      </div>

      {/* 아이템 카드 */}
      <div className="max-w-[1500px] mx-auto mt-10 grid grid-cols-4 gap-8 px-4 pb-20">
        {items.map((item) => (
          <div
            key={item.itemUuid}
            className="p-6 transition bg-white shadow-md rounded-2xl hover:shadow-lg"
          >
            {/* 카드 이미지 - 배너 크기에 맞춰 꽉 차게 */}
            <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="absolute top-0 left-0 object-cover w-full h-full"
              />
            </div>

            <h2 className="mb-2 text-2xl font-bold">{item.name}</h2>
            <p className="mb-3 text-gray-600">
              {item.description || "설명 없음"}
            </p>

            <p className="text-lg font-semibold text-blue-600">
              가격: {item.price.toLocaleString()}P
            </p>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handlePurchase(item)}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                구매하기
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !loading && (
          <p className="col-span-4 mt-20 text-lg text-center text-gray-500">
            등록된 장식 아이템이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
