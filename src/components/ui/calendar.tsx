import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(props.month || props.defaultMonth || new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, []);

  const handleMonthChange = (newMonth: string) => {
    const newDate = new Date(month);
    newDate.setMonth(parseInt(newMonth));
    setMonth(newDate);
  };

  const handleYearChange = (newYear: string) => {
    const newDate = new Date(month);
    newDate.setFullYear(parseInt(newYear));
    setMonth(newDate);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={month}
      onMonthChange={setMonth}
      className={cn("p-3 pointer-events-auto w-[280px]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label: "hidden",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/20 text-white hover:bg-white/10"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-white/60 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-white/20 [&:has([aria-selected])]:bg-white/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-white/10 hover:text-white"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-white/20 text-white",
        day_outside:
          "day-outside text-white/40 opacity-50 aria-selected:bg-white/20 aria-selected:text-white/60 aria-selected:opacity-30",
        day_disabled: "text-white/30 opacity-50",
        day_range_middle:
          "aria-selected:bg-white/20 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Caption: ({ displayMonth }) => (
          <div className="flex justify-center items-center gap-1 relative w-full">
            <div className="absolute left-1">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(month);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setMonth(newDate);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/20 text-white hover:bg-white/10"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Select
                value={displayMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-7 w-[100px] text-xs bg-transparent border-white/20 text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/20 max-h-[200px]">
                  {months.map((m, index) => (
                    <SelectItem 
                      key={m} 
                      value={index.toString()}
                      className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={displayMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-7 w-[70px] text-xs bg-transparent border-white/20 text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/20 max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem 
                      key={year} 
                      value={year.toString()}
                      className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                    >
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="absolute right-1">
              <button
                type="button"
                onClick={() => {
                  const newDate = new Date(month);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setMonth(newDate);
                }}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-white/20 text-white hover:bg-white/10"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
