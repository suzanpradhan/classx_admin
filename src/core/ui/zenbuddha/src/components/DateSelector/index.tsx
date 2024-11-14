'use client';

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
      {/* {label ? (
        <label htmlFor={id} className="text-sm mb-2 text-dark-500">
          {label}
          {label ? '*' : ''}
        </label>
      ) : (
        <></>
      )} */}
      <Popover>
        <PopoverTrigger asChild className="w-full">
          <button
            className={cn('text-sm  text-dark-500 flex flex-col h-full ')}
          >
            {
              <span className="text-sm font-medium mb-2 text-dark-500">
                <label htmlFor={id} className="text-sm mb-2 text-dark-500">
                  {label}
                  {label ? '*' : ''}
                </label>
              </span>
            }
            {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
            <div className="flex-1 py-3 px-4 rounded-md border bg-slate-50 text-sm focus:outline-none w-full min-h-[2.9rem] flex items-start">
              {value ? (
                `${value.getFullYear()} / ${value.getMonth() + 1} / ${value.getDate()}`
              ) : (
                <span className="">{props.placeholder}</span>
              )}
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
            className={' bg-white'}
            // disabled={(date) =>
            //   date > new Date() || date < new Date('1900-01-01')
            // }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
