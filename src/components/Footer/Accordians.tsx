'use client';
import React, { useState, useEffect } from 'react';

function Accordians({ title, text }: { title: string; text: string }) {
  const [expand, setExpand] = useState(false);

  return (
    <>
      {expand ? (
        <div className="expanding">
          <div className="expand">
            <div>{title}</div>
            <img src="/images/svg/minus.svg" className="expand-icon" onClick={() => setExpand(false)} alt="" />
          </div>
          <div>{text}</div>
        </div>
      ) : (
        <div>
          <div className="questions">
            <div>{title}</div>
            <img onClick={() => setExpand(true)} className="expand-icon" src="/images/svg/plus.svg" alt="" />
          </div>
        </div>
      )}
    </>
  );
}

export default Accordians;
