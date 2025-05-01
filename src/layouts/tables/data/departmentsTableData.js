// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "../../../components/MDAvatar";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// Images

export default function DepartmentsTableData(departments, handleDeleteDepartment, handleViewDepartmentInfo) {
  const DepartmentName = ({ name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  const Head = ({ image, name, position }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{position}</MDTypography>
      </MDBox>
    </MDBox>
  );
  if (!departments || departments.length === 0) {
    return { columns: [], rows: [] }; // Ensure a valid return structure
  }

  return {
    columns: [
      { Header: "Название", accessor: "name", width: "25%", align: "left" },
      { Header: "Руководитель", accessor: "headData", align: "left" },
      { Header: "Количество позиций", accessor: "jobTitleCount", align: "center" },
      { Header: "Подробнее", accessor: "more", align: "center" },
      { Header: "Удалить", accessor: "delete", align: "center" },
    ],

    rows: departments?.map(({ id, name, jobs, head }, index) => {
      return {
        name: (
          <DepartmentName
            key={`department-${index}`} // Added key prop
            name={name}
          />
        ),
        headData: (
          <div>
            {!head &&
              <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
                Head отсутствует
              </MDTypography>}
            {head && <Head
              image={head.user.profilePhotoUrl}
              name={`${head.user.lastName} ${head.user.firstName}`}
              position={head.jobTitle.name}
            >
            </Head>
            }
          </div>
        ),
        jobTitleCount: (
          <MDTypography component="p" variant="caption" color="textSecondary" fontWeight="medium">
            {jobs?.length}
          </MDTypography>
        ),
        more: (
          <MDTypography component="button" variant="overline" color="info"
                        fontWeight="medium" onClick ={() => handleViewDepartmentInfo(id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          padding: 0,
                          margin: 0,
                          cursor: 'pointer',
                        }}>
            Смотреть
          </MDTypography>
        ),
        delete: (
          <>
            {jobs?.length == 0 &&
              <IconButton onClick={() => handleDeleteDepartment(id)}>
                <DeleteIcon />
              </IconButton>
            }
          </>
        ),
      };
    }),
  };
}
