import { useEffect, useRef, useState } from "react";
import SurveyService from "../../../../../../services/SurveyService";
import MDBox from "../../../../../../components/MDBox";
import { Radar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function SurveyChartForEmployee({ assessments, surveyId }) {
  const [uniqueCompetencies, setUniqueCompetencies] = useState([]);
  const surveyService = new SurveyService();
  const canvasRef = useRef(null);
  const [dataRadar, setDataRadar] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (assessments && uniqueCompetencies.length > 0) {
      setDataRadar({
        labels: uniqueCompetencies.map(({ name }) => name),
        datasets: [
          {
            label: "Оценка сотрудников",
            data: uniqueCompetencies.map(({ id }) => {
              let count = 0;
              let value = 0;

              const leadValue = assessments.assessmentsLead?.filter(({ competency }) => competency.id === id);
              const subordinateValue = assessments.assessmentsSubordinate?.filter(({ competency }) => competency.id === id);
              const colleagueValue = assessments.assessmentsColleague?.filter(({ competency }) => competency.id === id);

              if (leadValue?.length) {
                count += 1;
                value += leadValue[0].assessmentSummary;
              }
              if (subordinateValue?.length) {
                count += 1;
                value += subordinateValue[0].assessmentSummary;
              }
              if (colleagueValue?.length) {
                count += 1;
                value += colleagueValue[0].assessmentSummary;
              }
              return count > 0 ? parseFloat((value / count).toFixed(2)) : 0;
            }),
            backgroundColor: "rgba(34, 202, 236, 0.2)",
            borderColor: "rgba(34, 202, 236, 1)",
            borderWidth: 2,
          },
          {
            label: "Самооценка",
            data: uniqueCompetencies.map(({ id }) => {
              const selfAssessment = assessments.assessmentsSelf?.find(({ competency }) => competency.id === id);
              return selfAssessment ? selfAssessment.assessmentSummary : 0;
            }),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
        ],
      });
    }
  }, [assessments, uniqueCompetencies]);

  useEffect(() => {
    async function fetchUniqueCompetencyForSurvey() {
      try {
        const response = await surveyService.getUniqueCompetencyForSurveyById(surveyId);
        setUniqueCompetencies(response.data);
      } catch (error) {
        console.error("Error fetching competencies:", error);
      }
    }

    if (surveyId) {
      fetchUniqueCompetencyForSurvey();
    }
  }, [surveyId]);

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  };

  return (
    <MDBox style={{ width: "50%", margin: "auto" }}>
      <Radar ref={canvasRef} data={dataRadar} options={options} />
    </MDBox>
  );
}

export default SurveyChartForEmployee;
