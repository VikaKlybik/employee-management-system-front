import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import MDBox from "../../../components/MDBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDTypography from "../../../components/MDTypography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MDInput from "../../../components/MDInput";
import { InputLabel, Select } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import MDButton from "../../../components/MDButton";
import CompetencyService from "../../../services/CompetencyService";
import SurveyService from "../../../services/SurveyService";
import { useNavigate } from "react-router-dom";

const SurveyButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "200px",
}));
const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function SurveyCreate() {

  const [surveyName, setSurveyName] = useState("");
  const [surveyDescription, setSurveyDescription] = useState("");
  const [surveyMethod, setSurveyMethod] = useState("");
  const [questions, setQuestions] = useState([]);
  const [competency, setCompetency] = useState([]);
  const competencyService = new CompetencyService();
  const surveyService = new SurveyService();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllCompetency() {
      try {
        const response = await competencyService.getCompetency();
        console.log("Fetched competency data:", response.data); // Debug log
        setCompetency(response.data);
      } catch (error) {
        console.log("Error fetching competency:", error);
      }
    }

    fetchAllCompetency();
  }, []);

  // Handler for adding a new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: questions.length + 1, name: "", competencyId: "" },
    ]);
  };

  const handleCreateSurvey = async () => {
    const surveyCreateRequest = {
      name: surveyName,
      description: surveyDescription,
      evaluationMethod: surveyMethod,
      questions: questions.map(({ name, competencyId }) => {
          return {
            name: name,
            competencyId: competencyId
          }
        }
      ),
    };
    await surveyService.compositeCreateSurvey(surveyCreateRequest);
    navigate("/survey")
  };

  // Handler for updating question text
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handler for deleting a question
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handler for updating an option in a multiple-choice question
  const classes = useStyles();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Создание опроса
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox
                  mx={2}
                  py={3}
                  px={2}
                >
                  <MDInput
                    type="text"
                    label="Название"
                    variant="outlined"
                    fullWidth margin="normal"
                    value={surveyName}
                    onChange={(e) => setSurveyName(e.target.value)} />
                  <MDInput
                    label="Описание"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={surveyDescription}
                    onChange={(e) => setSurveyDescription(e.target.value)} />
                  <InputLabel id="survey_method">Вид опроса</InputLabel>
                  <Select
                    labelId="survey_method"
                    fullWidth
                    displayEmpty
                    className={classes.selectEmpty}
                    margin="normal"
                    style={{ paddingTop: "10px", paddingBottom: "10px", marginTop: "2px" }}
                    value={surveyMethod}
                    onChange={(e) => setSurveyMethod(e.target.value)}
                  >
                    <MenuItem value="METHOD_270">Метод 270</MenuItem>
                    <MenuItem value="METHOD_360">Метод 360</MenuItem>
                  </Select>

                  {questions && questions.length > 0 && (
                    <Typography variant="h5" gutterBottom style={{ marginTop: "10px" }}>
                      Вопросы
                    </Typography>
                  )}

                  {questions.map((question, index) => (
                    <div key={question.id}
                         style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
                      <TextField
                        label="Текст вопроса"
                        variant="outlined"
                        fullWidth
                        p={2}
                        margin="normal"
                        value={question.name}
                        onChange={(e) => handleQuestionChange(index, "name", e.target.value)}
                      />
                      <InputLabel id={`survey_question-${index}`}>Выберите компетенцию</InputLabel>
                      <Select
                        select
                        labelId={`survey_question-${index}`}
                        fullWidth
                        p={2}
                        displayEmpty
                        style={{ paddingTop: "10px", paddingBottom: "10px", marginTop: "2px" }}
                        value={question.competencyId}
                        onChange={(e) => handleQuestionChange(index, "competencyId", e.target.value)}
                      >
                        {competency.map(({ id, name }) => (
                          <MenuItem value={id}>{name}</MenuItem>
                        ))}
                      </Select>

                      <IconButton onClick={() => handleDeleteQuestion(index)} color="secondary"
                                  style={{ marginTop: "10px" }}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                  <Grid container spacing={3} style={{ marginTop: "10px" }}>
                    <Grid item xs={12} md={6} lg={3}>
                      <MDButton variant="contained" color="info" fullWidth onClick={handleAddQuestion}>
                        Добавить вопрос
                      </MDButton>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                      <MDButton variant="contained" color="success" fullWidth onClick={handleCreateSurvey} disabled={!surveyName && !surveyDescription && !surveyMethod && (!questions || questions.length ===0)}>
                        Создать опрос
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default SurveyCreate;