import { Routes } from "@angular/router";
import { PaymentGroupsComponent } from "app/payment-groups/payment-groups.component";
import { SlabsComponent } from "app/payment-groups/slabs/slabs.component";
import { RoomsComponent } from "app/payment-groups/rooms/rooms.component";
import { CustomersComponent } from "app/customers/customers.component";
import { CustomerPageComponent } from "app/customers/customer-page/customer-page.component";
import { AddCustomerComponent } from "app/customers/add-customer/add-customer.component";
import { OrdersComponent } from "app/orders/orders.component";
import { CreateOrdersComponent } from "app/orders/create-orders/create-orders.component";
import { TodaysOrdersComponent } from "app/orders/todays-orders/todays-orders.component";
import { TodaysPaymentsComponent } from "app/orders/todays-payments/todays-payments.component";
import { TodaysExpensesComponent } from "app/orders/todays-expenses/todays-expenses.component";
import { TodaysSummaryComponent } from "app/orders/todays-summary/todays-summary.component";
import { ExpensesComponent } from "app/payment-groups/expenses/expenses.component";
import { ReportsComponent } from "app/reports/reports.component";

export const AdminLayoutRoutes: Routes = [
  { path: "reports", component: ReportsComponent },
  {
    path: "payments",
    component: PaymentGroupsComponent,
    children: [
      { path: "", redirectTo: "slabs" },
      { path: "slabs", component: SlabsComponent },
      { path: "rooms", component: RoomsComponent },
      { path: "expenses", component: ExpensesComponent },
    ],
  },
  {
    path: "customers",
    component: CustomersComponent,
    children: [
      { path: "", component: CustomerPageComponent },
      { path: "add-customer", component: AddCustomerComponent },
    ],
  },
  {
    path: "orders",
    component: OrdersComponent,
    children: [
      { path: "", redirectTo: "create" },
      { path: "create", component: CreateOrdersComponent },
      { path: "todays-orders", component: TodaysOrdersComponent },
      { path: "todays-payments", component: TodaysPaymentsComponent },
      { path: "todays-expenses", component: TodaysExpensesComponent },
      { path: "todays-summary", component: TodaysSummaryComponent },
    ],
  },
];
