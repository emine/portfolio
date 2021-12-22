import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {ChevronLeft, Home} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

export default function TopAppBar(props) {
    const navigate = useNavigate();
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            {props.returnLink &&
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick = {() => navigate(props.returnLink)}
            >
                <ChevronLeft />
            </IconButton>
            }
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
                {props.title}
            </Typography>
          
            {props.returnLink &&
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick = {() => navigate('/')}
              >
                    <Home />
            </IconButton>
            }
        </Toolbar>
      </AppBar>
    </Box>
  );
}