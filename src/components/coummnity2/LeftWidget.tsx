import { useState } from 'react';
import { ChevronLeft, ChevronRight, Utensils, CalendarDays } from 'lucide-react';

type MealType = '조식' | '중식' | '석식';

interface MealMenu {
  type: MealType;
  items: string[];
  kcal: number;
}

interface SchoolEvent {
  date: number;
  month: number;
  title: string;
  color: string;
}

const MOCK_MEALS: MealMenu[] = [
  {
    type: '조식',
    items: ['쌀밥', '미역국', '계란후라이', '깍두기', '우유'],
    kcal: 580,
  },
  {
    type: '중식',
    items: ['쌀밥', '된장찌개', '제육볶음', '콩나물무침', '깍두기', '배추김치'],
    kcal: 850,
  },
  {
    type: '석식',
    items: ['쌀밥', '북어국', '돼지불고기', '시금치나물', '배추김치'],
    kcal: 780,
  },
];

const MOCK_EVENTS: SchoolEvent[] = [
  { date: 2, month: 5, title: '중간고사 시작', color: 'bg-red-400' },
  { date: 6, month: 5, title: '중간고사 종료', color: 'bg-red-400' },
  { date: 15, month: 5, title: '현충일 (휴일)', color: 'bg-blue-400' },
  { date: 20, month: 5, title: '학교 체육대회', color: 'bg-green-400' },
  { date: 25, month: 5, title: '수행평가 제출', color: 'bg-orange-400' },
  { date: 30, month: 5, title: '기말고사 시작', color: 'bg-red-400' },
  { date: 10, month: 6, title: '기말고사 종료', color: 'bg-red-400' },
  { date: 17, month: 6, title: '제헌절 기념행사', color: 'bg-blue-400' },
  { date: 24, month: 6, title: '방학식', color: 'bg-green-400' },
];

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const todayReal = new Date();

export const LeftWidget = () => {
  const [activeMeal, setActiveMeal] = useState<MealType>('중식');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d: number) =>
    d === todayReal.getDate() && month === todayReal.getMonth() && year === todayReal.getFullYear();

  const monthEvents = MOCK_EVENTS.filter((e) => e.month === month);
  const eventDateSet = new Set(monthEvents.map((e) => e.date));

  const currentMeal = MOCK_MEALS.find((m) => m.type === activeMeal)!;

  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const mealDate = `${todayReal.getMonth() + 1}월 ${todayReal.getDate()}일`;

  return (
    <div className="flex flex-col gap-4 w-68 py-25">
      {/* 급식 카드 */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Utensils size={15} className="text-orange-400 shrink-0" />
          <span className="text-sm font-semibold text-gray-700">오늘의 급식</span>
          <span className="ml-auto text-xs text-gray-400">{mealDate}</span>
        </div>

        {/* 탭 */}
        <div className="flex px-4 gap-1 mb-3">
          {(['조식', '중식', '석식'] as MealType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveMeal(type)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeMeal === type
                  ? 'bg-orange-50 text-orange-500 border border-orange-200'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 메뉴 목록 */}
        <ul className="px-4 pb-4 space-y-1.5">
          {currentMeal.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0" />
              {item}
            </li>
          ))}
          <li className="pt-1 text-xs text-gray-400 font-medium text-right">
            {currentMeal.kcal} kcal
          </li>
        </ul>
      </div>

      {/* 학사 일정 카드 */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <CalendarDays size={15} className="text-blue-400 shrink-0" />
          <span className="text-sm font-semibold text-gray-700">학사 일정</span>
        </div>

        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between px-3 mb-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {year}년 {MONTH_NAMES[month]}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-3 mb-0.5">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-medium py-1 ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 px-3 pb-3">
          {calDays.map((day, idx) => {
            const col = idx % 7;
            return (
              <div key={idx} className="flex flex-col items-center py-0.5">
                {day !== null && (
                  <>
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors cursor-default ${
                        isToday(day)
                          ? 'bg-blue-500 text-white font-bold'
                          : col === 0
                            ? 'text-red-400 hover:bg-red-50'
                            : col === 6
                              ? 'text-blue-400 hover:bg-blue-50'
                              : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </div>
                    {eventDateSet.has(day) && (
                      <span className="w-1 h-1 rounded-full bg-orange-400 mt-0.5" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 이벤트 목록 */}
        {monthEvents.length > 0 && (
          <div className="px-4 pb-4 space-y-1.5 border-t border-gray-100 pt-3 max-h-36 overflow-y-auto">
            {monthEvents.map((event, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${event.color}`} />
                <span className="text-xs text-gray-500 leading-snug">
                  <span className="font-medium text-gray-600">
                    {month + 1}/{event.date}
                  </span>{' '}
                  {event.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
