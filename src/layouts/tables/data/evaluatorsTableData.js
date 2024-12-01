// @mui material components
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import MDButton from "../../../components/MDButton";
import MDBox from "../../../components/MDBox";

export default function data(evaluators, handleDeleteRow, handleDialogOpen, handleEvaluatorsDialog, handleDelete) {

  if (!evaluators || evaluators.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }
  const Evaluator = ({ name, departmentJobTitle, onDelete }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1} padding={1} border={1} borderColor="grey.300"
           borderRadius={2} mr={2} mb={2}>
      <MDBox ml={2} lineHeight={1} flexGrow={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{departmentJobTitle}</MDTypography>
      </MDBox>
      <IconButton onClick={onDelete} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
    </MDBox>
  );
  const Evaluated = ({ name, departementJobTitle }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{departementJobTitle}</MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      { Header: "Оцениваемый сотрудник", accessor: "evaluated", width: "40%", align: "left" },
      { Header: "Оценщики", width: "40%", accessor: "evaluators", align: "center" },
      { Header: "Дейстивия", accessor: "action", align: "center" },
    ],

    rows: evaluators?.map(({ id, evaluated, evaluatorsEmp }) => {
      return {
        evaluated: (evaluated ?
            <Evaluated
              name={`${evaluated?.user?.lastName} ${evaluated?.user?.firstName}`}
              departementJobTitle={`${evaluated?.department?.name}/${evaluated?.jobTitle?.name}`}
            /> :
            <MDButton
              variant="info"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleDialogOpen(id)}>
              Выбрать сотрудника
            </MDButton>
        ),
        evaluators: (!evaluated ?
            <MDTypography variant={"h6"}>Сперва выберите сотрудника</MDTypography> :
            <>
              <MDButton
                variant="info"
                size="small"
                onClick={() => handleEvaluatorsDialog(id)}>
                Распределить оценщиков
              </MDButton>
              <MDBox display="flex" flexWrap="wrap">
                {evaluatorsEmp.map((item) => (
                  <Evaluator
                    key={item.id}
                    name={`${item?.user?.lastName} ${item?.user?.firstName}`}
                    departmentJobTitle={`${item?.department?.name}/${item?.jobTitle?.name}`}
                    onDelete={() => handleDelete(id, item.id)}
                  />
                ))}
              </MDBox>
            </>
        ),
        action: (
          <IconButton onClick={() => handleDeleteRow(id)}>
            <DeleteIcon />
          </IconButton>
        ),
      };
    }),
  };
};

