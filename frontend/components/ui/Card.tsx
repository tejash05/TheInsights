import React from "react";

interface CardProps {
  title: string;
  value: React.ReactNode; // allows string, number, JSX, components
  subtext?: string;
}

export function Card({ title, value, subtext }: CardProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex flex-col">
      <span className="text-gray-500 text-sm">{title}</span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {subtext && <span className="text-xs text-gray-400 mt-1">{subtext}</span>}
    </div>
  );
}
