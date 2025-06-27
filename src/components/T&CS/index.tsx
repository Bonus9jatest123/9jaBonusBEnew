import React from 'react';
import parse from 'html-react-parser';

interface Props {
  tcs: string;
}
const TCS = (props: Props) => {
  const { tcs } = props;
  return (
    <div className="tcs-container">
      <div>{tcs && parse(tcs)}</div>
    </div>
  );
};

export default TCS;
