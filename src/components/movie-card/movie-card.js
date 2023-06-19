/* eslint-disable react/no-unused-state */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-fragments */
import React, { Fragment, Component } from 'react';
import { Rate } from 'antd';

import './movie-card.css';
import MovieService from '../../services/movie-service';

class MovieCard extends Component {
  service = new MovieService();

  constructor(props) {
    super(props);
    this.state = {
      rate: this.props.rate,
      currentMovieId: this.props.id,
      stars: 0,
    };

    this.getStateSessionId = (idSessionInfo) => {
      this.setState({
        idSessionInfo,
      });
    };

    this.onChangeStarValue = (stars) => {
      this.setState({
        stars,
      });
      this.onClickCard();
      this.service.addRating(this.state.currentMovieId, stars, this.state.idSessionInfo.id);
      console.log(this.state.stars);
    };

    this.getSessionId = () => {
      this.service.getGuestSessionId().then(this.getStateSessionId);
    };
  }

  componentDidMount() {
    this.getSessionId();
  }

  onClickCard() {
    console.log(this.state.currentMovieId);
    return this.state.currentMovieId;
  }

  render() {
    const { rate, stars } = this.state;
    const { title, image, date, description, genresIds } = this.props;

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
              {genresIds?.map((genre) => (
                <span key={genre.id} className="film-genre__item">
                  {genre.name}
                </span>
              ))}
            </div>
            <div className="movie-description">
              <p>{description}</p>
            </div>
          </div>
          <div className="card-footer">
            <Rate
              className="card-stars"
              count={10}
              allowHalf
              defaultValue={0}
              value={stars}
              onChange={this.onChangeStarValue}
              allowClear={false}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MovieCard;
