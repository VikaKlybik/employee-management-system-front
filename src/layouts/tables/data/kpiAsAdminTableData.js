// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";

// Images
import team2 from "assets/images/team-2.jpg";

export default function EmployeeTableData( employees ) {
  // eslint-disable-next-line react/prop-types
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  // eslint-disable-next-line react/prop-types
  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  if (!employees || employees.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU"); // en-GB sets the format to DD/MM/YYYY
  };

  return {
    columns: [
      { Header: "Сотрудник", accessor: "fullName", width: "45%", align: "left" },
      { Header: "Отдел/Должность", accessor: "function", align: "left" },
      { Header: "Работает с", accessor: "employed", align: "center" },
      { Header: "Действие", accessor: "action", align: "center" },
      { Header: "KPI", accessor: "kpi", align: "center"}
    ],

    rows: employees.content?.map(({ user, jobTitle, department, workSince }, index) => {
      return {
        fullName: (
          <Author
            key={`author-${index}`} // Added key prop
            image={team2}
            name={`${user?.lastName} ${user?.firstName}`}
            email={`${user?.email}`}
          />
        ),
        function: <Job title={department?.name} description={jobTitle?.name} />,
        employed: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {formatDate(workSince)}
          </MDTypography>
        ),
        action: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            Редактировать
          </MDTypography>
        ),
        kpi : (
          <MDTypography component="a" href={`/kpi/${user?.id}`} variant="overline" color="info" fontWeight="medium">
            Смотреть
          </MDTypography>
        )
      };
    }) // Ensure we return an empty array if content is undefined
  };
}
