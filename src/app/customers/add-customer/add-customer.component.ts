import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { NotificationsService } from "app/services/notifications.service";
import { ApiPaths } from "environments/api-paths";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomersService } from "../customers.service";

@Component({
  selector: "app-add-customer",
  templateUrl: "./add-customer.component.html",
  styleUrls: ["./add-customer.component.css"],
})
export class AddCustomerComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    public customersService: CustomersService,
    private notificationsService: NotificationsService,
    private ngxSpinnerService: NgxSpinnerService
  ) {}

  addCustomerForm!: FormGroup;
  pricePerSlab = [];
  customerStatus = [];

  ngOnInit(): void {
    this.resetForm();
    this.ngxSpinnerService.show();
    this.httpClient.get<any>(ApiPaths.customersDropDownData).subscribe(
      (res) => {
        this.pricePerSlab = res.body.pricePerSlabs;
        this.customerStatus = res.body.statuses;
        if (this.customersService.mode === this.customersService.edit) {
          this.initialiseForm(this.customersService.customer);
        }
        this.ngxSpinnerService.hide();
        console.log(`[AddCustomerComponent](ngOnInit) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[AddCustomerComponent](ngOnInit) Error`, error);
      }
    );
  }

  onAddPhoneNumber() {
    const controlGroup = new FormGroup({
      label: new FormControl(null),
      number: new FormControl(null),
    });

    (<FormArray>this.addCustomerForm.get("phone")).push(controlGroup);
  }

  onRemovePhoneNumber(index: number) {
    (<FormArray>this.addCustomerForm.get("phone")).removeAt(index);
  }
  ShowRemoveButton(index: number) {
    if ((<FormArray>this.addCustomerForm.get("phone")).length - 1 !== index)
      return true;
    return false;
  }

  initialiseForm(customer) {
    let customerPhones = customer.customer_phones.map((phone) => {
      return new FormGroup({
        label: new FormControl(phone.label),
        number: new FormControl(phone.number),
      });
    });

    this.addCustomerForm = new FormGroup({
      name: new FormControl(customer.name, [
        Validators.required,
        Validators.minLength(5),
      ]),
      company: new FormControl(customer.company_name, [
        Validators.minLength(5),
      ]),
      nic: new FormControl(customer.nic_number, [
        Validators.pattern("[0-9]{5}-[0-9]{7}-[0-9]{1}"),
      ]),
      address: new FormControl(customer.address, [Validators.minLength(5)]),
      bankAccountNumber: new FormControl(customer.bank_account_number, [
        Validators.minLength(10),
        Validators.min(999999999),
      ]),
      pricePerSlab: new FormControl(customer.pricePerSlabId, [
        Validators.required,
      ]),
      customerStatus: new FormControl(customer.statusId, [Validators.required]),
      phone: new FormArray([
        ...customerPhones,
        new FormGroup({
          label: new FormControl(null),
          number: new FormControl(null),
        }),
      ]),
    });
  }

  resetForm() {
    this.addCustomerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      company: new FormControl(null, [Validators.minLength(5)]),
      nic: new FormControl(null, [
        Validators.pattern("[0-9]{5}-[0-9]{7}-[0-9]{1}"),
      ]),
      address: new FormControl(null, [Validators.minLength(5)]),
      bankAccountNumber: new FormControl(null, [
        Validators.minLength(10),
        Validators.min(999999999),
      ]),
      pricePerSlab: new FormControl(null, [Validators.required]),
      customerStatus: new FormControl(null, [Validators.required]),
      phone: new FormArray([
        new FormGroup({
          label: new FormControl(null),
          number: new FormControl(null),
        }),
      ]),
    });
    this.addCustomerForm.reset();
  }
  onCancel() {
    this.resetForm();
    this.customersService.onNavigateBack();
  }
  onSubmit() {
    console.log(`this.addCustomerForm`, this.addCustomerForm);
    let customer = {
      name: this.addCustomerForm.value.name,
      nic_number: this.addCustomerForm.value.nic,
      address: this.addCustomerForm.value.address,
      company_name: this.addCustomerForm.value.company,
      bank_account_number: this.addCustomerForm.value.bankAccountNumber,
      price_per_slab_id: +this.addCustomerForm.value.pricePerSlab,
      statusId: this.addCustomerForm.value.customerStatus,
      phones: this.addCustomerForm.value.phone.filter(
        (item) =>
          item.label !== null &&
          item.number !== null &&
          item.label !== "" &&
          item.number !== ""
      ),
    };
    customer = this.checkCustomerObject(customer);
    if (this.customersService.mode === this.customersService.edit) {
      this.updateCustomer(customer, this.customersService.customer["id"]);
    } else {
      this.createCustomer(customer);
    }
  }

  checkCustomerObject(customer) {
    let temp = customer;
    if (temp.phones.length === 0) {
      delete customer.phones;
    }
    if (temp.nic_number === "" || temp.nic_number === null) {
      delete customer.nic_number;
    }
    if (temp.address === "" || temp.address === null) {
      delete customer.address;
    }
    if (temp.bank_account_number === "" || temp.bank_account_number === null) {
      delete customer.bank_account_number;
    }
    if (temp.company_name === "" || temp.company_name === null) {
      delete customer.company_name;
    }
    return temp;
  }

  updateCustomer(customer, customerId) {
    this.ngxSpinnerService.show();
    this.httpClient
      .put<any>(ApiPaths.customers, { customerId: customerId, ...customer })
      .subscribe(
        (res) => {
          this.resetForm();
          this.customersService.onNavigateBack();
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            res.message,
            2
          );
          console.log(`[AddCustomerComponent](updateCustomer) Response`, res);
        },
        (error) => {
          this.ngxSpinnerService.hide();
          this.notificationsService.showNotification(
            "bottom",
            "center",
            error.message,
            4
          );
          console.log(`[AddCustomerComponent](updateCustomer) Error`, error);
        }
      );
  }

  createCustomer(customer) {
    this.ngxSpinnerService.show();
    this.httpClient.post<any>(ApiPaths.customers, customer).subscribe(
      (res) => {
        this.resetForm();
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          res.message,
          2
        );
        console.log(`[AddCustomerComponent](createCustomer) Response`, res);
      },
      (error) => {
        this.ngxSpinnerService.hide();
        this.notificationsService.showNotification(
          "bottom",
          "center",
          error.message,
          4
        );
        console.log(`[AddCustomerComponent](createCustomer) Error`, error);
      }
    );
  }

  compareFunction(fieldValues: any, currentValue: any) {
    if (currentValue) {
      return fieldValues == currentValue;
    }
    return false;
  }
}
