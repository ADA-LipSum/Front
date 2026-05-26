interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  categories?: string[];
}

const DEFAULT_CATEGORIES = ['전체', '과자', '캔디', '음료', '간편식'];

export const CategoryFilter = ({
  selected,
  onChange,
  categories = DEFAULT_CATEGORIES,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
            selected === cat
              ? 'bg-[#e8d13a] text-white border-[#e8d13a]'
              : 'bg-white text-gray-600 border-gray-300 hover:border-[#e8d13a] hover:text-[#e8d13a]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
