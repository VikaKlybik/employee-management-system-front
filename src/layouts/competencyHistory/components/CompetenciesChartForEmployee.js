import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";
import SurveyService from "../../../services/SurveyService";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function CompetenciesChartForEmployee({ userId }) {
  const [competenciesHistory, setCompetenciesHistory] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [visibilityMap, setVisibilityMap] = useState({});
  const surveyService = new SurveyService();

  useEffect(() => {
    async function fetchCompetenciesHistory() {
      const response = await surveyService.getHistoryAssessments(userId);
      setCompetenciesHistory(response.data);
    }
    if(userId) {
      fetchCompetenciesHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (competenciesHistory) {
      const { labels, datasets } = transformToChartJS(competenciesHistory);
      setChartData({ labels, datasets });
      // Инициализируем все как visible
      const initialVisibility = {};
      datasets.forEach(ds => {
        initialVisibility[ds.label] = true;
      });
      setVisibilityMap(initialVisibility);
    }
  }, [competenciesHistory]);

  const getColor = index => {
    const colors = [
      "#8884d8", "#82ca9d", "#ffc658", "#ff7300",
      "#d0ed57", "#a4de6c", "#888888", "#0088FE",
      "#00C49F", "#FFBB28", "#FF6384", "#36A2EB"
    ];
    return colors[index % colors.length];
  };

  function transformToChartJS(data) {
    const now = new Date();
    const months = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      months.push({
        key,
        label: d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })
      });
    }

    const competencySet = new Set();
    data.forEach(entry => {
      entry.assessments.forEach(a => {
        competencySet.add(a.competency.name);
      });
    });
    const competencyList = Array.from(competencySet);
    const competencyMap = new Map();
    competencyList.forEach(name => competencyMap.set(name, Array(months.length).fill(null)));

    months.forEach((month, monthIdx) => {
      const entriesForMonth = data.filter(entry => entry.date.startsWith(month.key));

      const perCompetency = new Map();

      entriesForMonth.forEach(entry => {
        entry.assessments.forEach(assessment => {
          const name = assessment.competency.name;
          if (!perCompetency.has(name)) {
            perCompetency.set(name, []);
          }
          perCompetency.get(name).push(assessment.assessmentSummary);
        });
      });

      for (const [name, scores] of perCompetency.entries()) {
        const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
        competencyMap.get(name)[monthIdx] = Number(avg.toFixed(2));
      }
    });

    const datasets = Array.from(competencyMap.entries()).map(([name, values], idx) => ({
      label: name,
      data: values,
      fill: false,
      borderColor: getColor(idx),
      tension: 0.3,
      spanGaps: true
    }));

    return {
      labels: months.map(m => m.label),
      datasets
    };
  }

  const handleToggleCompetency = (label) => {
    setVisibilityMap(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  if (!chartData) return null;

  const filteredDatasets = chartData.datasets.filter(ds => visibilityMap[ds.label]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 16, gap: "12px" }}>
        {chartData.datasets.map(ds => (
          <label key={ds.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="checkbox"
              checked={visibilityMap[ds.label]}
              onChange={() => handleToggleCompetency(ds.label)}
            />
            <span style={{ color: ds.borderColor }}>{ds.label}</span>
          </label>
        ))}
      </div>

      {/* График */}
      <div style={{ height: 400 }}>
        <Line
          data={{ labels: chartData.labels, datasets: filteredDatasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 6,
                ticks: { stepSize: 1 }
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: { mode: 'index', intersect: false }
            }
          }}
        />
      </div>
    </div>
  );
}
