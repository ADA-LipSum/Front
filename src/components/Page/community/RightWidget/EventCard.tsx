import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

interface EventCardProps {
  events?: Event[];
}

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: 'LipSum',
    date: '28–29일',
    location: '컨퍼런스홀',
    description: '조만간 배포할 예정이니\n기대해주세요.',
    imageUrl: 'https://github.com/ADA-LipSum/.github/raw/main/profile/LipSum_new_logo.jpg',
  },
  {
    id: 2,
    title: 'LipSum 해커톤 2023',
    date: '7월 15일',
    location: '온라인',
    description: '48시간 해커톤에 참가하고\n최대 ₩500,000 상금을 받아가세요.',
    imageUrl: 'https://github.com/ADA-LipSum/.github/raw/main/profile/LipSum_new_logo.jpg',
  },
  {
    id: 3,
    title: '개발자 네트워킹 밋업',
    date: '8월 3일',
    location: '서울 강남구',
    description: '현직 개발자들과 함께하는\n커리어 네트워킹 이벤트.',
    imageUrl: 'https://github.com/ADA-LipSum/.github/raw/main/profile/LipSum_new_logo.jpg',
  },
];

export const EventCard = ({ events = MOCK_EVENTS }: EventCardProps) => {
  const [eventIndex, setEventIndex] = useState(0);
  const [openEvent, setOpenEvent] = useState(true);

  const currentEvent = events[eventIndex];
  const total = events.length;

  return (
    <div className="relative bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      {/* 이벤트명 + 페이지네이션 */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <h2 className="text-md font-black tracking-tight leading-none text-gray-900 wrap-break-word">
          {currentEvent.title}
        </h2>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setEventIndex((i) => (i - 1 + total) % total)}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="이전 이벤트"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[11px] font-bold text-gray-400 tabular-nums">
            {eventIndex + 1}/{total}
          </span>
          <button
            onClick={() => setEventIndex((i) => (i + 1) % total)}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="다음 이벤트"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setOpenEvent((v) => !v)}
            className="p-0.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
            aria-label="이벤트 접기/펼치기"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${openEvent ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className={`transition-all duration-200 overflow-hidden ${openEvent ? 'max-h-96' : 'max-h-0'}`}>
        {/* 아트 영역 — 이미지 자리 */}
        <div className="mx-4 rounded-sm overflow-hidden bg-gray-100 relative">
          <img
            src={currentEvent.imageUrl}
            alt={currentEvent.title}
            className="w-full h-32 object-cover"
          />
        </div>

        {/* 콘텐츠 */}
        <div className="px-4 pt-3 pb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2.5">
            <span>{currentEvent.date}</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-sm shrink-0" />
            <span>{currentEvent.location}</span>
          </div>
          <p className="text-sm font-bold leading-snug text-gray-900 mb-3 whitespace-pre-line">
            {currentEvent.description}
          </p>
          <button className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 active:bg-gray-600 transition text-sm font-bold text-white rounded-lg">
            자세히 보기
          </button>
        </div>

        {/* 하단 dot 인디케이터 */}
        <div className="flex justify-center gap-1.5 pb-3">
          {events.map((_, i) => (
            <button
              key={i}
              onClick={() => setEventIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === eventIndex ? 'bg-gray-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`${i + 1}번 이벤트`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
