import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-edit-dialog",
  templateUrl: "./edit-dialog.component.html",
  styleUrls: ["./edit-dialog.component.css"],
})
export class EditDialogComponent implements OnInit {
  editRoomForm: FormGroup;
  editSlabForm: FormGroup;
  editExpensesTypeForm: FormGroup;
  editExpensesForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.editRoomForm = new FormGroup({
      roomId: new FormControl(this.data.values.id, [Validators.required]),
      name: new FormControl(this.data.values.name, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
    this.editSlabForm = new FormGroup({
      slabId: new FormControl(this.data.values.id, [Validators.required]),
      name: new FormControl(this.data.values.name, [
        Validators.required,
        Validators.minLength(5),
      ]),
      amount: new FormControl(this.data.values.amount, [Validators.required]),
    });
    this.editExpensesTypeForm = new FormGroup({
      expenseTypeId: new FormControl(this.data.values.id, [
        Validators.required,
      ]),
      name: new FormControl(this.data.values.name, [
        Validators.required,
        Validators.minLength(5),
      ]),
    });
    console.log(this.data.values)
    this.editExpensesForm = new FormGroup({
      expenseId: new FormControl(this.data.values.id, [
        Validators.required,
      ]),
      reason: new FormControl(this.data.values.reason, [
        Validators.required,
        Validators.minLength(5),
      ]),
      amount: new FormControl(this.data.values.amount, [
        Validators.required,
      ]),
    });
  }

  sendDataToSubscriberRoom(): void {
    this.dialogRef.close(this.editRoomForm.value);
  }

  sendDataToSubscriberSlab(): void {
    this.dialogRef.close(this.editSlabForm.value);
  }

  sendDataToSubscriberExpensesType(): void {
    this.dialogRef.close(this.editExpensesTypeForm.value);
  }

  sendDataToSubscriberExpenses(): void {
    this.dialogRef.close(this.editExpensesForm.value);
  }
}
