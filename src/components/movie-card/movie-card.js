/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-fragments */
import React, { Fragment } from 'react';
import { Rate } from 'antd';

import './movie-card.css';

const MovieCard = (props) => {
  const { title, image, date, description, rate } = props;

  const classRate = 'card-headheader__rate';

  return (
    <Fragment>
      <div className="left-part">
        <div className="image-box">
          <img className="card-img" src={image} alt="poster" />
        </div>
      </div>
      <div className="right-part">
        <div className="card-content">
          <div className="card-header">
            <h1 className="card-header__title">{title}</h1>
            <span className={classRate}>
              <span className="card-header__rate-val">{rate}</span>
            </span>
          </div>

          <div className="film-date">{date}</div>
          <div className="film-genre">
            <span className="film-genre__item">Action</span>
            <span className="film-genre__item">Drama</span>
          </div>
          <div className="movie-description">
            <p>{description}</p>
          </div>
        </div>
        <div className="card-footer">
          <Rate className="card-stars" count={10} allowHalf defaultValue={2.5} />
        </div>
      </div>
    </Fragment>
  );
};

export default MovieCard;
