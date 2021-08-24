import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { EmptyLayoutComponent } from "./layouts/empty-layout/empty-layout.component";
import { UnauthGuard } from "./guards/unauth.guard";
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "orders",
    pathMatch: "full",
  },
  {
    canActivate: [AuthGuard],
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/admin-layout/admin-layout.module").then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
  {
    canActivate: [UnauthGuard],
    path: "login",
    component: EmptyLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./layouts/empty-layout/empty-layout.module").then(
            (m) => m.EmptyLayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
