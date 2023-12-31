import React, { Fragment, Component } from 'react';
import { Rate } from 'antd';
import PropTypes from 'prop-types';

import './movie-card.css';
import MovieService from '../../services/movie-service';
import MovieServiceContext from '../movie-service-context';
import RatingCircle from '../rating-circle';

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
      this.setState({ stars });
      this.service.addRating(this.state.currentMovieId, stars);
    };

    this.renderGenresNamesByIds = (ids, genres) => {
      return ids?.map((id) => {
        return (
          <span key={id} className="movie-genre__item">
            {genres?.filter((genre) => id === genre.id)[0]?.name}
          </span>
        );
      });
    };
  }

  render() {
    const { genres } = this.context;
    const { rate, stars } = this.state;
    const { title, image, date, description, genresIds } = this.props;

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
            <RatingCircle rate={rate} />
            <div className="movie-date">{date}</div>
            <div className="movie-genre">{this.renderGenresNamesByIds(genresIds, genres)}</div>
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

MovieCard.propTypes = {
  id: PropTypes.number.isRequired,
  rate: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  genresIds: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

MovieCard.contextType = MovieServiceContext;

export default MovieCard;
