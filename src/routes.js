

// Material Dashboard 2 React layouts
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
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
import EmployeeResultSurveyList from "./layouts/survey/result";
import SurveyOverviewForEmployee from "./layouts/survey/statsForEmployee";
import ChangePassword from "./layouts/authentication/update-password";
import Organizations from "./layouts/organization";
import NotFound from "./layouts/notFound";
import DepartmentInfoDialog from "./examples/Modal/DepartmentInfoDialog";
import CompetenciesForEmployeeDialog from "./examples/Modal/CompetenciesForEmployeeDialog";
import OrganizationForEmployee from "./layouts/organizationForEmployee";
import DepartmentInfoDialogForEmployee from "./examples/Modal/DepartmentInfoDialogForEmployee";

const routes = [
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
        role: ["admin", "manager"],
      },
    ],
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
        role: ["employee"],
      },
    ],
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
    key: "not-found",
    route: "/not-found",
    component: <NotFound />,
    redirect: "/profile",
    role: ["admin", "employee", "manager"],
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
    role: ["admin", "manager"],
    redirect: "/profile",
    child: [
      {
        type: "route",
        name: "Competency assessment",
        key: "Competency-assessment",
        route: "/employee/competencies/:id",
        component: <CompetenciesForEmployeeDialog />,
        redirect: "/employee",
        role: ["admin", "manager"],
      },
    ],
  },
  {
    type: "route",
    name: "Распределение оценщиков",
    key: "survey-evaluators",
    route: "/survey/:id/evaluators",
    component: <SurveyEvaluators />,
    role: ["admin"],
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
    role: ["admin"],
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Результаты опросов",
    key: "survey-create",
    route: "/survey-result",
    component: <EmployeeResultSurveyList />,
    role: ["employee"],
    redirect: "/profile",
  },
  {
    type: "route",
    name: "Результаты опроса",
    key: "survey-create",
    route: "/survey-result/:id",
    component: <SurveyOverviewForEmployee />,
    role: ["employee"],
    redirect: "/profile",
  },
  {
    type: "collapse",
    name: "Структура организации",
    key: "organization-for-emploee",
    route: "/organization-for-employee",
    component: <OrganizationForEmployee />,
    role: ["employee"],
    redirect: "/profile",
    child: [
      {
        type: "route",
        name: "Department Info",
        key: "department-info-for-employee",
        route: "/organization-for-employee/department/:id",
        component: <DepartmentInfoDialogForEmployee/>,
        redirect: "/profile",
        role: ["employee"],
      },
    ]
  },
  {
    type: "collapse",
    name: "Структура организации",
    key: "organization",
    route: "/organization",
    component: <Organizations />,
    role: ["admin"],
    redirect: "/survey",
    child: [
      {
        type: "route",
        name: "Department Info",
        key: "department-info",
        route: "/organization/department/:id",
        component: <DepartmentInfoDialog/>,
        redirect: "/profile",
        role: ["admin"],
      },
    ]
  },
  {
    type: "collapse",
    name: "Выход из системы",
    key: "logout",
    route: "/logout",
    component: <Logout />,
    role: ["admin", "employee", "manager"],
    redirect: "/profile",
  },
  {
    type: "route",
    name: "Изменить пароль",
    key: "change-password",
    route: "/change-password",
    component: <ChangePassword />,
    role: ["admin", "employee", "manager"],
    redirect: "/profile",
  },
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
