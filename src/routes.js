/**
 =========================================================
 * Material Dashboard 2 React - v2.2.0
 =========================================================

 * Product Page: https://www.creative-tim.com/product/material-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

/**
 All of the routes for the Material Dashboard 2 React are added here,
 You can add a new route, customize the routes and delete the routes here.

 Once you add a new route on this file it will be visible automatically on
 the Sidenav.

 For adding a new route you can follow the existing routes in the routes array.
 1. The `type` key with the `collapse` value is used for a route.
 2. The `type` key with the `title` value is used for a title inside the Sidenav.
 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
 4. The `name` key is used for the name of the route on the Sidenav.
 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
 7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
 inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
 8. The `route` key is used to store the route location which is used for the react router.
 9. The `href` key is used to store the external links location.
 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
 10. The `component` key is used to store the component of its route.
 */

// Material Dashboard 2 React layouts
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import Employee from "./layouts/employee";
import EmployeeKpi from "./layouts/employeeKpi";
import Logout from "./layouts/logout";
import SurveyList from "./layouts/survey/list";
import SurveyPage from "./layouts/survey/pass";
import SurveyCreate from "./layouts/survey/create";
import SurveyEvaluators from "./layouts/survey/evaluators";
import KpiAssessmentModal from "./examples/Modal/KpiAssesmentDialog";
import SurveyStats from "./layouts/survey/stats";
import EmployeeKPITables from "./layouts/employeeKpiAsAdmin";
import KpiAssessmentModalAsAdmin from "./examples/Modal/KpiAssesmentDialogAsAdmin";
import CreateDevelopmentPlanForEmployeeModal
  from "./layouts/developmentPlan/createForEmployee/CreateDevelopmentPlanForEmployeeModal";

const routes = [
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "route",
    name: "KPI",
    key: "employees-kpi",
    route: "/kpi/for-employee/:id",
    component: <EmployeeKPITables />,
    role: ["admin", "manager"],
    child: [
      {
        type: "route",
        name: "KPI assessment",
        key: "kpi-assessment",
        route: "/kpi/for-employee/:id/assessment/:kpiId",
        component: <KpiAssessmentModalAsAdmin />,
        redirect: "/employee",
        role: ["admin", "manager"]
      },
    ]
  },
  {
    type: "collapse",
    name: "Мои KPI",
    key: "my-kpi",
    route: "/my-kpi",
    component: <EmployeeKpi />,
    role: ["employee"],
    child: [
      {
        type: "route",
        name: "KPI assessment",
        key: "kpi-assessment",
        route: "/my-kpi/assessment/:id",
        component: <KpiAssessmentModal />,
        redirect: "/profile",
        role: ["employee"]
      },
    ]
  },
  {
    type: "collapse",
    name: "Профиль",
    key: "profile",
    route: "/profile",
    component: <Profile />,
    role: ["employee"],
  },
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/login",
    component: <SignIn />,
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Наши сотрудники",
    key: "employees",
    route: "/employee",
    component: <Employee />,
    role: ["admin"],
    redirect: "/profile",
  },
  {
    type: "route",
    name: "Распределение оценщиков",
    key: "survey-evaluators",
    route: "/survey/:id/evaluators",
    component: <SurveyEvaluators />,
    role: ["admin", "manager"],
    redirect: "/survey",
  },
  {
    type: "route",
    name: "Статистика опроса",
    key: "survey-stats",
    route: "/survey/:id/stats",
    component: <SurveyStats />,
    role: ["admin", "manager"],
    redirect: "/survey",
  },
  {
    type: "collapse",
    name: "Опросы",
    key: "surveys",
    route: "/survey",
    component: <SurveyList />,
    role: ["admin", "manager"],
    redirect: "/survey",
  },
  {
    type: "route",
    name: "Прохождение опроса",
    key: "survey-detail",
    route: "/survey/:id",
    component: <SurveyPage />,
    role: ["admin", "employee", "manager"],
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Создание опроса",
    key: "survey-create",
    route: "/survey-create",
    component: <SurveyCreate />,
    role: ["admin", "manager"],
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Результаты опросов",
    key: "survey-create",
    route: "/survey-result",
    component: <SurveyCreate />,
    role: ["employee"],
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Выход из системы",
    key: "logout",
    route: "/logout",
    component: <Logout />,
    role: ["admin", "employee", "manager"],
    redirect: "/profile",
  }
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

export default routes;
