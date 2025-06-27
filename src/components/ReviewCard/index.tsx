import React from 'react';
import parse from 'html-react-parser';

interface Props {
  review: string;
  pros: string;
  cons: string;
}
const ReviewCard = (props: Props) => {
  const { review, pros, cons } = props;
  return (
    <>
      <div className="review_container">
        <div className="review_container_1">{pros && parse(pros)}</div>
        <div className="review_container-2">{cons && parse(cons)}</div>
      </div>
      <div className="Review-Para">
        <div>{review && parse(review)}</div>
      </div>
    </>
  );
};

export default ReviewCard;
