import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class CustomersService {
  readonly edit = "Edit";
  readonly create = "Create";
  mode: string = this.create;
  customer: any = {};
  constructor(private router: Router) {}

  onSetCustomer(customer) {
    this.customer = customer;
  }

  onSetDefaultMode() {
    this.mode = this.create;
  }

  onNavigateToEdit() {
    this.mode = this.edit;
    this.router.navigate(["customers/add-customer"]);
  }

  onNavigateBack() {
    this.onSetDefaultMode();
    this.router.navigate(["customers"]);
  }
}
