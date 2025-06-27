import React from 'react';

interface BetCheckboxProps {
  label?: string;
  name?: string;
  id?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: number | string;
}

const BetCheckbox = ({ label, name, id, checked, onChange, value }: BetCheckboxProps) => (
  <label className={checked ? 'bet-radio --checked' : 'bet-radio'}>
    {label}
    <input type="checkbox" name={name} checked={checked} id={id} onChange={onChange} value={value} />
  </label>
);

export default BetCheckbox;
