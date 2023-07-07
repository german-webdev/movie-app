import React from 'react';

import './rating-circle.css';

const RatingCircle = ({ rate }) => {
  let classRate = 'card-header__rate';

  if (rate > 7) {
    classRate += ' more7';
  } else if (rate >= 5) {
    classRate += ' more5';
  } else if (rate >= 3) {
    classRate += ' more3';
  }

  return (
    <span className={classRate}>
      <span className="card-header__rate-val">{rate}</span>
    </span>
  );
};

export default RatingCircle;
