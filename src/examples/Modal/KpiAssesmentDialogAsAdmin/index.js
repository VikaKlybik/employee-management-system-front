// EmployeeSelectionDialog.js
import React, { useEffect, useState } from "react";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import KPIService from "../../../services/KPIService";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Progress from "../../../components/Progress";
import DataTable from "../../Tables/DataTable";
import kpiAssementTableData from "../../../layouts/tables/data/kpiAssementTableData";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import { useForm } from "react-hook-form";

export default function KpiAssessmentModalAsAdmin({ isModalOpen }) {
  const { kpiId } = useParams();
  const navigate = useNavigate();
  const kpiService = new KPIService();
  const [kpiData, setKpiData] = useState(null);
  const [tableData, setTableData] = useState({ columns: [], rows: [] });

  const closeModal = () => {
    navigate(-1); // Go back to the previous route
  };
  useEffect(() => {
    async function fetchKPIById() {
      try {
        const response = await kpiService.getKPIById(kpiId);
        console.log(response.data);
        setKpiData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchKPIById();
  }, [kpiId]);

  useEffect(() => {
    if (kpiData) {
      const myTableData = kpiAssementTableData(kpiData);
      console.log("Generated table data:", myTableData); // Debug log
      setTableData(myTableData);
    }
  }, [kpiData]);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} sx={{
      "& .MuiDialog-paper": {
        width: "70%",
        maxWidth: "none",
        height: "100%",
      },
    }}>
      <DialogTitle>KPI История оценок</DialogTitle>
      <DialogContent>
        {kpiData && (
          <Card sx={{ maxWidth: "95%", margin: "10px auto" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {kpiData.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {kpiData.description}
              </Typography>
              <Progress measureUnit={kpiData.measureUnit}
                        actualValue={kpiData.kpiAssessments}
                        targetValue={kpiData.targetValue} />
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Оценки
              </Typography>
              {kpiData?.kpiAssessments && kpiData.kpiAssessments.length !==0 ? (
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />) : (
                <MDBox align={"center"}>
                  <Typography variant="body2" color="text.secondary">
                    Не найдено :(
                  </Typography>
                </MDBox>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>

        <Button color="primary" onClick={closeModal}>
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}