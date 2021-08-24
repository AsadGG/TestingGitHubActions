import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/components/confirm-dialog/confirm-dialog.component";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomersService } from "../customers.service";

@Component({
  selector: "app-customer-page",
  templateUrl: "./customer-page.component.html",
  styleUrls: ["./customer-page.component.css"],
})
export class CustomerPageComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private customersService: CustomersService,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService,
    public dialog: MatDialog
  ) {}
  customers = [];
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.customers).subscribe(
      (res) => {
        this.customers = res.body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          res.message,
          2
        );
        console.log(`[CustomerPageComponent](ngOnInit) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[CustomerPageComponent](ngOnInit) Error`, error);
      }
    );
  }

  calculateTotalDue(array: any) {
    return array
      .map((item) => {
        return item.remaining_amount;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Customer",
        content: "Customer",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            customerId: id,
          },
        };
        this.ngxSpinnerService.show();
        this.httpClient.delete<any>(ApiPaths.customers, options).subscribe(
          (res) => {
            this.customers = this.customers.filter((item) => item.id !== id);
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              res.message,
              2
            );
            console.log(`[CustomerPageComponent](onDelete) Response`, res);
          },
          (error) => {
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              error.message,
              4
            );
            console.log(`[CustomerPageComponent](onDelete) Error`, error);
          }
        );
      }
    });
  }

  onEdit(id: number) {
    let customer;
    customer = this.customers.find((customer) => customer.id === id);
    this.customersService.onSetCustomer(customer);
    this.customersService.onNavigateToEdit();
  }
}
