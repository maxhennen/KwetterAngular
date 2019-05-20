import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Following} from '../models/following.model';
import {Kweet} from '../models/kweet.model';


@Injectable({providedIn: 'root'})
export class HomeService {
  private BACKEND_URL = environment.apiURL + 'kweet';

  constructor(private http: HttpClient) {
  }

  async getKweets(followings: [Following]) {

    const options = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Autorization', localStorage.getItem('token'))
    };

    const kweets: [Kweet] = null;

    for (const f of followings) {
      const body = new HttpParams()
        .set('email', f.email_following);
      const resp = await this.http.post<any>(this.BACKEND_URL + '/findByEmail', body.toString, options);
      resp.subscribe(res => {
        console.log(res);
      });
    }


  }

}
