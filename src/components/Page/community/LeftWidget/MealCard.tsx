import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Utensils } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMeal, type MealInfo } from '@/api/meal';

type MealType = '조식' | '중식' | '석식';

interface MealCardProps {
  selectedDate?: Date;
}

const MEAL_KEY_MAP: Record<MealType, keyof Awaited<ReturnType<typeof getMeal>>> = {
  조식: 'breakfast',
  중식: 'lunch',
  석식: 'dinner',
};

const todayReal = new Date();

const formatDate = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

export const MealCard = ({ selectedDate: initialDate }: MealCardProps) => {
  const [activeMeal, setActiveMeal] = useState<MealType>('중식');
  const [selectedMealDate, setSelectedMealDate] = useState(initialDate ?? new Date(todayReal));
  const [openMeal, setOpenMeal] = useState(true);

  const { data: mealData, isLoading: mealLoading } = useQuery({
    queryKey: ['meal', formatDate(selectedMealDate)],
    queryFn: () => getMeal(formatDate(selectedMealDate)),
    staleTime: 1000 * 60 * 60 * 12,
  });

  const prevDay = () => setSelectedMealDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
  const nextDay = () => setSelectedMealDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1));

  const isSelectedToday =
    selectedMealDate.getFullYear() === todayReal.getFullYear() &&
    selectedMealDate.getMonth() === todayReal.getMonth() &&
    selectedMealDate.getDate() === todayReal.getDate();

  const rawMeal = mealData?.[MEAL_KEY_MAP[activeMeal]] ?? null;
  const currentMeal: MealInfo | null =
    rawMeal && typeof rawMeal === 'object' ? (rawMeal as MealInfo) : null;

  const mealDate = `${selectedMealDate.getMonth() + 1}월 ${selectedMealDate.getDate()}일`;

  return (
    <div className="bg-white rounded-sm overflow-hidden border border-gray-100 shadow-sm">
      <button
        onClick={() => setOpenMeal((v) => !v)}
        className="w-full px-4 pt-4 pb-2 flex items-center gap-2 text-left"
      >
        <Utensils size={15} className="text-orange-400 shrink-0" />
        <span className="text-sm font-semibold text-gray-700">
          {isSelectedToday ? '오늘의 급식' : '급식'}
        </span>
        <ChevronDown
          size={14}
          className={`ml-auto text-gray-400 transition-transform duration-200 ${openMeal ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`transition-all duration-200 overflow-hidden ${openMeal ? 'max-h-96' : 'max-h-0'}`}>
        <div className="px-4 pb-2 flex items-center gap-2 pt-0">
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={prevDay}
              className="p-0.5 rounded-sm hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-xs text-gray-400 w-16 text-center">{mealDate}</span>
            <button
              onClick={nextDay}
              className="p-0.5 rounded-sm hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex px-4 gap-1 mb-3">
          {(['조식', '중식', '석식'] as MealType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveMeal(type)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-all ${
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
          {mealLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="h-3.5 bg-gray-100 rounded-sm animate-pulse w-3/4" />
            ))
          ) : !currentMeal ? (
            <li className="text-xs text-gray-400 text-center py-2">급식 정보가 없습니다</li>
          ) : (
            <>
              {(currentMeal.menus ?? []).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-sm bg-orange-300 shrink-0" />
                  {item}
                </li>
              ))}
              {currentMeal.calorie && (
                <li className="pt-1 text-xs text-gray-400 font-medium text-right">
                  {currentMeal.calorie}
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};
