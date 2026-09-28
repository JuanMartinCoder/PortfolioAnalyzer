import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  rawValue?: number;
  subtitle: string;
  valueColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  rawValue,
  subtitle,
  valueColor,
}) => {


   const getColorClass = () => {
    if (valueColor) return valueColor;
    if (rawValue === undefined || rawValue === null) return 'text-slate-100';
    if (rawValue > 0) return 'text-emerald-400';
    if (rawValue < 0) return 'text-rose-500';
    return 'text-slate-100';
  };
  return (
  <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {title}
      </span>
      <div className="my-2">
        <span className={`text-2xl font-bold ${getColorClass()}`}>
          {value}
        </span>
      </div>
      <span className="text-[11px] text-slate-500">{subtitle}</span>
    </div>
);
};
