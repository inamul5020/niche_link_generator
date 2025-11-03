
import React from 'react';

interface NicheListProps {
  niches: string[];
  selectedNiche: string | null;
  onNicheSelect: (niche: string) => void;
  isDisabled: boolean;
}

const NicheList: React.FC<NicheListProps> = ({ niches, selectedNiche, onNicheSelect, isDisabled }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg max-h-[75vh] overflow-y-auto">
      <ul className="divide-y divide-slate-700">
        {niches.map((niche, index) => (
          <li key={index}>
            <button
              onClick={() => onNicheSelect(niche)}
              disabled={isDisabled}
              className={`w-full text-left p-4 text-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 ${
                selectedNiche === niche
                  ? 'bg-teal-500 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700/50'
              } ${isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              {niche}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NicheList;
