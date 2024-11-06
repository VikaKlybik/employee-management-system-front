// DropdownMenu.js
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function DropdownMenu({ icon = <MoreVertIcon />, menuItems = [], onMenuItemClick }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    if (onMenuItemClick) {
      onMenuItemClick(item);
    }
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        {icon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={() => handleItemClick(item)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default DropdownMenu;
