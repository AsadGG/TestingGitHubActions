import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/components/confirm-dialog/confirm-dialog.component";
import { EditDialogComponent } from "app/components/dialogs/edit-dialog/edit-dialog.component";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";
import { forkJoin, Observable } from "rxjs";

@Component({
  selector: "app-todays-expenses",
  templateUrl: "./todays-expenses.component.html",
  styleUrls: ["./todays-expenses.component.css"],
})
export class TodaysExpensesComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _http: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  addExpenseForm: FormGroup;
  expensesList = [];
  expenseTypes = [];

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.getInitData().subscribe(
      (response) => {
        console.log(response);
        this.expenseTypes = response[0].body.data;
        this.expensesList = response[1].body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response[1].message,
          2
        );
        console.log(`[TodaysExpensesComponent](ngOnInit) Response2`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error[1].message,
          4
        );
      }
    );

    this.addExpenseForm = new FormGroup({
      expenseTypeId: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      reason: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      amount: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
  }

  getInitData(): Observable<any> {
    const response1 = this._http.get<any>(ApiPaths.getExpenseTypeList);
    const response2 = this._http.get<any>(ApiPaths.getExpenseList);
    return forkJoin([response1, response2]);
  }

  createExpense(): void {
    this.ngxSpinnerService.show();
    console.log(this.addExpenseForm.value);
    this._http
      .post<any>(ApiPaths.createExpense, this.addExpenseForm.value)
      .subscribe(
        (response) => {
          this.addExpenseForm.reset();
          this.expensesList.push(response.body.data.expense);
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            response.message,
            2
          );
          console.log(`[RoomsComponent](createRoom) Response`, response);
        },
        (error) => {
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            error.message,
            4
          );
          console.log(`[RoomsComponent](createRoom) Error`, error);
        }
      );
  }

  confirmDeleteDialog(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Expense",
        content: "Expense",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            expenseId: id,
          },
        };
        this.ngxSpinnerService.show();
        this._http.delete<any>(ApiPaths.deleteExpense, options).subscribe(
          (response) => {
            let indexToDelete = this.expensesList.findIndex((item) => {
              return item.id == id;
            });
            this.expensesList.splice(indexToDelete, 1);
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              response.message,
              2
            );
            console.log(
              `[RoomsComponent](confirmDeleteDialog) Response`,
              response
            );
          },
          (error) => {
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              error.message,
              4
            );
            console.log(`[RoomsComponent](confirmDeleteDialog) Error`, error);
          }
        );
      }
    });
  }

  openEditDialog(id, reason, amount) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        template: "editExpense",
        values: {
          id: id,
          reason: reason,
          amount: amount,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngxSpinnerService.show();
        this._http.put<any>(ApiPaths.editExpense, result).subscribe(
          (response) => {
            let indexToUpdate = this.expensesList.findIndex((item) => {
              return item.id == id;
            });
            this.expensesList[indexToUpdate].reason = result.reason;
            this.expensesList[indexToUpdate].amount = result.amount;
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              response.message,
              2
            );
            console.log(`[RoomsComponent](openEditDialog) Response`, response);
          },
          (error) => {
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              error.message,
              2
            );
            console.log(`[RoomsComponent](openEditDialog) Error`, error);
          }
        );
      }
    });
  }

  calculateTotalAmount(array: any) {
    return array
      .map((item) => {
        return +item.amount;
      })
      .reduce((acc, curr) => {
        return acc + curr;
      }, 0);
  }
}
