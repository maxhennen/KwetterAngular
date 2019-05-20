import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthData} from '../models/auth-data.model';
import {Subject} from 'rxjs';
import {NavigationExtras, Router, UrlSerializer} from '@angular/router';
import {environment} from '../../environments/environment';
import {skip} from 'rxjs/operators';
import {serialize} from '@angular/compiler/src/i18n/serializers/xml_helper';
import {User} from '../models/user.model';
import {AuthUser} from '../models/authUser.model';

const BACKEND_URL = environment.apiURL + 'auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;
  private _userId: string;
  private user: User;

  constructor(private http: HttpClient, private router: Router, private serializer: UrlSerializer ) {}

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }


  getUserId(): string {
    return this._userId;
  }

  getUser(): User {
    return this.user;
  }

  createUser(email: string, password: string, name: string) {

    const user: AuthUser = {
      name: name,
      email: email,
      password: password,
    };

    return this.http.post(BACKEND_URL + '/createUser', user)
      .subscribe(response => {
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  async login(email: string, password: string) {
    const body = new HttpParams()
      .set('email', email)
      .set('password', password);
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    this.http.post<any>(BACKEND_URL + '/token', body.toString(), options)
      .subscribe(response => {
        const token = response.token;
        const user = response.user;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration * 1000);
          this.isAuthenticated = true;
          this._userId = user.id;
          this.user = user;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this._userId);

          this.router.navigate(['/profile'], {queryParams: {email: user.email}});
        }
      }, error1 => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this._userId = authInformation.userId;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('uesrId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      };
    }
  }
}
