import { useEffect, useState } from "react";
import { api } from "../../api/client"; // baseURL 설정된 axios 인스턴스 사용

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

const handlePurchase = async (itemUuid: string) => {
  try {
    const res = await api.post("/api/trade/purchase", {
      itemUuid,
      quantity: 1, // 기본 구매 수량 1
    });

    console.log("구매 결과:", res.data);

    alert("구매 성공!");
    window.location.reload(); // 🔥 페이지 새로고침
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("구매 실패:", err);

    if (err.response?.status === 400) {
      alert("포인트가 부족합니다!");
    } else {
      alert("구매 중 오류가 발생했습니다.");
    }
  }
};

export default function DeviceShop() {
  const [point, setPoint] = useState<number>(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

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
        setPoint(pointData.totalPoints); // ⭐ 포인트 저장

        console.log("User Points:", pointData);
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
            category: "TOOLS",
            active: true,
            page: 0,
            size: 20,
            sort: "createdAt",
            dir: "desc",
          },
        });

        setItems(res.data.data.content);
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
      <div className="w-[1920px] h-[200px] mx-auto flex items-center px-4 bg-green-400 text-white">
        <h1 className="ml-10 text-4xl font-bold">기기 거래소</h1>
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

      {/* 카드 리스트 */}
      <div className="max-w-[1500px] mx-auto mt-10 grid grid-cols-4 gap-8 px-4 pb-20">
        {items.map((item) => (
          <div
            key={item.itemUuid}
            className="p-6 transition bg-white shadow-md cursor-pointer rounded-2xl hover:shadow-lg"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="object-contain w-full h-48 mb-4 bg-white rounded-lg"
            />

            <h2 className="mb-2 text-2xl font-bold">{item.name}</h2>
            <p className="mb-3 text-gray-600">
              {item.description || "설명 없음"}
            </p>

            <p className="text-lg font-semibold text-blue-600">
              가격: {item.price.toLocaleString()}P
            </p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm text-gray-500">재고: {item.stock}</span>
              <button
                onClick={() => handlePurchase(item.itemUuid)}
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
              >
                구매하기
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && !loading && (
          <p className="col-span-4 mt-20 text-lg text-center text-gray-500">
            등록된 TOOLS 아이템이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
