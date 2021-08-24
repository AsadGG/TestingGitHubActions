import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/components/confirm-dialog/confirm-dialog.component";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-todays-payments",
  templateUrl: "./todays-payments.component.html",
  styleUrls: ["./todays-payments.component.css"],
})
export class TodaysPaymentsComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService,
    public matDialog: MatDialog
  ) {}
  todaysPayments = [];
  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.obtainTodaysPayments).subscribe(
      (res) => {
        this.todaysPayments = res.body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          res.message,
          2
        );
        console.log(`[TodaysPaymentsComponent](ngOnInit) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[TodaysPaymentsComponent](ngOnInit) Error`, error);
      }
    );
  }

  getPaymentDate(date: string) {
    return new Date(date).toDateString();
  }

  calculateTotalAmount(array: any) {
    return array
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
        title: "Payment " + id,
        content: "Payment",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            paymentId: id,
          },
        };
        this.ngxSpinnerService.show();
        this.httpClient
          .delete<any>(ApiPaths.deleteTodaysPayments, options)
          .subscribe(
            (res) => {
              this.todaysPayments = this.todaysPayments.filter(
                (item) => item.id !== id
              );
              this.ngxSpinnerService.hide();
              this.notificationsService.showNotification(
                "bottom",
                "center",
                res.message,
                2
              );
              console.log(`[TodaysPaymentsComponent](onDelete) Response`, res);
            },
            (error) => {
              this.ngxSpinnerService.hide();
              this.notificationsService.showNotification(
                "bottom",
                "center",
                error.message,
                4
              );
              console.log(`[TodaysPaymentsComponent](onDelete) Error`, error);
            }
          );
      }
    });
  }
}
