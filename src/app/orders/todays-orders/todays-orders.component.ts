import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/components/confirm-dialog/confirm-dialog.component";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-todays-orders",
  templateUrl: "./todays-orders.component.html",
  styleUrls: ["./todays-orders.component.css"],
})
export class TodaysOrdersComponent implements OnInit {
  totalQuantity;
  totalAmount;

  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService,
    public matDialog: MatDialog
  ) {}
  todaysOrders = [];
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.obtainTodaysOrders).subscribe(
      (res) => {
        this.todaysOrders = res.body.data;
        this.calculateTotal(this.todaysOrders);

        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          res.message,
          2
        );
        console.log(`[TodaysOrdersComponent](ngOnInit) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[TodaysOrdersComponent](ngOnInit) Error`, error);
      }
    );
  }

  getOrderDate(date: string) {
    return new Date(date).toDateString();
  }

  calculateTotal(array: any) {
    this.totalQuantity = array
      .map((item) => {
        return item.quantity;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);

    this.totalAmount = array
      .map((item) => {
        return item.amount;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }

  onDelete(id: number) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: "Order " + id,
        content: "Order",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            orderId: id,
          },
        };
        this.ngxSpinnerService.show();
        this.httpClient
          .delete<any>(ApiPaths.deleteTodaysOrder, options)
          .subscribe(
            (res) => {
              this.todaysOrders = this.todaysOrders.filter(
                (item) => item.id !== id
              );
              this.ngxSpinnerService.hide();
              this.notificationsService.showNotification(
                "bottom",
                "center",
                res.message,
                2
              );
              console.log(`[TodaysOrdersComponent](onDelete) Response`, res);
            },
            (error) => {
              this.ngxSpinnerService.hide();
              this.notificationsService.showNotification(
                "bottom",
                "center",
                error.message,
                4
              );
              console.log(`[TodaysOrdersComponent](onDelete) Error`, error);
            }
          );
      }
    });
  }
}
