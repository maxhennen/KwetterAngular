import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {User} from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class ProfileService {
  private BACKEND_URL = environment.apiURL + 'user';

  constructor(private http: HttpClient) {
  }

  async getUser(email: string) {
    const body = new HttpParams()
      .set('email', email);
    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', localStorage.getItem('token'))
    };
    return await this.http.post<any>(this.BACKEND_URL + '/findByEmail', body.toString(), options);
  }

  async changeUser(user: User) {

    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', localStorage.getItem('token'))
    };
    const resp =  await this.http.post<any>(this.BACKEND_URL + '/editUser', JSON.stringify(user), options);
    resp.subscribe(val => console.log(val));
    return resp;
  }
}
