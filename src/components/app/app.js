/* eslint-disable react/jsx-no-constructed-context-values */
import React, { Component } from 'react';
import { Empty } from 'antd';
import _debounce from 'lodash/debounce';

import MovieService from '../../services/movie-service';
import ErrorIndicator from '../error-indicator/error-indicator';
import ErrorBoundary from '../error-boundry';
import OfflineIndicator from '../offline-indicator';
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
      searchValue: '',

      totalResults: null,
      currentPage: 1,
      offline: false,
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

    this.checkOfflineStatus = () => {
      const offline = !navigator.onLine;
      this.setState({ offline });
    };

    this.handleSearchValueChange = (searchValue) => {
      this.setState({ searchValue });
      this.debounceSearchValue(searchValue);
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
    const storedRatedMovie = localStorage.getItem('ratedMovie');

    if (storedRatedMovie) {
      this.setState({
        ratedMovie: this.updateStateMovies(JSON.parse(storedRatedMovie)),
        loading: false,
      });
    } else {
      localStorage.removeItem('ratedMovie');
    }

    this.onMovieLoaded = (movies) => {
      this.setState({
        movies: this.updateStateMovies(movies),
        loading: false,
      });
    };
    this.getGenresArray();

    this.debounceSearchValue = _debounce((searchValue) => {
      if (searchValue.trim() !== '') {
        this.setState({
          loading: true,
          searchTerm: searchValue,
        });
      }
    }, 500);

    this.checkOfflineStatus();
    window.addEventListener('offline', this.checkOfflineStatus);
    window.addEventListener('online', this.checkOfflineStatus);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (this.state.searchTerm !== prevState.searchTerm || this.state.viewRatedMovie !== prevState.viewRatedMovie) &&
      !this.state.offline
    ) {
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

    this.onRatedMovieLoaded = (ratedMovie) => {
      this.setState(
        {
          ratedMovie: this.updateStateMovies(ratedMovie),
          loading: false,
        },
        () => {
          localStorage.setItem('ratedMovie', JSON.stringify(ratedMovie));
        }
      );
    };
  }

  componentWillUnmount() {
    window.removeEventListener('offline', this.checkOfflineStatus);
    window.removeEventListener('online', this.checkOfflineStatus);
  }

  render() {
    const {
      movies,
      ratedMovie,
      loading,
      error,
      offline,
      totalResults,
      currentPage,
      searchTerm,
      viewRatedMovie,
      genres,
      searchValue,
    } = this.state;

    const hasData = !(loading || error || offline);

    const errorMessage = error && !offline && !loading ? <ErrorIndicator /> : null;
    const offlineMessage = offline && !loading ? <OfflineIndicator /> : null;
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
      <ErrorBoundary>
        <MovieServiceContext.Provider value={{ genres }}>
          <div className="wrapper">
            <header className="header">
              <Tab
                onHandleSearchValueChange={this.handleSearchValueChange}
                searchValue={searchValue}
                onToggleTab={this.onToggleTab}
              />
              {nothing}
            </header>
            <main className="main">
              {errorMessage}
              {offlineMessage}
              {spinner}
              {content}
            </main>
            <footer className="footer">{pagination}</footer>
          </div>
        </MovieServiceContext.Provider>
      </ErrorBoundary>
    );
  }
}

export default App;
