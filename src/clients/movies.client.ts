import axios from 'axios';
import { API_READ_ACCESS_TOKEN } from '../constants';
import type { ApiResponse } from '../types';

interface MovieFilters {
  page?: number;
  year?: number;
  voteAverage?: number;
}

class MoviesClient {
  private axiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.themoviedb.org/3',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
      },
    });
  }
  public async getMovies(filters: MovieFilters = {}): Promise<ApiResponse> {
    try {
      const params = new URLSearchParams({
        include_adult: 'true',
        include_video: 'false',
        language: 'en-US',
        'vote_count.gte': '50',
        sort_by: 'popularity.desc',
        page: (filters.page || 1).toString(),
        'vote_average.gte': (filters.voteAverage || 7.4).toString()
      });

      if (filters.year) {
        params.append('year', filters.year.toString());
      }

      const { data } = await this.axiosInstance.get<ApiResponse>(
        `/discover/movie?${params.toString()}`
      );
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default new MoviesClient();