import { MealCard } from './LeftWidget/MealCard';
import { CalendarCard } from './LeftWidget/CalendarCard';

export const LeftWidget = () => {
  return (
    <div className="flex flex-col gap-4 w-72 py-8">
      <MealCard />
      <CalendarCard />
    </div>
  );
};
