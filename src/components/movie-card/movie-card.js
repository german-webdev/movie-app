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
      stars: this.props.rating,
    };

    this.onChangeStarValue = (stars) => {
      this.setState({
        stars,
      });
      this.onClickCard();
      this.service.addRating(this.state.currentMovieId, stars);
    };
  }

  onClickCard() {
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
      <>
        <div className="left-part">
          <div className="image-box">
            <img className="card-img" src={image} alt="poster" />
          </div>
        </div>
        <div className="right-part">
          <div className="card-header">
            <h1 className="card-header__title">{title}</h1>
            <span className={classRate}>
              <span className="card-header__rate-val">{rate}</span>
            </span>
            <div className="movie-date">{date}</div>
            <div className="movie-genre">
              {genresIds?.map((genre) => (
                <span key={genre.id} className="movie-genre__item">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
          <div className="card-content">
            <div className="movie-description">
              <p>{description}</p>
            </div>
          </div>
          <div className="card-footer">
            <Rate
              className="card-stars"
              count={10}
              allowHalf
              value={stars}
              onChange={this.onChangeStarValue}
              allowClear={false}
            />
          </div>
        </div>
      </>
    );
  }
}

export default MovieCard;
