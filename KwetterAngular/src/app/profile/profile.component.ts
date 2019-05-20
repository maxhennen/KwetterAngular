import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ProfileService} from '../services/profile.service';
import {AuthService} from '../services/auth.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userIsAuthenticated = false;
  currentUser = null;
  isLoading = true;
  content = 'kweets';

  constructor(private route: ActivatedRoute, private profileService: ProfileService,
              private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    const email = this.route.snapshot.queryParamMap.get('email');
    this.getUser(email);
  }

  getUser(email: string) {
    this.profileService.getUser(email).then(data => {
      data.subscribe(user => {
        this.currentUser = user;
        console.log(this.currentUser);
        this.isLoading = false;
      });
    });
  }

  changeName(form: NgForm) {
    this.currentUser.name = form.value.name;
    return this.profileService.changeUser(this.currentUser);
  }

  changeContent(content: string) {
    console.log(content);
    this.content = content;
  }
}

