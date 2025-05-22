"use client";

import React, { useState, useEffect } from 'react';
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import moment from "jalali-moment";
import { FaCalendarAlt } from "react-icons/fa";
import styles from './styles.module.css';

// Interface for Persian date picker day value
interface DayValue {
  year: number;
  month: number;
  day: number;
}

interface PersianDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string | React.ReactNode;
  placeholder?: string;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  showLabel?: boolean;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label = "تاریخ",
  placeholder = "انتخاب تاریخ",
  error,
  description,
  required = false,
  className = "",
  showLabel = true,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayValue | null>(null);

  // Convert string date to DayValue object for the Persian date picker
  const stringToDayValue = (dateString: string): DayValue | null => {
    if (!dateString) return null;
    try {
      // If the date is already in Persian format (YYYY-MM-DD)
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        
        // Check if it's a valid date
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
          return { year, month, day };
        }
      }
      
      // If it's a Gregorian date, convert to Persian
      const persianDate = moment(dateString, 'YYYY-MM-DD').locale('fa');
      return {
        year: parseInt(persianDate.format('YYYY')),
        month: parseInt(persianDate.format('M')),
        day: parseInt(persianDate.format('D'))
      };
    } catch (error) {
      console.error("Error converting string to DayValue:", error);
      return null;
    }
  };

  // Convert DayValue object to string date
  const dayValueToString = (dayValue: DayValue | null): string => {
    if (!dayValue) return "";
    try {
      const { year, month, day } = dayValue;
      // Format with leading zeros for month and day
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');
      return `${year}-${formattedMonth}-${formattedDay}`;
    } catch (error) {
      console.error("Error converting DayValue to string:", error);
      return "";
    }
  };

  // Handle date change from the Persian date picker
  const handleDateChange = (value: DayValue) => {
    setSelectedDay(value);
    const dateString = dayValueToString(value);
    onChange(dateString);
  };

  // Initialize the selected day when the value prop changes
  useEffect(() => {
    if (value) {
      const dayValue = stringToDayValue(value);
      setSelectedDay(dayValue);
    } else {
      setSelectedDay(null);
    }
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {typeof label === 'string' ? (
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 ml-2" />
              <span>{label}</span>
              {required && <span className="text-red-500 mr-1">*</span>}
            </div>
          ) : (
            label
          )}
        </label>
      )}
      <div className={`relative ${styles.datePickerInput}`}>
        <DatePicker
          value={selectedDay}
          onChange={handleDateChange}
          inputPlaceholder={placeholder}
          locale="fa"
          calendarClassName={styles.responsiveCalendar}
          inputClassName={`w-full px-4 py-2 border rounded-lg ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
          shouldHighlightWeekends
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default PersianDatePicker;
