import { environment } from "./environment";

export const ApiPaths = {
  // ORDERS API START
  placeOrder: `${environment.baseUrl}transactions/createTransaction`,
  obtainTodaysOrders: `${environment.baseUrl}orders/getTodaysOrder`,
  deleteTodaysOrder: `${environment.baseUrl}orders/deleteTodaysOrder`,
  getCustomerList: `${environment.baseUrl}orders/getCustomerList`,
  obtainTodaysPayments: `${environment.baseUrl}payments/getTodaysPayment`,
  deleteTodaysPayments: `${environment.baseUrl}payments/deleteTodaysPayment`,
  // ORDERS API END

  // CUSTOMERS API END
  customers: `${environment.baseUrl}customers`,
  customersDropDownData: `${environment.baseUrl}customers/dropDownData`,
  // CUSTOMERS API END

  // ROOMS API START
  createRoom: `${environment.baseUrl}rooms`,
  getRoomsList: `${environment.baseUrl}rooms`,
  deleteRoom: `${environment.baseUrl}rooms`,
  editRoom: `${environment.baseUrl}rooms`,
  // ROOMS API END

  // PRICE PER SLAB API START
  createSlab: `${environment.baseUrl}slabs`,
  getSlabsList: `${environment.baseUrl}slabs`,
  deleteSlab: `${environment.baseUrl}slabs`,
  editSlab: `${environment.baseUrl}slabs`,
  // PRICE PER SLAB API END

  // ExpenseType API START
  createExpenseType: `${environment.baseUrl}expenseTypes`,
  getExpenseTypeList: `${environment.baseUrl}expenseTypes`,
  deleteExpenseType: `${environment.baseUrl}expenseTypes`,
  editExpenseType: `${environment.baseUrl}expenseTypes`,
  // ExpenseType API END

  // Expense API START
  createExpense: `${environment.baseUrl}expense`,
  getExpenseList: `${environment.baseUrl}expense`,
  deleteExpense: `${environment.baseUrl}expense`,
  editExpense: `${environment.baseUrl}expense`,
  // Expense API END

  // Auth API START
  AuthLogin: `${environment.baseUrl}auth/login`,
  AuthRegister: `${environment.baseUrl}auth/register`,
  getRefreshToken: `${environment.baseUrl}auth/refresh`,

  // Auth API END

  // Reports API START
  getCustomerReports: `${environment.baseUrl}reports/getCustomerReport`,
  getTodaysSummary: `${environment.baseUrl}reports/getTodaysSummary`,
  // Reports API END
};
