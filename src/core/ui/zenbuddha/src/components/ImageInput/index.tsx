import { ChangeEvent } from 'react';

export interface ImageInputProps {
  label?: string;
  id: string;
  name?: string;
  rows?: number;
  value?: File | null;
  className?: string;
  required?: boolean;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput = ({ className, ...props }: ImageInputProps) => {
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
          {props.value?.name ?? 'Choose Picture'}
        </label>
        <input
          onChange={(e) => props.onChange?.(e)}
          className="hidden"
          type="file"
          id={props.id}
          name={props.name}
        />
      </div>
    </div>
  );
};

export default ImageInput;
