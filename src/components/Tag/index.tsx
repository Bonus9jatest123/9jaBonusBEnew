import React from 'react';

const Tag = ({ variant = 'hot' }) => {
  const scr = variant === 'hot' ? '/images/svg/hotTag.svg' : '/images/svg/bestTag.svg';

  return (
    <span className={`tag ${variant === 'hot' ? '--hot' : '--best'}`}>
      <img src={scr} alt="" /> {variant === 'hot' ? 'HOT' : 'BEST ODDS'}
    </span>
  );
};

export default Tag;
