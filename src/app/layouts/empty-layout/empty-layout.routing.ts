import { Routes } from "@angular/router";
import { LoginPageComponent } from "app/login-page/login-page.component";
import { SignInComponent } from "app/login-page/sign-in/sign-in.component";

export const EmptyLayoutRoutes: Routes = [
  {
    path: "",
    component: LoginPageComponent,
    children: [
      { path: "", redirectTo: "sign-in" },
      {
        path: "sign-in",
        component: SignInComponent,
      },
      {
        path: "sign-up",
        redirectTo: "sign-in",
      },
      // {
      //   path: "sign-up",
      //   component: SignUpComponent,
      // },
    ],
  },
];
