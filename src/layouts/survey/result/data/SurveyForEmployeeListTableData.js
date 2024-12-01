// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TableUtils from "../../../tables/data/utlis";

export default function SurveyForEmployeeListTableData(surveys) {
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

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "45%", align: "left" },
      { Header: "Метод", accessor: "evaluationMethod", align: "left" },
      { Header: "Дата создания", accessor: "createdAt", align: "center" },
      { Header: "", accessor: "view", align: "center" },
    ],

    rows: surveys?.map(({ id, name, description, evaluationMethod, status, createdAt }, index) => {
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
        createdAt: (
          <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
            {formatDate(createdAt)}
          </MDTypography>
        ),

        view: (
          <MDTypography component="a" href={`/survey-result/${id}`} variant="overline" color="info" fontWeight="medium">
            Смотреть
          </MDTypography>
        ),
      };
    }), // Ensure we return an empty array if content is undefined
  };
}
