// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import MDBox from "../../../components/MDBox";
import DataTable from "../../../examples/Tables/DataTable";
import DevelopmentPlanForEmployeeData from "./data/DevelopmentPlanData";
import DevelopmentPlanService from "../../../services/DevelopmentPlanService";
import MDTypography from "../../../components/MDTypography";


export default function ViewDevelopmentPlanForEmployeeModal({ isModalOpen, onClose, surveyId, employeeId }) {
  const developmentPlanService = new DevelopmentPlanService();
  const [rows, setRows] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });


  useEffect(() => {
    async function fetchDevelopmentPlanService() {
      const response = await developmentPlanService.getDevelopmentPlansForEmployee({
        surveyId: surveyId,
        userId: employeeId,
      });
      setRows(response.data);
    }

    if (surveyId && employeeId) {
      fetchDevelopmentPlanService();
    }
  }, [surveyId, employeeId]);

  const closeModal = () => {
    onClose();
  };

  useEffect(() => {
    if (rows) {
      const myTableData = DevelopmentPlanForEmployeeData(rows);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [rows]);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "90%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>План развития</DialogTitle>
      <DialogContent>
        <MDBox>
          <MDBox
            mx={2}
            py={3}
            px={2}
          >
            <Container>
              <h1>Таблица с планом развития</h1>
              {rows && rows.length !== 0 && (
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              )}
              {!rows || rows.length === 0 && (
                <MDBox
                  mt={5}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <MDTypography variant="h6" color="textSecondary">
                    Не найдено
                  </MDTypography>
                </MDBox>
                )}
            </Container>
          </MDBox>
        </MDBox>
      </DialogContent>
      <DialogActions>

        <Button color="primary" onClick={closeModal}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}