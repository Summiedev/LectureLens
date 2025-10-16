"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateTimePickerProps = {
  onChange: (dateTime: Date | undefined) => void;
};

export function DateTimePicker({ onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>("10:30:00");

  // Function to combine date and time into a single Date object
  const combineDateAndTime = (
    selectedDate: Date | undefined,
    timeString: string
  ) => {
    if (!selectedDate) return undefined;

    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(hours, minutes, seconds || 0);

    return combinedDateTime;
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    const combinedDateTime = combineDateAndTime(selectedDate, time);
    onChange(combinedDateTime);
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    const combinedDateTime = combineDateAndTime(date, newTime);
    onChange(combinedDateTime);
  };

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-3 w-full">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-full justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                handleDateSelect(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full "
        />
      </div>
    </div>
  );
}
