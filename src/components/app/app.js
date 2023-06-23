import React, { Component } from 'react';
import { Empty } from 'antd';

import { MovieServiceProvider } from '../movie-service-context/movie-service-context';
import MovieList from '../movie-list';
import Tab from '../tabs';
import MovieService from '../../services/movie-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import Spinner from '../spinner';
import MyPagination from '../pagination';

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
      const { ratedMovie, genres } = this.state;
      return movies?.map((movie) => {
        movie.rating = movie.rating ? movie.rating : ratedMovie.filter(({ id }) => id === movie.id)[0]?.rating || 0;
        movie.genresIds = movie.genresIds.map((id) => genres.filter((genre) => id === genre.id)[0] || id);
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
      this.service.getGuestSessionId();
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
      this.toStateGenres = (genres) => {
        this.setState({ genres });
      };
      this.service.getGenres().then(this.toStateGenres);
    };

    this.onToggleTab = () => {
      this.setState(({ viewRatedMovie }) => {
        return {
          viewRatedMovie: !viewRatedMovie,
        };
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
    const { movies, ratedMovie, loading, error, totalResults, currentPage, searchTerm, viewRatedMovie } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? (
      <MovieList movies={movies} ratedMovie={ratedMovie} viewRatedMovie={viewRatedMovie} />
    ) : null;
    const nothing =
      (!movies.length && searchTerm.length && hasData) || (!ratedMovie.length && viewRatedMovie && hasData) ? (
        <Empty description="Nothing was found" />
      ) : null;
    const pagination = viewRatedMovie ? null : (
      <MyPagination totalResults={totalResults} currentPage={currentPage} nextPage={this.nextPage} />
    );

    return (
      <MovieServiceProvider value={this.service}>
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
      </MovieServiceProvider>
    );
  }
}

export default App;
