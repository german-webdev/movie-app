import React from 'react';
import PropTypes from 'prop-types';

import MovieCard from '../movie-card';

import './movie-list.css';

const MovieList = ({ movies, ratedMovie, viewRatedMovie }) => {
  const movieList = !viewRatedMovie ? movies : ratedMovie;
  const movie = movieList.map((item) => {
    const { id, rate, ...movieProps } = item;

    return (
      <div key={id} className="card">
        <MovieCard {...movieProps} rate={rate} id={id} />
      </div>
    );
  });

  return <section className="movie-cards">{movie}</section>;
};

MovieList.propTypes = {
  movies: PropTypes.instanceOf(Array).isRequired,
  ratedMovie: PropTypes.instanceOf(Array).isRequired,
  viewRatedMovie: PropTypes.bool.isRequired,
};

export default MovieList;
