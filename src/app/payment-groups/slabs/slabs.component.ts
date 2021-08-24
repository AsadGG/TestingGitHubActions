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
  selector: "app-slabs",
  templateUrl: "./slabs.component.html",
  styleUrls: ["./slabs.component.css"],
})
export class SlabsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _http: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  addSlabForm: FormGroup;
  slabsList = [];
  ngOnInit(): void {
    // call room list API
    this.ngxSpinnerService.show();
    this._http.get<any>(ApiPaths.getSlabsList).subscribe(
      (response) => {
        this.slabsList = response.body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[SlabsComponent](ngOnInit) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[SlabsComponent](ngOnInit) Error`, error);
      }
    );

    this.addSlabForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      amount: new FormControl("", [Validators.required]),
    });
  }

  createSlab(): void {
    this.ngxSpinnerService.show();
    this._http.post<any>(ApiPaths.createSlab, this.addSlabForm.value).subscribe(
      (response) => {
        this.addSlabForm.reset();
        this.slabsList.push(response.body.data);
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[SlabsComponent](createSlab) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[SlabsComponent](createSlab) Error`, error);
      }
    );
  }

  confirmDeleteDialog(id) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Slab",
        content: "Slab Price",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            slabId: id,
          },
        };
        this.ngxSpinnerService.show();
        this._http.delete<any>(ApiPaths.deleteSlab, options).subscribe(
          (response) => {
            let indexToDelete = this.slabsList.findIndex((item) => {
              return item.id == id;
            });
            this.slabsList.splice(indexToDelete, 1);
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              response.message,
              2
            );
            console.log(
              `[SlabsComponent](confirmDeleteDialog) Response`,
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
            console.log(`[SlabsComponent](confirmDeleteDialog) Error`, error);
          }
        );
      }
    });
  }

  openEditDialog(id, name, amount) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        template: "editSlab",
        values: {
          id: id,
          name: name,
          amount: amount,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngxSpinnerService.show();
        this._http.put<any>(ApiPaths.editSlab, result).subscribe(
          (response) => {
            let indexToUpdate = this.slabsList.findIndex((item) => {
              return item.id == id;
            });
            this.slabsList[indexToUpdate].name = result.name;
            this.slabsList[indexToUpdate].amount = result.amount;
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              response.message,
              2
            );
            console.log(`[SlabsComponent](openEditDialog) Response`, response);
          },
          (error) => {
            this.ngxSpinnerService.hide();
            this.notificationsService.showNotification(
              "bottom",
              "center",
              error.message,
              4
            );
            console.log(`[SlabsComponent](openEditDialog) Error`, error);
          }
        );
      }
    });
  }
}
