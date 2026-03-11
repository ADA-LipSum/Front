interface Props {
  activeTab: 'coin' | 'point';
  setActiveTab: (tab: 'coin' | 'point') => void;
}

const ExchangeTabs = ({ activeTab, setActiveTab }: Props) => {
  return (
    <div className="flex px-10 mt-4">
      <button
        onClick={() => setActiveTab('coin')}
        className={`px-6 py-3 font-semibold border-b-3 transition 
        ${
          activeTab === 'coin'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-400'
        }`}
      >
        코인 상점
      </button>

      <button
        onClick={() => setActiveTab('point')}
        className={`px-6 py-3 font-semibold border-b-3 transition 
        ${
          activeTab === 'point'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-400'
        }`}
      >
        포인트 상점
      </button>
    </div>
  );
};

export default ExchangeTabs;
