import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "app/components/confirm-dialog/confirm-dialog.component";
import { EditDialogComponent } from "app/components/dialogs/edit-dialog/edit-dialog.component";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.css"],
})
export class ExpensesComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private httpClient: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  addExpensesTypeForm: FormGroup;
  expensesTypeList = [];

  ngOnInit(): void {
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.getExpenseTypeList).subscribe(
      (response) => {
        this.expensesTypeList = response.body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[ExpensesComponent](ngOnInit) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[ExpensesComponent](ngOnInit) Error`, error);
      }
    );

    this.addExpensesTypeForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
    });
  }

  createExpensesType(): void {
    this.ngxSpinnerService.show();
    this.httpClient
      .post<any>(ApiPaths.createExpenseType, this.addExpensesTypeForm.value)
      .subscribe(
        (response) => {
          this.addExpensesTypeForm.reset();
          this.expensesTypeList.push(response.body.data);
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            response.message,
            2
          );
          console.log(
            `[ExpensesComponent](createExpensesType) Response`,
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
          console.log(
            `[ExpensesComponent](createExpensesType) Response`,
            error
          );
        }
      );
  }
  confirmDeleteDialog(id) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: "ExpensesType",
        content: "ExpensesType",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            expenseTypeId: id,
          },
        };
        this.ngxSpinnerService.show();
        this.httpClient
          .delete<any>(ApiPaths.deleteExpenseType, options)
          .subscribe(
            (response) => {
              this.expensesTypeList = this.expensesTypeList.filter(
                (item) => item.id !== id
              );
              this.ngxSpinnerService.hide();
              this.notificationsService.showNotification(
                "bottom",
                "center",
                response.message,
                2
              );
              console.log(
                `[ExpensesComponent](confirmDeleteDialog) Response`,
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
              console.log(
                `[ExpensesComponent](confirmDeleteDialog) Error`,
                error
              );
            }
          );
      }
    });
  }

  openEditDialog(id, name) {
    const dialogRef = this.matDialog.open(EditDialogComponent, {
      data: {
        template: "editExpensesType",
        values: {
          id: id,
          name: name,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngxSpinnerService.show();
        this.httpClient.put<any>(ApiPaths.editExpenseType, result).subscribe(
          (response) => {
            let indexToUpdate = this.expensesTypeList.findIndex((item) => {
              return item.id == id;
            });
            this.expensesTypeList[indexToUpdate].name = result.name;
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              response.message,
              2
            );
            console.log(
              `[ExpensesComponent](openEditDialog) Response`,
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
            console.log(`[ExpensesComponent](openEditDialog) Error`, error);
          }
        );
      }
    });
  }
}
