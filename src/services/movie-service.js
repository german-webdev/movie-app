/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
import { format } from 'date-fns';

export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MDI5YmJkNTAyODJmYmE5YjM0NGU3YzAwZGVjZjZkMSIsInN1YiI6IjY0ODU4ZDkwOTkyNTljMDBlMmY1NTQwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.MrM0rvXnzXECKbYj-jD0JFZ9ZXT9SqMvwX3gF72jNYA',
    },
  };

  async getResource(url, value = 'return', page = 1) {
    const res = await fetch(`${this._apiBase}${url}?query=${value}&page=${page}`, this.options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getMovies(value, page) {
    const movie = await this.getResource('search/movie', value, page);
    return movie.results.map((item) => this._transformMovie(item));
  }

  async getAllGenres() {
    const url = 'genre/movie/list';
    const res = await fetch(`${this._apiBase}${url}?language=en`, this.options);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getTotalResults(value) {
    const totalResults = await this.getResource('search/movie', value);
    return this._transformPage(totalResults);
  }

  async getGenresArr() {
    const genresArr = await this.getAllGenres();
    return genresArr.genres.map((item) => this._transformGenresArr(item));
  }

  _transformGenresArr(genres) {
    return {
      id: genres.id,
      name: genres.name,
    };
  }

  _getPoster(path) {
    return !path
      ? 'https://s3-ap-southeast-1.amazonaws.com/upcode/static/default-image.jpg'
      : `https://image.tmdb.org/t/p/original${path}`;
  }

  _transformDate(date) {
    return format(new Date(date.split('-').map((int) => parseFloat(int))), 'MPP');
  }

  _roundRate(rate) {
    return rate.length === 1 ? `${rate.toFixed(1)}.0` : rate.toFixed(1);
  }

  _textCutter(text, limit) {
    text = text.trim();
    if (text.length <= limit) return text;
    text = text.slice(0, limit);
    const lastSpace = text.lastIndexOf(' ');
    if (lastSpace > 0) {
      text = text.substr(0, lastSpace);
    }
    return `${text}...`;
  }

  _transformMovie = (movie) => {
    return {
      date: movie.release_date ? this._transformDate(movie.release_date) : '',
      description: movie.overview ? this._textCutter(movie.overview, 150) : '',
      id: movie.id ? movie.id : '',
      image: this._getPoster(movie.poster_path),
      rate: movie.vote_average ? this._roundRate(movie.vote_average) : '0.0',
      title: movie.title ? this._textCutter(movie.title, 35) : '',
      genresIds: movie.genre_ids,
    };
  };

  _transformPage = (page) => {
    const totalResults = page.total_results;
    return totalResults;
  };
}

// const genres = new MovieService();
// genres.getAllGenres().then((res) => console.log(res));
