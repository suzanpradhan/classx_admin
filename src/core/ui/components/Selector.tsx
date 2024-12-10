/* eslint-disable no-unused-vars */
'use client'

import { SelectorDataType } from '@/core/types/selectorType';
import { cn } from '@/lib/utils';
import React from 'react';
import Select, {
  GroupBase,
  MultiValue,
  SingleValue,
  components,
} from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';
import AsyncSelect from 'react-select/async';
import Creatable from 'react-select/creatable';

export interface SelectorProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  isMulti?: boolean;
  required?: boolean;
  className?: string;
  options?: SelectorDataType[];
  defaultValue?: SelectorDataType;
  isSearchable?: boolean;
  isClearable?: boolean;
  isCompact?: boolean;
  isDisabled?: boolean;
  loadPaginatedOptions?: LoadOptions<
    any,
    GroupBase<any>,
    {
      page: number;
    }
  >;
  onChange?: any;
  suffix?: React.ReactNode;
  value?: SingleValue<SelectorDataType> | MultiValue<SelectorDataType>;
  type?: 'Creatable' | 'Select' | 'Async' | 'AsyncPaginate';
  loadOptions?: (inputValue: string) => void;
  handleChange?: (
    // eslint-disable-next-line no-unused-vars
    e:
      | SingleValue<{
        value: string;
        label: string;
        extra?: string | undefined;
        __isNew__?: boolean | undefined;
      }>
      | MultiValue<{
        value: string;
        label: string;
        extra?: string | undefined;
        __isNew__?: boolean | undefined;
      }>
  ) => void;
  formatOptionLabel?: (data: SelectorDataType) => React.ReactNode;
}

const Selector = ({ className, suffix, ...props }: SelectorProps) => {
  const customStyles = {
    control: (base: any) => ({
      ...base,
      height: 44,
      minHeight: 44,
      width: 100,
    }),
  };

  return (
    <div
      id={props.id}
      className={`flex flex-col last-of-type:mb-0 ` + className}
    >
      {props.label ? (
        <label
          htmlFor={props.id}
          className={cn(
            'text-sm font-medium mb-2 ',
            !props.isDisabled ? 'text-dark-500' : 'text-gray-500/55'
          )}
        >
          {props.label}
        </label>
      ) : (
        <></>
      )}
      {props.type == 'Creatable' ? (
        <Creatable
          id={props.id}
          isClearable={true}
          required={props.required}
          options={props.options}
          isMulti={props.isMulti}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          formatOptionLabel={props.formatOptionLabel}
          onChange={props.handleChange}
          defaultValue={props.defaultValue}
          isDisabled={props.isDisabled}
          components={{
            Control: ({ children, ...props }) => {
              return (
                <components.Control {...props}>
                  {children}
                  {suffix ?? <></>}
                </components.Control>
              );
            },
          }}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: props.isCompact ? 34 : 44,
              maxHeight: props.isCompact ? 34 : 44,
              border: 'none',
              outline: 'none',
              borderRadius: 6,
              backgroundColor: `${!props.isDisabled ? '#F5F8FA' : '#ffffff'}`,
              flexWrap: 'wrap',
            }),
          }}
          theme={(theme) => {
            return {
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#F2F3F5',
                primary: '#2560AA',
              },
            };
          }}
          className="w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar min-h-[44px]"
        />
      ) : props.type == 'Async' ? (
        <AsyncSelect
          id={props.id}
          required={props.required}
          options={props.options}
          isMulti={props.isMulti}
          name={props.name}
          isDisabled={props.isDisabled}
          isSearchable={props.isSearchable}
          placeholder={props.placeholder}
          value={props.value}
          loadOptions={props.loadOptions}
          formatOptionLabel={props.formatOptionLabel}
          onChange={props.handleChange}
          components={{
            Control: ({ children, ...props }) => {
              return (
                <components.Control {...props}>
                  {children}
                  {suffix ?? <></>}
                </components.Control>
              );
            },
          }}
          defaultValue={props.defaultValue}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: props.isCompact ? 34 : 44,
              maxHeight: props.isCompact ? 34 : 44,
              border: 'none',
              outline: 'none',
              borderRadius: 6,
              backgroundColor: '#F5F8FA',
              flexWrap: 'wrap',
            }),
          }}
          theme={(theme) => {
            return {
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#F2F3F5',
                primary: '#2560AA',
              },
            };
          }}
          className={`w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar items-center `}
        />
      ) : props.type == 'AsyncPaginate' ? (
        props.loadPaginatedOptions ? (
          <AsyncPaginate
            id="companyId"
            isDisabled={props.isDisabled}
            loadOptions={props.loadPaginatedOptions}
            value={props.value}
            getOptionValue={(option: any) => option.value}
            getOptionLabel={(option: any) => option.label}
            onChange={props.handleChange}
            className={`w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar `}
            additional={{
              page: 1,
            }}
            isMulti={props.isMulti}
            isClearable={false}
            isSearchable={true}
            placeholder="Select an option"
            debounceTimeout={500}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: props.isCompact ? 34 : 44,
                maxHeight: props.isCompact ? 34 : 44,
                border: 'none',
                outline: 'none',
                borderRadius: 6,
                backgroundColor: '#F5F8FA',
                flexWrap: 'wrap',
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#F2F3F5',
                  primary: '#2560AA',
                },
              };
            }}
          />
        ) : (
          <></>
        )
      ) : (
        <Select
          id={props.id}
          isDisabled={props.isDisabled}
          required={props.required}
          options={props.options}
          isMulti={props.isMulti}
          name={props.name}
          placeholder={props.placeholder}
          value={props.value}
          formatOptionLabel={props.formatOptionLabel}
          onChange={props.handleChange}
          defaultValue={props.defaultValue}
          components={{
            Control: ({ children, ...props }) => {
              return (
                <components.Control {...props}>
                  {children}
                  {suffix ?? <></>}
                </components.Control>
              );
            },
          }}
          styles={{
            control: (base) => ({
              ...base,
              minHeight: props.isCompact ? 34 : 44,
              maxHeight: props.isCompact ? 34 : 44,
              border: 'none',
              outline: 'none',
              borderRadius: 6,
              backgroundColor: '#F5F8FA',
              flexWrap: 'wrap',
            }),
          }}
          theme={(theme) => {
            return {
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: '#F2F3F5',
                primary: '#2560AA',
              },
            };
          }}
          className={`w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar `}
        />
      )}
    </div>
  );
};

export default Selector;
