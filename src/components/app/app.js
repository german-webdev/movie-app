/* eslint-disable react/jsx-no-constructed-context-values */
import React, { Component } from 'react';
import { Empty } from 'antd';

import MovieService from '../../services/movie-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import MovieList from '../movie-list';
import MovieServiceContext from '../movie-service-context';
import MyPagination from '../pagination';
import Spinner from '../spinner';
import Tab from '../tabs';

import './app.css';

class App extends Component {
  service = new MovieService();

  constructor() {
    super();
    this.state = {
      movies: [],
      ratedMovie: [],
      viewRatedMovie: false,
      loading: false,
      searchTerm: '',

      totalResults: null,
      currentPage: 1,
    };

    this.updateStateMovies = (movies) => {
      const { ratedMovie } = this.state;
      return movies?.map((movie) => {
        movie.rating = movie.rating ? movie.rating : ratedMovie.filter(({ id }) => id === movie.id)[0]?.rating || 0;
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

    this.onError = () => {
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

    this.getTotalResults = (totalResults) => {
      this.setState({ totalResults });
    };

    this.getGenresArray = () => {
      this.service.getGenres().then((genres) => {
        this.setState({ genres });
      });
    };

    this.onToggleTab = () => {
      this.setState(({ viewRatedMovie }) => {
        return {
          viewRatedMovie: !viewRatedMovie,
        };
      });
    };
  }

  componentDidMount() {
    this.getGenresArray();
    this.onRatedMovieLoaded = (ratedMovie) => {
      this.setState({
        ratedMovie: this.updateStateMovies(ratedMovie),
        loading: false,
      });
    };
    this.onMovieLoaded = (movies) => {
      this.setState({
        movies: this.updateStateMovies(movies),
        loading: false,
      });
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm !== prevState.searchTerm || this.state.viewRatedMovie !== prevState.viewRatedMovie) {
      if (this.state.viewRatedMovie === false) {
        this.service.getMovies(this.state.searchTerm).then(this.onMovieLoaded).catch(this.onError);
        this.service.getTotalMovies(this.state.searchTerm).then(this.getTotalResults);
      } else {
        this.service.getRatedMovie().then(this.onRatedMovieLoaded).catch(this.onError);
        this.setState({
          loading: true,
        });
      }
    }
  }

  render() {
    const { movies, ratedMovie, loading, error, totalResults, currentPage, searchTerm, viewRatedMovie, genres } =
      this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? (
      <MovieList movies={movies} ratedMovie={ratedMovie} viewRatedMovie={viewRatedMovie} />
    ) : null;
    const nothing =
      (!movies.length && searchTerm.length && hasData && !viewRatedMovie) ||
      (!ratedMovie.length && viewRatedMovie && hasData) ? (
        <Empty description="Nothing was found" />
      ) : null;
    const pagination =
      viewRatedMovie || !hasData ? null : (
        <MyPagination totalResults={totalResults} currentPage={currentPage} nextPage={this.nextPage} />
      );

    return (
      <MovieServiceContext.Provider value={{ genres }}>
        <div className="wrapper">
          <header className="header">
            <Tab onHandleSubmit={this.handleSubmit} searchTerm={searchTerm} onToggleTab={this.onToggleTab} />
            {nothing}
          </header>
          <main className="main">
            {errorMessage}
            {spinner}
            {content}
          </main>
          <footer className="footer">{pagination}</footer>
        </div>
      </MovieServiceContext.Provider>
    );
  }
}

export default App;
