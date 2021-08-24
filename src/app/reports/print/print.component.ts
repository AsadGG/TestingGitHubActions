import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-print",
  templateUrl: "./print.component.html",
  styleUrls: ["./print.component.css"],
})
export class PrintComponent implements OnInit {
  @Input() customer = { name: "" };
  @Input() customerReports = [];
  @Input() totalPayment = 0;
  @Input() totalBlocks = 0;
  @Input() TotalAmount = 0;
  constructor() {}

  ngOnInit(): void {}

  showDate(dateString: string) {
    return this.getDate(new Date(dateString));
  }
  getDate(date) {
    let dateDay = date.getDate().toString();
    if (date.getDate() < 10) {
      dateDay = "0" + date.getDate();
    }
    return date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + dateDay;
  }
}
