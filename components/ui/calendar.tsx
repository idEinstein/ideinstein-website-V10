"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  /** 0 = Sunday, 1 = Monday (default) */
  weekStartsOn?: 0 | 1
}

function Calendar({
  selected,
  onSelect,
  disabled,
  className,
  weekStartsOn = 1, // default Monday for EU
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // ✅ correct previous month's last-day
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  // 0 = Sunday … 6 = Saturday
  const firstDayWeekday = firstDayOfMonth.getDay()
  // ✅ align the grid with configurable week start
  const startIndex = (firstDayWeekday - weekStartsOn + 7) % 7

  // Weekday labels based on weekStartsOn
  const WEEKDAYS =
    weekStartsOn === 1
      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
      : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const calendarDays: Date[] = []

  // ✅ previous month trailing days (count = startIndex)
  for (let i = startIndex - 1; i >= 0; i--) {
    calendarDays.push(new Date(year, month - 1, daysInPrevMonth - i))
  }

  // current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(year, month, day))
  }

  // next month leading days to fill 6 rows (42 cells)
  const remainingCells = 42 - calendarDays.length
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push(new Date(year, month + 1, day))
  }
  
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const d = new Date(prev)
      d.setMonth(prev.getMonth() + (direction === "prev" ? -1 : 1))
      return d
    })
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) =>
    selected && date.toDateString() === selected.toDateString()
  
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month
  }
  
  const isDisabled = (date: Date) => {
    return disabled ? disabled(date) : false
  }
  
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return
    onSelect?.(date)
  }
  
  return (
    <div className={cn("p-3 bg-white border rounded-md shadow-md w-[300px] relative z-50", className)}>
      {/* Header */}
      <div className="flex justify-center items-center relative mb-4">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-0 z-20 pointer-events-auto"
          onClick={() => navigateMonth("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-sm font-medium">
          {new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(currentDate)}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-0 z-20 pointer-events-auto"
          onClick={() => navigateMonth("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-9 w-9 flex items-center justify-center text-xs font-medium text-slate-500 uppercase"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0">
        {calendarDays.slice(0, 42).map((date, index) => {
          const isCurrentMonthDay = isCurrentMonth(date)
          const isTodayDate = isToday(date)
          const isSelectedDate = isSelected(date)
          const isDisabledDate = isDisabled(date)
          return (
            <Button
              key={index}
              type="button"
              variant="ghost"
              className={cn(
                "h-9 w-9 p-0 font-normal text-sm text-black relative z-20 pointer-events-auto",
                !isCurrentMonthDay && "text-slate-400 opacity-50",
                isTodayDate && !isSelectedDate && "font-semibold underline",
                isSelectedDate && "bg-primary text-white hover:bg-primary hover:text-white",
                isDisabledDate && "text-slate-300 cursor-not-allowed opacity-50",
                !isDisabledDate && !isSelectedDate && "hover:bg-slate-100"
              )}
              onClick={() => handleDateClick(date)}
              disabled={isDisabledDate}
            >
              {date.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
export type { CalendarProps }
