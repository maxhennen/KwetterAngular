import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {User} from '../models/user.model';
import {Router} from '@angular/router';
import {HomeService} from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoading = true;
  user: User = null;
  kweets = [];

  constructor(private authService: AuthService, private router: Router, private homeService: HomeService) { }

  ngOnInit() {
    this.isLoading = false;
    this.user = this.authService.getUser();
    console.log(this.user);
    this.getKweets();
  }

  searchChange(searchValue: string) {
    console.log(searchValue);
  }

  goToProfile(email: string) {
    this.router.navigate(['/profile'], {queryParams: {email: email}});
  }

  getKweets() {
    this.homeService.getKweets(this.user.followings);
  }

}
