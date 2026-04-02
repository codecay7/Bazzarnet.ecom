import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ icon, title, value, change, changeType = 'increase' }) => {
  const isIncrease = changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-400' : 'text-red-400';
  const ChangeIcon = isIncrease ? ArrowUp : ArrowDown;

  return (
    <div className="bg-[var(--card-bg)] backdrop-blur-[5px] border border-white/30 rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium opacity-80">{title}</h3>
        <div className="text-[var(--accent)]">{React.cloneElement(icon, { size: 24 })}</div>
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
        <div className={`flex items-center text-sm mt-1 ${changeColor}`}>
          <ChangeIcon size={16} className="mr-1" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;