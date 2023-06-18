import React from 'react';

import MovieCard from '../movie-card';

import './movie-list.css';

const MovieList = ({ movies }) => {
  const movie = movies.map((item) => {
    const { id, rate, ...movieProps } = item;

    return (
      <div key={id} className="card">
        <MovieCard {...movieProps} rate={rate} />
      </div>
    );
  });

  return <section className="movie-cards">{movie}</section>;
};

export default MovieList;
