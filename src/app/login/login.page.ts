import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HelperService } from '../helper.service';
// import * as jwt_decode from "jwt-decode";
// import { Facebook } from '@ionic-native/facebook/ngx';
// import { GooglePlus } from '@ionic-native/google-plus/ngx';
// import { JwtToken } from 'src/modals/jwttoken';
import { ApiService } from '../api.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  userprofile;

  constructor(private navCtrl: NavController, private menuCtrl: MenuController, private fb: FormBuilder,
    private auth: AuthService, private helper: HelperService, private api: ApiService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  register() {
    this.navCtrl.navigateForward(['signup']);
  }

  async login() {
    try {
      this.helper.presentLoading('Signing in...')
      // this.loginForm.get('email').setValue(this.loginForm.get('email').value.trim())
      const user: any = await this.auth.login(this.loginForm.value);
      if (user.phoneNumberVerified) {
        console.log(user);
        //let jwtToken: JwtToken = this.getDecodedAccessToken(user)
        //console.log(jwtToken.id);
        this.auth.saveUser(user)
        this.auth.setToken(user._id);
        this.helper.dismissLoad();
        this.helper.presentToast('Logged in successfully.');
        this.navCtrl.navigateRoot(['home']);
      }
      else {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            email: user.email,
          }
        };
        this.helper.presentToast('Number not verified please verify it.');
        this.helper.dismissLoad();
        this.navCtrl.navigateRoot(['mobile-number'], navigationExtras)
      }
    } catch (error) {
      this.helper.dismissLoad();
      this.helper.presentToast(error.error);
    }
  }

  

  

}
