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
      searchTerm: '',

      totalResults: 0,
      currentPage: 1,
    };

    this.getNameGenres = () => {
      const genresIds = this.state.movies.map((item) => {
        return item.genresIds;
      });
      this.getName = (genres = this.state.genres, keys = genresIds) => {
        console.log('genres:', genres);
        console.log('keys:', keys);
        const arr = [];
        for (let i = 0; i < genres.length; i++) {
          for (let j = 0; j < keys.length; j++) {
            if (genres[i].id === keys[j]) {
              arr.push(genres[i].name);
            }
            console.log('keys[j]:', keys[j]);
          }
          console.log('genres[i]:', genres[i].id);
        }
        console.log('arr:', arr);
        return arr;
      };
      this.setState({
        genreName: this.getName(),
      });
    };

    this.nextPage = (pageNumber) => {
      this.service.getMovies(this.state.searchTerm, pageNumber).then(this.onMovieLoaded).catch(this.onError);
      this.getNameGenres();
      this.saveCurrentPage(pageNumber);
    };

    this.saveCurrentPage = (pageNumber) => {
      this.setState({
        currentPage: pageNumber,
      });
    };

    this.getTotal = (totalResults) => {
      this.setState({
        totalResults,
      });
    };

    this.componentDidMount = () => {
      this.getArr();
      this.onMovieLoaded = (movies) => {
        this.setState({
          movies,
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
      this.getNameGenres();
      this.setState({
        loading: true,
        searchTerm: event.target.value,
      });
    };

    this.getGenresArr = (genres) => {
      this.setState({
        genres,
      });
    };

    this.getArr = () => {
      this.service.getGenresArr().then(this.getGenresArr);
    };
  }

  // componentDidMount() {
  // }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.searchTerm !== prevState.searchTerm) {
      this.service.getMovies(this.state.searchTerm).then(this.onMovieLoaded).catch(this.onError);
      this.service.getTotalResults(this.state.searchTerm).then(this.getTotal);
      this.getNameGenres();
    }
  }

  render() {
    const { movies, loading, error, totalResults, currentPage, searchTerm, genreName } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorIndicator /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <MovieList movies={movies} genreName={genreName} /> : null;

    return (
      <MovieServiceProvider value={this.MovieService}>
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
