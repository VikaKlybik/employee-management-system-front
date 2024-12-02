import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import team4 from "assets/images/team-4.jpg";

function ProfilesList({ title, profiles, shadow }) {
  const renderProfiles = profiles?.map(({ user, department, jobTitle }) => (
    <MDBox key={`${user?.lastName} ${user?.firstName}`} component="li" display="flex" alignItems="center" py={1} mb={1}>
      <MDBox mr={2}>
        <MDAvatar src={user?.profilePhotoUrl} alt="something here" shadow="md" />
      </MDBox>
      <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
        <MDTypography variant="button" fontWeight="medium">
          {`${user?.lastName} ${user?.firstName}`}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {`${department?.name} / ${jobTitle?.name}`}
        </MDTypography>
      </MDBox>
      {/*<MDBox ml="auto">*/}
      {/*  {action.type === "internal" ? (*/}
      {/*    <MDButton component={Link} to={action.route} variant="text" color="info">*/}
      {/*      {action.label}*/}
      {/*    </MDButton>*/}
      {/*  ) : (*/}
      {/*    <MDButton*/}
      {/*      component="a"*/}
      {/*      href={action.route}*/}
      {/*      target="_blank"*/}
      {/*      rel="noreferrer"*/}
      {/*      variant="text"*/}
      {/*      color={action.color}*/}
      {/*    >*/}
      {/*      {action.label}*/}
      {/*    </MDButton>*/}
      {/*  )}*/}
      {/*</MDBox>*/}
    </MDBox>
  ));

  return (
    <Card sx={{ height: "100%", boxShadow: !shadow && "none" }}>
      <MDBox pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        {profiles && profiles.length > 0 ? (
          renderProfiles
        ) : (
          <MDTypography variant="body1" color="textSecondary" align="center">
            Нет подчинённых
          </MDTypography>
        )}
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfilesList
ProfilesList.defaultProps = {
  shadow: true,
};

// Typechecking props for the ProfilesList
ProfilesList.propTypes = {
  title: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  shadow: PropTypes.bool,
};

export default ProfilesList;
