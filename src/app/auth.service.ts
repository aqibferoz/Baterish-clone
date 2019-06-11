import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController, MenuController } from '@ionic/angular';
// import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = `http://50.63.12.199:3000`;
  
  // user = this.socket.fromEvent(this.getToken())

  constructor(private httpClient: HttpClient, private route: NavController,
    public menu: MenuController) { }

  userByUid(uid) {
    return this.httpClient.get(this.baseUrl + `/api/users/${uid}`, { headers: { 'content-type': 'application/json' } })
      .pipe(first())
      .toPromise()
  }

  login(data) {
    return this.httpClient.post(this.baseUrl + '/api/auth/login', data, { headers: { 'content-type': 'application/json' } })
      .pipe(first())
      .toPromise();
  }

  signup(data) {
    return this.httpClient.post(this.baseUrl + '/api/users/signup', data, { responseType: 'text' })
      .pipe(first())
      .toPromise();
  }

  phoneVerification(data) {
    return this.httpClient.post(this.baseUrl + '/api/authy/send', data)
      .pipe(first())
      .toPromise();
  }

  pinVerify(data) {
    return this.httpClient.post(this.baseUrl + '/api/authy/check', data)
      .pipe(first())
      .toPromise();
  }

  numberVerified(data) {
    return this.httpClient.post(this.baseUrl + '/api/users/number', data, { headers: { 'content-type': 'application/json' } })
      .pipe(first())
      .toPromise();
  }

  fbAuth(data) {
    return this.httpClient.post(this.baseUrl + '/api/users/fb', data, { responseType: 'text' })
      .pipe(first())
      .toPromise();
  }

  googleAuth(data) {
    return this.httpClient.post(this.baseUrl + '/api/users/google', data, { responseType: 'text' })
      .pipe(first())
      .toPromise();
  }

  getToken() {
    return localStorage.getItem('uid');
  }

  saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user))
  }

  setToken(id) {
    localStorage.setItem('uid', id)
  }

  logout() {
    localStorage.clear();
    this.menu.enable(false, 'myMenu');
    this.route.navigateRoot(['login']);
  }
}
