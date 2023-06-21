/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable import/order */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/function-component-definition */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React, { Component } from 'react';
import { MovieServiceProvider, MovieServiceConsumer } from '../movie-service-context/movie-service-context';
import MovieList from '../movie-list';
import Tab from '../tabs';

import './app.css';
import MovieService from '../../services/movie-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import Spinner from '../spinner';
import MyPagination from '../pagination';

class App extends Component {
  service = new MovieService();

  constructor() {
    super();
    this.state = {
      movies: [],
      genreName: [],
      loading: false,
      searchTerm: 'Return',

      totalResults: 0,
      currentPage: 1,
    };

    this.getTotal = (totalResults) => {
      this.setState({
        totalResults,
      });
    };

    this.getGenresArr = (genres) => {
      this.setState({
        genres,
      });
    };

    this.getNameGenres = (movies) => {
      return movies.map((movie) => {
        movie.genresIds = movie.genresIds.map((genreId) => {
          return {
            id: genreId,
            name: this.state.genres.filter((genre) => genre.id === genreId)[0].name,
          };
        });
        return movie;
      });
    };

    this.nextPage = (pageNumber) => {
      this.service.getMovies(this.state.searchTerm, pageNumber).then(this.onMovieLoaded).catch(this.onError);
      this.saveCurrentPage(pageNumber);
    };

    this.saveCurrentPage = (pageNumber) => {
      this.setState({
        currentPage: pageNumber,
      });
    };

    this.componentDidMount = () => {
      this.getArr();
      this.onMovieLoaded = (movies) => {
        this.setState({
          movies: this.getNameGenres(movies),
          loading: false,
        });
      };
    };

    this.onError = (error) => {
      this.setState({
        error: true,
        loading: false,
      });
    };

    this.handleSubmit = (event) => {
      this.setState({
        loading: true,
        searchTerm: event.target.value,
      });
    };

    this.getArr = () => {
      this.service.getGenres().then(this.getGenresArr);
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm !== prevState.searchTerm) {
      this.service.getMovies(this.state.searchTerm).then(this.onMovieLoaded).catch(this.onError);
      this.service.getTotalResults(this.state.searchTerm).then(this.getTotal);
    }
  }

  // stateSetter = (state) => {
  //   this.setState({
  //     state,
  //   });
  // };

  render() {
    const { movies, loading, error, totalResults, currentPage, searchTerm } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MovieList movies={movies} /> : null;

    return (
      <MovieServiceProvider value={this.service}>
        <div className="wrapper">
          <header className="Header">
            <Tab onHandleSubmit={this.handleSubmit} onHandleChange={this.handleChange} searchTerm={searchTerm} />
          </header>
          <main className="main">
            {errorMessage}
            {spinner}
            {content}
          </main>
          <footer className="footer">
            <MyPagination totalResults={totalResults} currentPage={currentPage} nextPage={this.nextPage} />
          </footer>
        </div>
      </MovieServiceProvider>
    );
  }
}

export default App;
