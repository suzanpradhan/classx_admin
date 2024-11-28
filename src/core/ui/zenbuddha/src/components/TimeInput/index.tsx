import { ChangeEvent } from 'react';
import styles from './style.module.css';

export interface TimeInputProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  type?: string;
  rows?: number;
  className?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  value?: string;
  // eslint-disable-next-line no-unused-vars
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TimeInput = ({ className, handleChange, ...props }: TimeInputProps) => {
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};
  // const [value, setValue] = useState

  return (
    <div className={`flex flex-col last-of-type:mb-0 ` + className}>
      {props.label ? (
        <label
          htmlFor={props.id}
          className="text-sm font-medium mb-2 text-dark-500"
        >
          {props.label}
          {props.required ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      <div className="flex flex-col sm:flex-row items-end sm:items-center border-0 sm:border rounded-md bg-transparent sm:bg-slate-50">
        <input
          value={props.value}
          type="time"
          onChange={handleChange}
          className={`flex-1 py-3 px-2 h-11 border sm:border-0 rounded-md bg-slate-50 text-sm focus:outline-none w-full cursor-pointer text-slate-600 ${styles.inputClock}`}
          {...props}
        />
        {props.suffix ? (
          <div className="sm:mr-2 mt-2 sm:mt-0">{props.suffix}</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default TimeInput;
