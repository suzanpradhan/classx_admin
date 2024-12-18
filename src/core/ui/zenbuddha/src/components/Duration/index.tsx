import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './style.module.css';

export interface TimeInputProps {
    label?: string;
    placeholder?: string;
    id: string;
    name?: string;
    className?: string;
    required?: boolean;
    suffix?: React.ReactNode;
    value?: string;
    // eslint-disable-next-line no-unused-vars
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const DurationInput = ({ className, handleChange, value = '', ...props }: TimeInputProps) => {
    const [showPopup, setShowPopup] = useState(false);
    const [duration, setDuration] = useState(() => {
        const [hours = '00', minutes = '00', seconds = '00'] = value.split(':');
        return { hours, minutes, seconds };
    });

    const popupRef = useRef<HTMLDivElement>(null);

    const handleDurationChange = (field: 'hours' | 'minutes' | 'seconds') => (e: ChangeEvent<HTMLInputElement>) => {
        setDuration((prev) => ({ ...prev, [field]: e.target.value.padStart(2, '0') }));
    };

    const applyDuration = () => {
        const formattedValue = `${duration.hours}:${duration.minutes}:${duration.seconds}`;
        if (handleChange) {
            const event = {
                target: { value: formattedValue } as HTMLInputElement,
                currentTarget: { value: formattedValue } as HTMLInputElement,
            } as ChangeEvent<HTMLInputElement>;

            handleChange(event);
        }
        setShowPopup(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const [hours = '00', minutes = '00', seconds = '00'] = value.split(':');
        setDuration({ hours, minutes, seconds });
    }, [value]);

    return (
        <div className={`flex flex-col last-of-type:mb-0 ` + className}>
            {props.label && (
                <label htmlFor={props.id} className="text-sm font-medium mb-2 text-dark-500">
                    {props.label}
                    {props.required ? '*' : ''}
                </label>
            )}
            <div className="relative">
                <input
                    value={value}
                    type="text"
                    onFocus={() => setShowPopup(true)}
                    readOnly
                    placeholder="HH:MM:SS"
                    className={`flex-1 py-3 px-2 h-11 border rounded-md bg-slate-50 text-sm focus:outline-none w-full cursor-pointer text-slate-600 ${styles.inputClock}`}
                    {...props}
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
                                value={duration.hours}
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
                                value={duration.minutes}
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
                                value={duration.seconds}
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
