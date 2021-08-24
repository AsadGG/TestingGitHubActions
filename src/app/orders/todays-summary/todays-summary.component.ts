import { Component, OnInit } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { HttpClient } from "@angular/common/http";
import { NotificationsService } from "app/services/notifications.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiPaths } from "environments/api-paths";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-todays-summary",
  templateUrl: "./todays-summary.component.html",
  styleUrls: ["./todays-summary.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class TodaysSummaryComponent implements OnInit {
  rooms;
  todaysSummary;
  totalPaymentsToday;
  totalExpenseToday;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["id", "name", "remaining_amount"];
  constructor(
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.getTodaysSummary).subscribe(
      (res) => {
        console.log(res);
        this.rooms = res.body.data.rooms;
        this.todaysSummary = res.body.data.todaysSummary;
        this.totalPaymentsToday = res.body.data.totalPaymentsToday;
        this.totalExpenseToday = res.body.data.totalExpenseToday;
        this.dataSource = new MatTableDataSource(this.todaysSummary);

        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          res.message,
          2
        );
        console.log(`[TodaysSummaryComponent](ngOnInit) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[TodaysSummaryComponent](ngOnInit) Error`, error);
      }
    );
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

  calculateTotalQuantity(array: any) {
    return array
      .map((item) => {
        return item.quantity;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }

  humanize(str) {
    return str
      .replace(/^[\s_]+|[\s_]+$/g, "")
      .replace(/[_\s]+/g, " ")
      .replace(/^[a-z]/, function (m) {
        return m.toUpperCase();
      });
  }
}
