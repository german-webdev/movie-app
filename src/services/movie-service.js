/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
import { format } from 'date-fns';

export default class MovieService {
  _apiBase = 'https://api.themoviedb.org/3/';

  _apiKey = 'api_key=4029bbd50282fba9b344e7c00decf6d1';

  sessionId = localStorage.getItem('sessionId');

  async createGuestSession() {
    const url = 'authentication/guest_session/new';
    const res = await fetch(`${this._apiBase}${url}?${this._apiKey}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getGuestSessionId() {
    const id = await this.createGuestSession();
    return this._toLocalSessionId(id);
  }

  async createRequestToken() {
    const url = 'authentication/token/new';
    const res = await fetch(`${this._apiBase}${url}?${this._apiKey}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async addRating(movieId, value) {
    const guestSessionId = localStorage.getItem('sessionId');
    const url = `${this._apiBase}movie/${movieId}/rating?guest_session_id=${guestSessionId}&${this._apiKey}`;

    const POST_OPTIONS = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value }),
    };
    const res = await fetch(url, POST_OPTIONS);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
  }

  async getRequestToken() {
    const token = await this.createRequestToken();
    return this._transformToken(token);
  }

  async getResource(url, value, page = 1) {
    const res = await fetch(`${this._apiBase}${url}?${this._apiKey}&query=${value}&page=${page}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getAllGenres() {
    const url = `${this._apiBase}genre/movie/list?${this._apiKey}&language=en`;
    const res = await fetch(`${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async requestRatedMovie() {
    const guestSessionId = localStorage.getItem('sessionId');
    const url = `${this._apiBase}guest_session/${guestSessionId}/rated/movies?${this._apiKey}`;
    const res = await fetch(`${url}`);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`);
    }
    return await res.json();
  }

  async getMovies(value, page) {
    const movie = await this.getResource('search/movie', value, page);
    return movie.results.map((item) => this._transformMovie(item));
  }

  async getRatedMovie() {
    const movie = await this.requestRatedMovie();
    return movie.results.map((item) => this._transformMovie(item), this.getRating);
  }

  async getTotalMovies(value) {
    const totalResults = await this.getResource('search/movie', value);
    return this._transformPage(totalResults);
  }

  async getGenres() {
    const genresArr = await this.getAllGenres();
    return genresArr.genres.map((item) => this._transformGenresArr(item));
  }

  _toLocalSessionId(id) {
    localStorage.setItem('success', id.success);
    localStorage.setItem('time', id.expires_at);
    localStorage.setItem('sessionId', id.guest_session_id);
  }

  _transformToken(token) {
    return {
      token: token.request_token,
    };
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
      description: movie.overview ? this._textCutter(movie.overview, 150) : 'No overview',
      id: movie.id ? movie.id : '',
      image: this._getPoster(movie.poster_path),
      rate: movie.vote_average ? this._roundRate(movie.vote_average) : '0.0',
      rating: movie.rating,
      title: movie.title ? this._textCutter(movie.title, 35) : '',
      genresIds: movie.genre_ids ? movie.genre_ids : 'Genre not specified',
    };
  };

  _transformPage = (page) => {
    const totalResults = page.total_results;
    return totalResults;
  };
}
