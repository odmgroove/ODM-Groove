"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  icon?: React.ReactNode;
  placeholder?: string;
};

export default function CustomSelect({ value, onChange, options, icon, placeholder = "Select an option" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[var(--dark-card)] border ${isOpen ? "border-[var(--gold)]" : "border-[var(--dark-border)]"} rounded-xl ${icon ? "pl-10" : "pl-4"} pr-4 py-3 text-sm transition-colors text-left focus:outline-none`}
      >
        {/* Absolute positioned icon if provided */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--warm-gray)]">
            {icon}
          </div>
        )}
        
        <span className={selectedOption ? "text-[var(--off-white)]" : "text-[var(--warm-gray)] truncate pr-4"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        <ChevronDown 
          size={16} 
          className={`text-[var(--warm-gray)] transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--gold)]" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-xl shadow-2xl shadow-black/50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[var(--dark-border)] ${
                value === option.value 
                  ? "bg-[var(--dark-border)] text-[var(--gold)] font-medium" 
                  : "text-[var(--off-white)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
