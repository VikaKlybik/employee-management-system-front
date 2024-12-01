import { useEffect, useState } from "react";
import SurveyTableForEmployeeData from "./data/surveyTableForEmployeeData";
import SurveyService from "../../../../../../services/SurveyService";
import DataTable from "../../../../../../examples/Tables/DataTable";


function SurveyTableForEmployee({ assessments, surveyId }) {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [uniqueCompetencies, setUniqueCompetencies] = useState([]);
  const surveyService = new SurveyService();

  useEffect(() => {
    if (assessments) {
      const myTableData = SurveyTableForEmployeeData(assessments, uniqueCompetencies);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [assessments]);

  useEffect(() => {
    async function fetchUniqueCompetencyForSurvey() {
      try {
        const response = await surveyService.getUniqueCompetencyForSurveyById(surveyId);
        console.log(response);
        setUniqueCompetencies(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    if(surveyId) {
      fetchUniqueCompetencyForSurvey();
    }
  }, [surveyId]);

  return (
    <DataTable
      table={tableData}
      showTotalEntries={false}
      isSorted={false}
      noEndBorder
      entriesPerPage={false}
    />
  );
}

export default SurveyTableForEmployee;