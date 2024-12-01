// Material Dashboard 2 React components
import MDBox from "../../../../../../../components/MDBox";
import MDTypography from "../../../../../../../components/MDTypography";
import MDAvatar from "../../../../../../../components/MDAvatar";

export default function SurveyTableForEmployeeData(assessments, competencies) {
  // eslint-disable-next-line react/prop-types
  const CompetencyName = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const MarkValue = ({value}) => (
    <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
      {value}
    </MDTypography>
  );

  if (!assessments || assessments.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  const getValueIfExist = (mark, competencyId) => {
      if(mark && mark.length === 0){
        return '-';
      }
      const result = mark.filter(({competency}) => competency.id === competencyId);
      if(result && result.length === 0){
        return '-';
      } else {
        return result[0].assessmentSummary;
      }
  }


  return {
    columns: [
      { Header: "Компетенция", accessor: "competency", width: "45%", align: "left" },
      { Header: "Коллеги", accessor: "colleague", align: "center" },
      { Header: "Руководитель", accessor: "lead", align: "center" },
      { Header: "Подчинённые", accessor: "subordinate", align: "center" },
      { Header: "Самооценка", accessor: "self", align: "center" },
    ],

    rows: competencies?.map(({ id, name }, index) => {
      return {
        competency: (
          <CompetencyName
            name={name}
          />
        ),
        colleague: <MarkValue value={getValueIfExist(assessments?.assessmentsColleague, id)}/>,
        lead: <MarkValue value={getValueIfExist(assessments?.assessmentsLead, id)}/>,
        subordinate: <MarkValue value={getValueIfExist(assessments?.assessmentsSubordinate, id)}/>,
        self: <MarkValue value={getValueIfExist(assessments?.assessmentsSelf, id)}/>,
      };
    }),
  };
}
