import type { TabType } from '@/types/community';

const TABS: TabType[] = ['전체', '모집중', '모집완료'];

interface CommunityTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const CommunityTabs = ({ activeTab, onTabChange }: CommunityTabsProps) => {
  return (
    <div className="flex gap-8 border-b border-[#E0E0E0] mb-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`pb-3 text-base font-medium transition ${
            activeTab === tab
              ? 'text-black border-b-2 border-black'
              : 'text-[#757575] hover:text-black'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
