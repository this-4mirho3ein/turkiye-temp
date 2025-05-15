import React from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

const PersianDatePicker = ({
  selectedDate,
  setDate,
}: {
  selectedDate: Date;
  setDate: any;
}) => {
  return (
    <div style={{ direction: "rtl" }}>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        value={selectedDate}
        onChange={(data: any) => {
          setDate(new Date(data));
        }}
      />
    </div>
  );
};

export default PersianDatePicker;
