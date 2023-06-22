import React, { Component } from 'react';

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
      viewRatedMovie: false,
      loading: false,
      searchTerm: '',

      totalResults: 0,
      currentPage: 1,
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
      this.service.getGuestSessionId();
      this.getArr();
      this.onMovieLoaded = (movies) => {
        this.setState({
          movies: this.getNameGenres(movies),
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

    this.getGenresArr = (genres) => {
      this.setState({ genres });
    };

    this.getTotal = (totalResults) => {
      this.setState({ totalResults });
    };

    this.getArr = () => {
      this.service.getGenres().then(this.getGenresArr);
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
        this.service.getTotalMovies(this.state.searchTerm).then(this.getTotal);
      } else {
        this.service.getRatedMovie().then(this.onMovieLoaded).catch(this.onError);
        this.setState({
          loading: true,
        });
        this.service.getTotalRatedMovies().then(this.getTotal);
      }
    }
  }

  componentWillUnmount() {
    this.onMovieLoaded = (movies) => {
      this.setState({
        movies: this.getNameGenres(movies),
        loading: false,
      });
    };
  }

  render() {
    const { movies, loading, error, totalResults, currentPage, searchTerm, viewRatedMovie } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MovieList movies={movies} /> : null;
    const pagination = viewRatedMovie ? null : (
      <MyPagination totalResults={totalResults} currentPage={currentPage} nextPage={this.nextPage} />
    );

    return (
      <MovieServiceProvider value={this.service}>
        <div className="wrapper">
          <header className="header">
            <Tab onHandleSubmit={this.handleSubmit} searchTerm={searchTerm} onToggleTab={this.onToggleTab} />
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
