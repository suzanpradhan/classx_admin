/* eslint-disable no-unused-vars */
'use client';

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
  // onChange?: SelectSingleEventHandler;
  onChange?: (
    day: Date | undefined,
    selectedDay: Date | undefined,
    activeModifiers: any,
    e: any
  ) => void;
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
  const clearDate = () => {
    // setSelectedDate(undefined);
    onChange?.(undefined, undefined, {}, null);
  };
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
            {label && (
              <span className="text-sm font-medium mb-2 text-dark-500">
                {label}
              </span>
            )}
            {/* <CalendarIcon className="ml-auto h-4 w-4 opacity-50" /> */}
            <div className="flex-1 py-3 px-4 rounded-md border bg-slate-50 text-sm focus:outline-none w-full min-h-[2.9rem] flex items-start">
              {value ? (
                `${value.getDate()} / ${value.getMonth() + 1} / ${value.getFullYear()}`
              ) : (
                <span className="text-gray-500">{props.placeholder}</span>
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
          <div className="flex justify-end p-2">
            <button
              onClick={clearDate}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear Date
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
