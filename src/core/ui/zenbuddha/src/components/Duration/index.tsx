import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DurationSchemaType } from '../../../../../../modules/tracks/trackType';
import styles from './style.module.css';

type DurationValueType = DurationSchemaType;

export interface TimeInputProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  className?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  value?: DurationValueType;
  disabled?: boolean;
  // eslint-disable-next-line no-unused-vars
  handleHourChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleMinChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSecChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DurationInput = ({
  className,
  handleHourChange,
  handleMinChange,
  handleSecChange,
  value = { hour: 0, minutes: 0, seconds: 0 },
  ...props
}: TimeInputProps) => {
  const [showPopup, setShowPopup] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);

  const handleDurationChange =
    (field: 'hours' | 'minutes' | 'seconds') =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      if (field === 'hours' && handleHourChange) {
        handleHourChange(e);
      } else if (field === 'minutes' && handleMinChange) {
        handleMinChange(e);
      } else if (field === 'seconds' && handleSecChange) {
        handleSecChange(e);
      }
    };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const applyDuration = () => {
    setShowPopup(false);
  };

  return (
    <div className={`flex flex-col last-of-type:mb-0 ` + className}>
      {props.label && (
        <label
          htmlFor={props.id}
          className="text-sm font-medium mb-2 text-dark-500"
        >
          {props.label}
          {props.required ? '*' : ''}
        </label>
      )}
      <div className="relative">
        <input
          onFocus={() => setShowPopup(true)}
          disabled={props.disabled}
          onChange={() => void 0}
          value={`${value.hour?.toString().padStart(2, '0')}:${value.minutes?.toString().padStart(2, '0')}:${value.seconds?.toString().padStart(2, '0')}`}
          className={`flex-1 py-3 px-2 h-11 border rounded-md bg-slate-50 text-sm focus:outline-none w-full cursor-pointer text-slate-600 ${styles.inputClock}`}
        />
        {showPopup && (
          <div
            ref={popupRef}
            className="absolute top-full left-0 mt-2 w-64 p-4 bg-white shadow-lg border rounded-md z-10"
          >
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={value.hour ?? undefined}
                onChange={handleDurationChange('hours')}
                className="w-16 border rounded-md p-1 text-center"
              />
            </div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={value.minutes ?? undefined}
                onChange={handleDurationChange('minutes')}
                className="w-16 border rounded-md p-1 text-center"
              />
            </div>
            <div className="flex justify-between mb-4">
              <label className="text-sm font-medium">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={value.seconds}
                onChange={handleDurationChange('seconds')}
                className="w-16 border rounded-md p-1 text-center"
              />
            </div>
            <button
              onClick={applyDuration}
              className="w-full bg-yellow-500 text-white py-2 rounded-md text-sm hover:bg-black hover:text-white"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DurationInput;
