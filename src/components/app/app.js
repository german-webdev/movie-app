/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/function-component-definition */
import React, { Component } from 'react';

import MovieList from '../movie-list';
import Tab from '../tabs';

import './app.css';
import { Pagination } from 'antd';
import MovieService from '../../services/movie-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import Spinner from '../spinner';

class App extends Component {
  service = new MovieService();

  constructor() {
    super();
    this.state = {
      movies: [],
      loading: false,
      searchTerm: '',

      totalResults: 0,
      currentPage: 1,
    };

    this.nextPage = (pageNumber) => {
      this.service.getMovies(this.state.searchTerm, pageNumber).then(this.onMovieLoaded).catch(this.onError);
      console.log(pageNumber);
      this.setState({
        currentPage: pageNumber,
      });
    };

    this.getTotal = (totalResults) => {
      console.log(totalResults);
      this.setState({
        totalResults,
      });
    };

    this.onMovieLoaded = (movies) => {
      console.log(movies);
      this.setState({
        movies,
        loading: false,
      });
    };

    // eslint-disable-next-line no-unused-vars
    this.onError = (error) => {
      this.setState({
        error: true,
        loading: false,
      });
    };

    this.handleSubmit = (event) => {
      event.preventDefault();
      this.setState({
        loading: true,
      });

      this.service.getMovies(this.state.searchTerm).then(this.onMovieLoaded).catch(this.onError);
      this.service.getTotalResults(this.state.searchTerm).then(this.getTotal);
    };

    this.handleChange = (event) => {
      this.setState({ searchTerm: event.target.value });
    };
  }

  render() {
    const { movies, loading, error, totalResults, currentPage } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MovieList movies={movies} /> : null;

    const numberPages = Math.floor(totalResults / 20);
    console.log(numberPages);
    const pagination =
      totalResults > 6 ? (
        <Pagination
          onChange={this.nextPage}
          current={currentPage}
          total={totalResults}
          pageSize={numberPages}
          responsive="false"
          showLessItems="true"
        />
      ) : (
        ''
      );

    return (
      <div className="wrapper">
        <Tab onSubmit={this.handleSubmit} onChange={this.handleChange} />
        {errorMessage}
        {spinner}
        {content}
        {pagination}
      </div>
    );
  }
}

export default App;
