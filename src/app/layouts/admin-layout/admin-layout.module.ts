import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";

import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";

import { OrdersComponent } from "app/orders/orders.component";
import { CreateOrdersComponent } from "app/orders/create-orders/create-orders.component";
import { TodaysOrdersComponent } from "app/orders/todays-orders/todays-orders.component";
import { TodaysPaymentsComponent } from "app/orders/todays-payments/todays-payments.component";
import { TodaysExpensesComponent } from "app/orders/todays-expenses/todays-expenses.component";
import { TodaysSummaryComponent } from "app/orders/todays-summary/todays-summary.component";
import { CustomersComponent } from "app/customers/customers.component";
import { CustomerPageComponent } from "app/customers/customer-page/customer-page.component";
import { AddCustomerComponent } from "app/customers/add-customer/add-customer.component";
import { PaymentGroupsComponent } from "app/payment-groups/payment-groups.component";
import { SlabsComponent } from "app/payment-groups/slabs/slabs.component";
import { RoomsComponent } from "app/payment-groups/rooms/rooms.component";
import { ReportsComponent } from "app/reports/reports.component";
import { ExpensesComponent } from "app/payment-groups/expenses/expenses.component";
import { PrintComponent } from "../../reports/print/print.component";
import { NgxPrintModule } from "ngx-print";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatDialogModule,
    NgxPrintModule,
  ],
  declarations: [
    OrdersComponent,
    CreateOrdersComponent,
    TodaysOrdersComponent,
    TodaysPaymentsComponent,
    TodaysExpensesComponent,
    TodaysSummaryComponent,
    CustomersComponent,
    CustomerPageComponent,
    AddCustomerComponent,
    PaymentGroupsComponent,
    SlabsComponent,
    RoomsComponent,
    ReportsComponent,
    ExpensesComponent,
    PrintComponent,
  ],
})
export class AdminLayoutModule {}
