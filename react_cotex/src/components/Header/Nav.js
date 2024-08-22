import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button, Badge, Avatar, Box } from '@mui/material';
import { Notifications as NotificationsIcon, AccountCircle } from '@mui/icons-material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import config from '../../config';
const Nav = ({ logo, isLoggedIn, notifications, profilePic, logout, markAsRead }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showPCGamesDropdown, setShowPCGamesDropdown] = useState(false);

  const handlePCGamesDropdownToggle = () => {
    setShowPCGamesDropdown((prev) => !prev);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{padding:'0 30px', backgroundColor:'#1f2122'}}>
      <Toolbar sx={{backgroundColor:'#1f2122', padding:'40px 10px 20px'}}>
        <Link to="/" style={{ marginRight: 'auto' }}>
          <img alt="Logo" src={logo} height=" 25" />
        </Link>
        <div style={{ flexGrow: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/" color="inherit" sx={{color:'gray', padding:'0 20px'}}>Home</Button>
          <div
            style={{ position: 'relative' }}
            onMouseEnter={handlePCGamesDropdownToggle}
            onMouseLeave={handlePCGamesDropdownToggle}
          >
            <Button color="inherit" sx={{color:'gray', padding:'0 20px'}}>PC GAMES ▼</Button>
            {showPCGamesDropdown && (
              <Box
                position="absolute"
                top="100%"
                left="0"
                bgcolor="background.paper"
                boxShadow={3}
                zIndex={1}
                p={2}
                display="flex"
                flexDirection="column"
              >
                {[
                  ['Action', 'Adventure', 'RPG', 'Careers'],
                  ['Indie', 'Simulator', 'Open world', 'ROLE'],
                  ['Strategy', 'Sandbox', 'Terror', 'Exploration'],
                  ['Struggle'],
                ].map((categoryGroup, index) => (
                  <Box key={index} display="flex">
                    {categoryGroup.map((category) => (
                      <Button
                        key={category}
                        component={Link}
                        to={`/category/?q=${category}`}
                        style={{ color: 'black' }}
                      >
                        {category}
                      </Button>
                    ))}
                  </Box>
                ))}
              </Box>
            )}
          </div>
          <Button component={Link} to="/online-games" color="inherit" sx={{color:'gray', padding:'0 20px'}}>Online Games</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          {isLoggedIn() ? (
            <>
              <IconButton component={Link} color="inherit" onClick={handleMenuOpen}>
                <Badge badgeContent={notifications.filter(notification => !notification.is_read).length} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                {notifications.length === 0 ? (
                  <MenuItem onClick={handleMenuClose}>No notifications</MenuItem>
                ) : (
                  notifications.map(notification => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => { handleMenuClose(); markAsRead(notification.id, notification.game_url); }}
                      selected={!notification.is_read}
                    >
                      <Typography variant="body2">{notification.message}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(notification.created_at).toLocaleString()}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </Menu>
              <IconButton component={Link} color="inherit" onClick={handleProfileMenuOpen}>
             
              {profilePic ? (
                  <img src={`${config.API_URL}/${profilePic}`} alt="Profile" className="profile-pic" style={{ height: '40px', borderRadius: '50%' }} />
                ) : (
                  <img src="default-profile-pic.jpg" alt="Default Profile" className="profile-pic" style={{ height: '40px', borderRadius: '50%' }} />
                )}
              </IconButton>
              <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileMenuClose}>
                <MenuItem component={Link} to="/profile">Profile</MenuItem>
                <MenuItem onClick={logout}>Log Out</MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton component={Link} to="/login" color="inherit" sx={{color:'gray', padding:'0 20px'}}>
              <PersonOutlineIcon />
            </IconButton>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
