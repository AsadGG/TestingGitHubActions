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
  selector: "app-rooms",
  templateUrl: "./rooms.component.html",
  styleUrls: ["./rooms.component.css"],
})
export class RoomsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private _http: HttpClient,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}
  addRoomForm: FormGroup;
  roomsList = [];

  ngOnInit(): void {
    // call room list API
    this.ngxSpinnerService.show();
    this._http.get<any>(ApiPaths.getRoomsList).subscribe(
      (response) => {
        this.roomsList = response.body.data;
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          response.message,
          2
        );
        console.log(`[RoomsComponent](ngOnInit) Response`, response);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[RoomsComponent](ngOnInit) Error`, error);
      }
    );

    this.addRoomForm = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
    });
  }

  createRoom(): void {
    this.ngxSpinnerService.show();
    this._http.post<any>(ApiPaths.createRoom, this.addRoomForm.value).subscribe(
      (response) => {
        this.addRoomForm.reset();
        this.roomsList.push(response.body.data);
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
        title: "Room",
        content: "Room",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const options = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
          body: {
            roomId: id,
          },
        };
        this.ngxSpinnerService.show();
        this._http.delete<any>(ApiPaths.deleteRoom, options).subscribe(
          (response) => {
            let indexToDelete = this.roomsList.findIndex((item) => {
              return item.id == id;
            });
            this.roomsList.splice(indexToDelete, 1);
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

  openEditDialog(id, name) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        template: "editRoom",
        values: {
          id: id,
          name: name,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngxSpinnerService.show();
        this._http.put<any>(ApiPaths.editRoom, result).subscribe(
          (response) => {
            let indexToUpdate = this.roomsList.findIndex((item) => {
              return item.id == id;
            });
            this.roomsList[indexToUpdate].name = result.name;
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
}
