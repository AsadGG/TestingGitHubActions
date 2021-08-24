import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { EmptyLayoutRoutes } from "./empty-layout.routing";

import { LoginPageComponent } from "app/login-page/login-page.component";
import { SignInComponent } from "app/login-page/sign-in/sign-in.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EmptyLayoutRoutes),
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  declarations: [SignInComponent, LoginPageComponent],
})
export class EmptyLayoutModule {}
