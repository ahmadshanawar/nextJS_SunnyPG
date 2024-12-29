import React, { useState } from "react";
import DatePicker, { DatePickerProps } from "react-date-picker";
import { format } from "date-fns";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import "./DateSelector.css"; // Custom CSS for smaller calendar

interface DateSelectorProps {
  value: Date | null;
  onChange: (date: string) => void;
  label: string;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange, label }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  const handleDateChange: DatePickerProps["onChange"] = (date) => {
    if (Array.isArray(date)) {
      setSelectedDate(date[0]);
      if (date[0]) {
        onChange(format(date[0], "yyyy-MM-dd"));
      }
    } else {
      setSelectedDate(date);
      onChange(format(date!, "yyyy-MM-dd"));
    }
  };

  return (
    <div className="mb-1 w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <DatePicker
        onChange={handleDateChange}
        value={selectedDate}
        format="dd/MM/yyyy"
        className="border rounded w-full small-calendar"
        clearIcon={null}
        calendarIcon={
          <span role="img" aria-label="calendar">
            📅
          </span>
        }
      />
    </div>
  );
};

export default DateSelector;
