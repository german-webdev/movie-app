/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
import { format } from 'date-fns';

export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';

  _apiKey = 'api_key=4029bbd50282fba9b344e7c00decf6d1';

  async getResource(url, value, page = 1) {
    const res = await fetch(`${this._apiBase}${url}?${this._apiKey}&query=${value}&page=${page}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getMovies(value, page) {
    const movie = await this.getResource('search/movie', value, page);
    return movie.results.map((item) => this._transformMovie(item));
  }

  async getTotalResults(value) {
    const totalResults = await this.getResource('search/movie', value);
    return this._transformPage(totalResults);
  }

  _getPoster(path) {
    return path === null
      ? 'https://s3-ap-southeast-1.amazonaws.com/upcode/static/default-image.jpg'
      : `https://image.tmdb.org/t/p/original${path}`;
  }

  _transformDate(date) {
    return format(new Date(date.split('-').map((int) => parseFloat(int))), 'MPP');
  }

  _roundRate(rate) {
    return rate.toString().length === 1 ? `${parseFloat(rate.toFixed(1))}.0` : parseFloat(rate.toFixed(1));
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
      date: this._transformDate(movie.release_date),
      description: this._textCutter(movie.overview, 150),
      id: movie.id,
      image: this._getPoster(movie.poster_path),
      rate: this._roundRate(movie.vote_average),
      title: this._textCutter(movie.title, 999),
    };
  };

  _transformPage = (page) => {
    const totalResults = page.total_results;
    return totalResults;
  };
}
