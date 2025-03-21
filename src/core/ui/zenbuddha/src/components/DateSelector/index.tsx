'use client';

import { Calendar as CalendarIcon } from 'lucide-react'; // Import the Calendar Icon
import { SelectSingleEventHandler } from 'react-day-picker';
import { Calendar } from '../../../../../../components/ui/calendar';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../../components/ui/popover';
import { cn } from '../../../../../../lib/utils';

type AdditionalDateSelectorProps = {
  label?: string;
  value?: Date;
  id: string;
  className?: string;
  placeholder?: string;
  onChange?: SelectSingleEventHandler;
};

export type DateSelectorProps = AdditionalDateSelectorProps;

const DateSelector = ({
  id,
  className,
  label,
  onChange,
  value,
  ...props
}: DateSelectorProps) => {
  return (
    <div className={`last-of-type:mb-0 basis-1/2 ` + className}>
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <button
            className={cn(
              'text-sm text-dark-500 flex flex-col h-full relative items-start'
            )}
          >
            {label && (
              <span className="text-sm font-medium mb-2 text-dark-500">
                <label htmlFor={id} className="text-sm mb-2 text-dark-500">
                  {label} {label ? '*' : ''}
                </label>
              </span>
            )}

            <div className="flex items-center py-3 px-4 rounded-md border bg-slate-50 text-sm focus:outline-none w-full min-h-[2.9rem]">
              <span className="flex-1 text-left">
                {value
                  ? `${value.getFullYear()} / ${
                      value.getMonth() + 1
                    } / ${value.getDate()}`
                  : props.placeholder || 'Select a date'}
              </span>
              <CalendarIcon className="h-5 w-5 text-gray-400 ml-2" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(day, selectedDay, activeModifiers, e) => {
              onChange?.(day, selectedDay, activeModifiers, e);
            }}
            className="bg-white"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
