import React, { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import { FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MDAvatar from "../../../../components/MDAvatar";
import { statisticType } from "../../../survey/stats/data/statisticType";
import SurveyTableForEmployee from "./components/SurveyTableForEmployee";
import SurveyService from "../../../../services/SurveyService";
import SurveyChartForEmployee from "./components/SurveyChartForEmployee";
import MDButton from "../../../../components/MDButton";

function SurveyStatsForEmployee({ passing, surveyId, handleDevelopmentPlanDialogOpen, selectedUserId, setSelectedUserId }) {
  const [type, setType] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const surveyService = new SurveyService();
  const [evaluatedUsers, setEvaluatedUsers] = useState([]);

  useEffect(() => {
    if (passing && passing.length !== 0) {
      setEvaluatedUsers([
        ...new Map(
          passing
            .filter(({ isPass }) => isPass)
            .map(({ evaluatedPerson }) => [evaluatedPerson.id, evaluatedPerson]),
        ).values(),
      ]);
    }
  }, [passing]);


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

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const response = await surveyService.getAssessments({
          userId: selectedUserId,
          surveyId: surveyId,
          statisticType: "TABLE",
        });
        setAssessments(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (selectedUserId && type) {
      fetchAssessments();
    }
  }, [selectedUserId, type]);

  const handleDownloadSurvey = async () => {
    try {
      const response = await surveyService.getReportForUser(surveyId, selectedUserId, )
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(response.data);
      link.href = url;
      link.download = 'reportSurvey.xlsx';  // Укажите имя файла и его расширение
      link.click();

      // Освобождаем ресурсы
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card>
      <MDBox alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Статистика для конкретного сотрудника
          </MDTypography>
        </MDBox>
        <MDTypography variant="button" fontWeight="regular" color="text">
          Выберите сотрудника и получите результ опроса
        </MDTypography>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <FormControl fullWidth={false}
                       margin="normal"
                       style={{ width: "30%" }}>
            <InputLabel id="employee">Сотрудник</InputLabel>
            <Select
              labelId="employee"
              fullWidth
              displayEmpty
              margin="normal"
              style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px", height: "60px" }}
              value={selectedUserId}
              label="Сотрудник"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {evaluatedUsers?.map(({ user }, index) => (
                <MenuItem key={user.id} value={user.id}>
                  {/*{`${user?.lastName} ${user?.firstName}`}*/}
                  <Author
                    key={`author-${index}`}
                    image={user?.profilePhotoUrl}
                    name={`${user?.lastName} ${user?.firstName}`}
                    email={`${user?.email}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth={false}
                       margin="normal"
                       style={{
                         width: "35%",
                       }}>
            <InputLabel id="chart">Выберите тип графика</InputLabel>
            <Select
              labelId="chart"
              fullWidth
              displayEmpty
              margin="normal"
              style={{ paddingTop: "11px", paddingBottom: "11px", marginTop: "2px", height: "60px" }}
              value={type}
              label="Выберите тип графика"
              onChange={(e) => setType(e.target.value)}
            >
              {statisticType.map(({ label, name }) => (
                <MenuItem value={name}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <MDBox style={{ width: "15%" }}>
            <MDButton
              color="primary"
              variant="contained"
              style={{
                paddingTop: "11px",
                paddingBottom: "11px",
                marginTop: "2px",
                height: "60px",
              }}
              onClick={() => handleDevelopmentPlanDialogOpen()}
              disabled={!!!selectedUserId}>
              План развития
            </MDButton>
          </MDBox>
          <MDBox style={{ width: "15%" }}>
            <MDButton
              color="success"
              variant="contained"
              style={{
                paddingTop: "11px",
                paddingBottom: "11px",
                marginTop: "2px",
                height: "60px",
              }}
              onClick={() => handleDownloadSurvey()}
              disabled={!!!selectedUserId}>
             Выгрузить отчёт
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox>
        {selectedUserId && (
          <>
            {type && (
              <>
                {type === "charts" && (
                  <>
                    <SurveyChartForEmployee
                      surveyId={surveyId}
                      assessments={assessments}
                    />
                  </>
                )}
                {type === "full-review" && assessments && (
                  <SurveyTableForEmployee
                    surveyId={surveyId}
                    assessments={assessments}
                  />
                )}
              </>
            )}
          </>
        )}
      </MDBox>
    </Card>
  );
}

export default SurveyStatsForEmployee;
