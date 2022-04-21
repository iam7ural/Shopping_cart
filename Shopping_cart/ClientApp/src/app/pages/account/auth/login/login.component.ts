import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  error: string = '';
  returnUrl: string;
  reloadpage=false;
  loginwithlink: string;
  isLoading$: Observable<boolean>;
  domains: any = [
    { name: 'SGOFC', address: 'SGOFC.COM' },
    { name: 'DreamLand', address: 'DREAMLAND.AZ' },
  ];
  public addressyDefaultValue = 'SGOFC.COM'; //set the default value(id)


  private unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginwithlink = this.route.snapshot.queryParams['loginwithlink'];
    if (this.loginwithlink) {

      this.reloadpage=true;
      const loginSubscr = this.authenticationService
      .loginwithlink(this.loginwithlink)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate(['/dashboard']); /*Redirect to Home*/
        },
        (error) => {
          this.toastr.error(error, null, {
            progressBar: true,
            positionClass: 'toast-bottom-center',
          });
        }
      );

    this.unsubscribe.push(loginSubscr);
    }
  }

  ngOnInit(): void {
    // reset login status
    this.authenticationService.logout();

    this.initForm();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      domain: [''],
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginSubscr = this.authenticationService
      .login(this.f.username.value, this.f.password.value, this.f.domain.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.toastr.error(error, null, {
            progressBar: true,
            positionClass: 'toast-bottom-center',
          });
        }
      );

    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
