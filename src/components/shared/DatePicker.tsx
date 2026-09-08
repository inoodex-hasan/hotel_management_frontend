"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  mode?: "checkin" | "checkout";
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function isSameDate(a: string, b: string) {
  return a && b && a === b;
}

function isDateInRange(date: string, start: string, end: string) {
  if (!start || !end) return false;
  return date > start && date < end;
}

export default function DatePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  mode = "checkin",
}: DatePickerProps) {
  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }, []);

  const [month, setMonth] = useState(today.month);
  const [year, setYear] = useState(today.year);

  const todayStr = formatDate(today.year, today.month, today.day);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDateClick = (dateStr: string) => {
    if (dateStr < todayStr) return;

    if (mode === "checkin") {
      onCheckInChange(dateStr);
      if (checkOut && dateStr >= checkOut) {
        onCheckOutChange("");
      }
    } else {
      if (checkIn && dateStr <= checkIn) {
        onCheckInChange(dateStr);
        onCheckOutChange("");
      } else {
        onCheckOutChange(dateStr);
      }
    }
  };

  const monthLabel = new Date(year, month).toLocaleString("en-US", { month: "short" });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const totalCells = 42;
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  while (days.length < totalCells) days.push(null);

  const activeDate = mode === "checkin" ? checkIn : checkOut;
  const label = mode === "checkin" ? "Check-in" : "Check-out";

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-black/95 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-2 py-1.5 sm:px-3 sm:py-2">
        <button type="button" onClick={prevMonth} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#ff784e] hover:text-[#ff784e] sm:h-7 sm:w-7">
          <ChevronLeft size={12} />
        </button>

        <div className="flex items-center justify-center text-[9px] font-medium sm:text-[10px]">
          <span className="rounded-full bg-[#ff784e] px-2.5 py-0.5 font-semibold text-white shadow-sm">
            {label} {activeDate ? new Date(activeDate + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Select"}
          </span>
        </div>

        <button type="button" onClick={nextMonth} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:border-[#ff784e] hover:text-[#ff784e] sm:h-7 sm:w-7">
          <ChevronRight size={12} />
        </button>
      </div>

      <div className="p-2 sm:p-3">
        <div className="mb-1.5 text-center text-xs font-semibold text-white sm:mb-3 sm:text-sm">
          {monthLabel} {year}
        </div>
        <div className="mb-1 grid grid-cols-7 gap-0">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-0.5 text-center text-[8px] font-medium uppercase tracking-wider text-white/40 sm:text-[9px]">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} className="h-7 sm:h-8" />;

            const dateStr = formatDate(year, month, day);
            const isPast = dateStr < todayStr;
            const isInvalidCheckout = Boolean(mode === "checkout" && checkIn && dateStr <= checkIn);
            const isDisabled = isPast || isInvalidCheckout;
            const isCheckIn = isSameDate(dateStr, checkIn);
            const isCheckOut = isSameDate(dateStr, checkOut);
            const inRange = isDateInRange(dateStr, checkIn, checkOut);
            const isToday = dateStr === todayStr;
            const isActive = mode === "checkin" ? isCheckIn : isCheckOut;

            let bgClass = "";
            if (isActive) {
              bgClass = "bg-[#ff784e] text-white font-semibold shadow-md";
            } else if (inRange) {
              bgClass = "bg-[#ff784e]/15 text-[#ff784e]";
            } else if (isDisabled) {
              bgClass = "text-white/20 cursor-not-allowed";
            } else {
              bgClass = "text-white/80 hover:bg-white/10 cursor-pointer";
            }

            return (
              <button
                key={dateStr}
                type="button"
                disabled={Boolean(isDisabled)}
                onClick={() => handleDateClick(dateStr)}
                className={`relative flex h-7 w-full items-center justify-center rounded-lg text-[10px] transition-all duration-150 sm:h-8 sm:text-[11px] ${bgClass}`}
              >
                {isToday && !isActive && (
                  <span className="absolute inset-0 rounded-lg border border-[#ff784e]/40" />
                )}
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
