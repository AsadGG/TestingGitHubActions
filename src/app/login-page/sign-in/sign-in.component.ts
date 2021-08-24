import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NotificationsService } from "app/services/notifications.service";
import { UserService } from "app/services/user.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  generateUserObject(loginForm: FormGroup) {
    return {
      username: loginForm.value.username,
      password: loginForm.value.password,
    };
  }
  onSubmit() {
    this.ngxSpinnerService.show();
    this.httpClient
      .post<any>(ApiPaths.AuthLogin, this.generateUserObject(this.loginForm))
      .subscribe(
        (res) => {
          this.userService.initLogin(res);
          this.router.navigate(["orders"]);
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            res.message,
            2
          );
          console.log(`[SignInComponent](onSubmit) Response`, res);
        },
        (error) => {
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            error.message,
            4
          );
          console.log(`[SignInComponent](onSubmit) Error`, error);
        }
      );
  }
  initializeForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }
}
