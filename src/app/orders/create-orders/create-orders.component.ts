import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-create-orders",
  templateUrl: "./create-orders.component.html",
  styleUrls: ["./create-orders.component.css"],
})
export class CreateOrdersComponent implements OnInit {
  rooms = [];
  customers = [];
  orderForm;

  constructor(
    private _http: HttpClient,
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private notificationsService: NotificationsService
  ) {
    this.orderForm = this.formBuilder.group({
      orderDetails: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.getInitData();
  }

  get orderDetials() {
    return this.orderForm.controls["orderDetails"] as FormArray;
  }

  getInitData(): void {
    this.ngxSpinnerService.show();
    this._http.get<any>(ApiPaths.getCustomerList).subscribe(
      (response) => {
        this.rooms = response.body.data.roomsList;
        this.customers = response.body.data.customerList;
        this.generateForm();
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[CreateOrdersComponent](getInitData) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[CreateOrdersComponent](getInitData) Error`, error);
      }
    );
  }

  placeOrder(id): void {
    let value = this.orderDetials.controls[id].value;
    if (value.payment == "" || value.payment == undefined) {
      delete value.payment;
    } else if (
      !(value.payment == "" || value.payment == undefined) &&
      (value.quantity == "" || value.quantity == undefined)
    ) {
      value.roomId = 1;
      delete value.quantity;
    }
    let body = value;
    this.ngxSpinnerService.show();
    this._http.post<any>(ApiPaths.placeOrder, body).subscribe(
      (response) => {
        let formGroup = this.formBuilder.group({
          quantity: ["", Validators.pattern("^[0-9]*$")],
          roomId: ["", Validators.pattern("^[0-9]*$")],
          payment: ["", Validators.pattern("^[0-9]*$")],
          customerId: [
            response.body.data.customer.id,
            Validators.pattern("^[0-9]*$"),
          ],
        });
        this.orderDetials.controls.splice(id, 1, formGroup);
        this.customers[id] = response.body.data.customer;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[CreateOrdersComponent](placeOrder) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[CreateOrdersComponent](placeOrder) Error`, error);
      }
    );
  }

  generateForm(): void {
    this.customers.forEach((element) => {
      this.orderDetials.push(
        this.formBuilder.group({
          quantity: ["", Validators.pattern("^[0-9]*$")],
          roomId: ["", Validators.pattern("^[0-9]*$")],
          payment: ["", Validators.pattern("^[0-9]*$")],
          customerId: [element.id, Validators.pattern("^[0-9]*$")],
        })
      );
    });
  }

  checkIsValid(formGroupValue): boolean {
    if (
      (formGroupValue.roomId != "" && formGroupValue.quantity > 0) ||
      formGroupValue.payment > 0
    ) {
      return false;
    }
    return true;
  }
}
