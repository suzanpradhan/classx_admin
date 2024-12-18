/* eslint-disable no-unused-vars */
'use client';
import { Minus, Plus } from 'phosphor-react';
import React, { useState } from 'react';

export interface TextFieldProps {
    label?: string;
    id: string;
    name?: string;
    type?: string;
    rows?: number;
    className?: string;
    value?: string;
    required?: boolean;
    suffix?: React.ReactNode;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ColorSelector = ({
    className,
    type = 'text',
    ...props
}: TextFieldProps) => {
    const [colorValues, setColorValues] = useState<string[]>(type === 'color' ? ['#000000'] : ['']);

    const handleColorChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newColorValues = [...colorValues];
        newColorValues[index] = event.target.value;
        setColorValues(newColorValues);
    };

    const addColorInput = () => {
        setColorValues([...colorValues, '#000000']);
    };

    const removeColorInput = (index: number) => {
        if (colorValues.length > 1) {
            const newColorValues = colorValues.filter((_, i) => i !== index);
            setColorValues(newColorValues);
        }
    };

    return (
        <div className={`flex mt-2  flex-col last-of-type:mb-0 ${className}`}>
            {props.label && (
                <label htmlFor={props.id} className="text-sm mb-2 text-dark-500">
                    {props.label}
                    {props.required ? '*' : ''}
                </label>
            )}

            {colorValues.map((colorValue, index) => (
                <div key={index} className="flex items-center border rounded-md bg-slate-50 mb-2">
                    <input
                        value={colorValue}
                        onChange={(e) => handleColorChange(index, e)}
                        className="w-full px-2 h-10 border rounded-l-md bg-slate-50"
                    />
                    {type === 'color' && (
                        <input
                            type="color"
                            value={colorValue}
                            onChange={(e) => handleColorChange(index, e)}
                            className="w-10 h-10 border cursor-pointer"
                        />
                    )}
                    <div className="flex items-center space-x-2 ml-2">
                        {index < colorValues.length - 1 && colorValues.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeColorInput(index)}
                                className="text-black "
                            >
                                <Minus size={20} className='font-extrabold mr-1' />
                            </button>
                        )}
                        {index === colorValues.length - 1 && (
                            <button
                                type="button"
                                onClick={addColorInput}
                                className="text-black"
                            >
                                <Plus size={20} className='font-extrabold mr-1' />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ColorSelector;
