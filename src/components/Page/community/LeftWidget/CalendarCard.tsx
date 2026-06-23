import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, CalendarDays } from 'lucide-react';

interface SchoolEvent {
  date: number;
  month: number;
  title: string;
  color: string;
}

interface CalendarCardProps {
  mockEvents?: SchoolEvent[];
}

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

export const CalendarCard = ({ mockEvents = MOCK_EVENTS }: CalendarCardProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1));
  const [openCalendar, setOpenCalendar] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isToday = (d: number) =>
    d === todayReal.getDate() && month === todayReal.getMonth() && year === todayReal.getFullYear();

  const monthEvents = mockEvents.filter((e) => e.month === month);
  const eventDateSet = new Set(monthEvents.map((e) => e.date));

  const calDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpenCalendar((v) => !v)}
        className="w-full px-4 pt-4 pb-2 flex items-center gap-2 text-left"
      >
        <CalendarDays size={15} className="text-blue-400 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">학사 일정</span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${openCalendar ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`transition-all duration-200 overflow-hidden ${openCalendar ? 'max-h-150' : 'max-h-0'}`}>
        {/* 월 네비게이션 */}
        <div className="flex items-center justify-between px-3 mb-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-sm hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold text-gray-700">
            {year}년 {MONTH_NAMES[month]}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-sm hover:bg-gray-100 text-gray-400 transition-colors"
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
                      className={`w-7 h-7 flex items-center justify-center rounded-sm text-xs font-medium transition-colors cursor-default ${
                        isToday(day)
                          ? 'bg-blue-500 text-white font-bold'
                          : col === 0
                            ? 'text-red-400 hover:bg-red-100'
                            : col === 6
                              ? 'text-blue-400 hover:bg-blue-100'
                              : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </div>
                    {eventDateSet.has(day) && (
                      <span className="w-1 h-1 rounded-sm bg-orange-400 mt-0.5" />
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
                <span className={`w-2 h-2 rounded-sm shrink-0 ${event.color}`} />
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
