/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-fragments */
import React, { Fragment, Component } from 'react';
import { Rate } from 'antd';

import './movie-card.css';

class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: this.props.rate,
    };
  }

  render() {
    const { rate } = this.state;
    const { title, image, date, description, genreName } = this.props;

    let classRate = 'card-header__rate';

    if (rate > 7) {
      classRate += ' more7';
    } else if (rate >= 5) {
      classRate += ' more5';
    } else if (rate >= 3) {
      classRate += ' more3';
    }

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
              {genreName.map((item, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <span key={i} className="film-genre__item">
                  {item}
                </span>
              ))}
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
  }
}

export default MovieCard;
