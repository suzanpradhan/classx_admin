import { ChangeEvent } from 'react';

export interface AudioInputProps {
  label?: string;
  id: string;
  name?: string;
  value?: File | null;
  className?: string;
  required?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const MusicUploader = ({ className, ...props }: AudioInputProps) => {
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
        <label
          htmlFor={props.id}
          className="flex-1 py-3 pl-4 h-11 border sm:border-0 rounded-md bg-slate-50 text-sm focus:outline-none w-full text-slate-600 relative overflow-clip"
        >
          {props.value?.name ?? 'Choose Audio'}
        </label>
        <input
          onChange={(e) => props.onChange?.(e)}
          className="hidden"
          type="file"
          id={props.id}
          name={props.name}
          accept="audio/*" 
        />
      </div>
      {/* {props.value && (
        <audio controls className="mt-2 w-full">
          <source src={URL.createObjectURL(props.value)} />
          Your browser does not support the audio element.
        </audio> */}
      {/* )} */}
    </div>
  );
};

export default MusicUploader;
