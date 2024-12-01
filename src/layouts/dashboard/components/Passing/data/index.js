// @mui material components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "../../../../../components/MDBadge";

export default function data(passing) {

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

  return {
    columns: [
      { Header: "Оценивает", accessor: "evaluator", width: "45%", align: "left" },
      { Header: "Будет оценён", accessor: "evaluated", width: "10%", align: "left" },
      { Header: "Прохождение", accessor: "isPass", align: "center" },
      { Header: "Связь", accessor: "evaluatorType", align: "center" },
    ],

    rows: passing?.map(({ evaluatedPerson, isPass, evaluator, evaluatorType }, index) => {
      return {
        evaluator:
          <Author
            key={`author-${index}`}
            image={evaluator?.user?.profilePhotoUrl}
            name={`${evaluator?.user?.lastName} ${evaluator?.user?.firstName}`}
            email={`${evaluator?.department?.name}, ${evaluator?.jobTitle?.name}`}
          />,
        evaluated: (
          <Author
            key={`author-${index}`}
            image={evaluatedPerson?.user?.profilePhotoUrl}
            name={`${evaluatedPerson?.user?.lastName} ${evaluatedPerson?.user?.firstName}`}
            email={`${evaluator?.department?.name}, ${evaluator?.jobTitle?.name}`}
          />
        ),
        isPass: (
          <MDBox ml={-1}>
            <MDBadge badgeContent={isPass ? "Пройден" : "Не пройден"} color={isPass ? "success" : "light"}
                     variant="gradient" size="sm" />
          </MDBox>
        ),
        evaluatorType: (
          <MDBox ml={-1}>
            {evaluatorType === "SELF"? "Самооценка":
              evaluatorType === "LEAD"? "Руководитель":
              evaluatorType === "COLLEAGUE"? "Коллега":
              "Подчинённый"}
          </MDBox>
        ),
      };
    }),

  };
}
