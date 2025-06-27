import React from 'react';
import Select, { ActionMeta, StylesConfig } from 'react-select';

export interface Option {
  label: string | JSX.Element | JSX.Element[];
  value: string;
}

export type CustomSelectOnChange = ((newValue: unknown, actionMeta: ActionMeta<unknown>) => void) | undefined;

interface SelectProps {
  options?: Option[];
  defaultValue?: Option;
  label?: string;
  isSearchable?: boolean;
  value?: string;
  onChange?: any;
  className?: string;
  expandedOptions?: boolean;
  height?: string;
  menuPosition?: 'auto' | 'top' | 'bottom';
}

const defaultOptions = [
  { value: 'Option 1', label: 'Option 1' },
  { value: 'Option 2', label: 'Option 2' },
  { value: 'Option 3', label: 'Option 3' }
];

const CustomSelect = ({
  options = defaultOptions,
  defaultValue,
  label = '',
  isSearchable = false,
  value,
  onChange,
  className = '',
  expandedOptions = false,
  height,
  menuPosition = 'auto'
}: SelectProps) => {
  const customStyles: StylesConfig = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#17A254' : '#D0D5DD',
      boxShadow: 'unset',
      height: height ? height : provided.height
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transform: state.isFocused ? 'rotate(180deg)' : 'unset',
      color: '#ccc'
    }),
    container: (provided) => ({
      ...provided,
      position: 'unset'
    }),
    menu: (provided) => ({
      ...provided,
      position: 'absolute',
      width: '100%',
      left: 0,
      right: 0
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#17A254' : '#000',
      backgroundColor: state.isSelected ? '#E6FCE7' : '#fff',
      borderBottom: '1px solid #EAECF0',
      padding: '12px 5%'
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingRight: '0'
    })
  };

  return (
    <div className={`select-element ${className}`} style={{ position: expandedOptions ? 'unset' : 'relative' }}>
      {label && <div className="element__label text-light">{label}</div>}
      <div className="element__selector">
        <Select defaultValue={defaultValue} options={options} isSearchable={isSearchable} styles={customStyles} value={value} onChange={onChange} menuPlacement={menuPosition} />
      </div>
    </div>
  );
};

export default CustomSelect;
