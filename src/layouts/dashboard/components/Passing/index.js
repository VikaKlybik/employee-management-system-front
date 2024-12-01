import { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Passing/data";
import SurveyService from "../../../../services/SurveyService";

function PassingList({ passing }) {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const surveyService = new SurveyService();
  useEffect(() => {
    if (passing) {
      const myTableData = data(passing, handleSendRemind);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [passing]);

  const handleSendRemind = async (id) => {
    try {
      await surveyService.sendRemindMessage(id);

    } catch (error) {

    }
  };

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Листы прохождения сотрудников
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox height={"760px"}>
        <DataTable
          table={tableData}
          showTotalEntries={false}
          isSorted={false}
          noEndBorder
          entriesPerPage={false}
        />
      </MDBox>
    </Card>
  );
}

export default PassingList;
