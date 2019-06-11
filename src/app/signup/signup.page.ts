import { Component, OnInit } from '@angular/core';
// import { User } from 'src/modals/user';
import { AuthService } from '../auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HelperService } from '../helper.service';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  // user: User;

  constructor(private navCtrl: NavController, private auth: AuthService,
    private fb: FormBuilder, private helper: HelperService) { }

  ngOnInit() {

    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phoneNumberVerified: ['', [Validators.required]]
    })
  }

  gotoLogin() {
    this.navCtrl.navigateRoot(['login']);
  }

  async signup() {

    try {

      if (this.signupForm.get('confirmPassword').value != '') {
        this.helper.presentLoading('Signing Up...');
        this.signupForm.removeControl('confirmPassword')
        this.signupForm.get('phoneNumberVerified').setValue(false);
        const result = await this.auth.signup({ ...this.signupForm.value, joinedDate: Date.now().toString() })
        if (result) {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              email: this.signupForm.value.email,
            }
          };
          this.helper.dismissLoad();
          this.navCtrl.navigateRoot(['mobile-number'], navigationExtras);
          this.signupForm.reset();
        }
        this.signupForm.addControl('confirmPassword', new FormControl('', [Validators.required]));
      } else {
        this.helper.presentToast('"confirmPassword" is not allowed to be empty')
        this.helper.dismissLoad();
      }
    } catch (error) {
      this.helper.presentToast(error.message);
      this.helper.dismissLoad();
      console.log(error)
    }
  }
}
