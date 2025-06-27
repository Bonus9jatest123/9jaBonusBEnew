import React, { FC } from 'react';

interface Props {
  toggle: number;
  items: string[];
  handleActive: (index: number) => void;
  className: string;
}

const Toogle = (props: Props) => {
  const { items, toggle, handleActive, className = '' } = props;

  return (
    <>
      <div className={`nav-bar-toogle-container ${className}`}>
        <>
          {items.map((item, index) => (
            <div className={toggle === index ? 'active' : 'toggle-option-1'} key={index} onClick={() => handleActive(index)}>
              {' '}
              {item}
            </div>
          ))}
        </>
      </div>
    </>
  );
};

export default Toogle;
