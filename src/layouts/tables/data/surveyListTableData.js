// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Images
import DropdownMenu from "../../../components/DropDownMenu";
import MDBadge from "../../../components/MDBadge";
import TableUtils from "./utlis";

export default function SurveyListTableData(surveys, handleMenuItemClick) {
  // eslint-disable-next-line react/prop-types
  const SurveyName = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  // eslint-disable-next-line react/prop-types

  if (!surveys || surveys.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU"); // en-GB sets the format to DD/MM/YYYY
  };

  const defaultMenuItems = [
    { label: "Сделать дубликат", action: "duplicate" },
  ];
  const draftMenuItems = [
    ...defaultMenuItems,
    { label: "Распределить оценщиков", action: "set-evaluators" },
  ];
  const startedMenuItems = [
    ...defaultMenuItems,
    { label: "Статистика", action: "view-stats" },
    { label: "Завершить", action: "close" },
  ];
  const closedMenuItems = [
    ...defaultMenuItems,
    { label: "Статистика", action: "view-stats" },
  ];

  /*
  1) Для статуса DRAFT
    - Распределить оценщиков -- переводит в статус in process
    - Сделать дупликат
  2) Для статуса STARTED
    - Просмотреть статистику прохождения -- страница с общими данными, кто прошёл кто не прошёл в будущем сделать возможность отправки на почту напоминалки  о необходимости прохождения
    - сделать дупликат
    - Завершить
  3) Для Статуса CLOSE
    - Просмотреть результаты --открывается страница (Общие данные -->
                                                          Выпаддающщий спискок с выбором сотрудника
                                                              --> Данные Для конкретноого пользователя(Кнопка выгрузить данные)
      с выпадающем списком, где выбираешь сотрудника
    - Сделать дупликат
   */

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "45%", align: "left" },
      { Header: "Метод", accessor: "evaluationMethod", align: "left" },
      { Header: "Статус", accessor: "status", align: "center" },
      { Header: "Дата создания", accessor: "createdAt", align: "center" },
      { Header: "Дейстивия", accessor: "action", align: "center" },
    ],

    rows: surveys?.map(({ id, name, description, evaluationMethod, status, createdAt }, index) => {
      const surveyMenuItems = status === "DRAFT" ? draftMenuItems
          : status === "PUBLISHED" ? startedMenuItems
          : closedMenuItems;
      return {
        name: (
          <SurveyName
            key={`survey-${index}`} // Added key prop
            name={name}
          />
        ),
        evaluationMethod: (
          <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
            {new TableUtils().getMethodName(evaluationMethod)?.name}
          </MDTypography>
        ),
        status: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={new TableUtils().identifyStatus(status).name}
                     color={new TableUtils().identifyStatus(status).color} variant="gradient" size="sm" />
          </MDBox>
        ),
        createdAt: (
          <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
            {formatDate(createdAt)}
          </MDTypography>
        ),

        action: (
          <DropdownMenu
            menuItems={
              // eslint-disable-next-line no-undef
              surveyMenuItems.map((item) => {
                return { ...item, survey_id: id };
              })
            }
            onMenuItemClick={handleMenuItemClick}
          />
        ),
      };
    }), // Ensure we return an empty array if content is undefined
  };
}
