import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit {
  readonly ONE_YEAR_IN_MILLISECONDS = 366 * 24 * 60 * 60 * 1000;
  minDate = new Date(Date.now() - this.ONE_YEAR_IN_MILLISECONDS);
  maxDate = new Date(Date.now());
  printAble: boolean = false;
  currentDate: Date = new Date(Date.now());
  customer = {};
  customersOption = [];
  customerReports = [];
  totalPayment = 0;
  totalBlocks = 0;
  TotalAmount = 0;
  reportForm: FormGroup = new FormGroup({
    startDate: new FormControl(this.currentDate, [Validators.required]),
    endDate: new FormControl(this.currentDate, [Validators.required]),
    customerId: new FormControl(null, [Validators.required]),
  });
  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getCustomerOptions();
  }

  showDate(dateString: string) {
    return this.getDate(new Date(dateString));
  }

  generateReportObject(form) {
    return {
      customerId: form.value.customerId,
      startDate: this.getDate(form.value.startDate),
      endDate: this.getDate(form.value.endDate),
    };
  }

  getCustomerOptions() {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.customers).subscribe(
      (res) => {
        this.customersOption = res.body.data;
        this.ngxSpinnerService.hide();
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[ReportsComponent](getCustomerOptions) Error`, error);
      }
    );
  }

  getDate(date) {
    let dateDay = date.getDate().toString();
    if (date.getDate() < 10) {
      dateDay = "0" + date.getDate();
    }
    return date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + dateDay;
  }

  onGenerateReport() {
    this.ngxSpinnerService.show();
    this.httpClient
      .post<any>(
        ApiPaths.getCustomerReports,
        this.generateReportObject(this.reportForm)
      )
      .subscribe(
        (res) => {
          this.customer = res.body.data.customer;
          this.customerReports = res.body.data.report;
          this.calculatesumOfTotal(this.customerReports);

          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            res.message,
            2
          );
          console.log(`[ReportsComponent](onGenerateReport) Response`, res);
          this.printAble = true;
        },
        (error) => {
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            error.message,
            4
          );
          console.log(`[ReportsComponent](onGenerateReport) Error`, error);
        }
      );
  }

  calculatesumOfTotal(array) {
    this.totalPayment = array
      .map((item) => {
        return item.order === null ? item.transactionAmount : 0;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    this.totalBlocks = array
      .map((item) => {
        return item.order !== null ? item.order.quantity : 0;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    this.TotalAmount = array
      .map((item) => {
        return item.order !== null ? item.order.amount : 0;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }
}
