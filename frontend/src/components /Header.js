import React from 'react'
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton
} from '@mui/material'

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    navlinks: {
      marginLeft: theme.spacing(1),
      display: "flex",
    },
    logo: {
      flexGrow: "1",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(5),
      "&:hover": {
        color: "yellow",
        borderBottom: "1px solid white",
      },
    },
  }));

const Header = () => {
const classes = useStyles();

  return (
    <>
    <AppBar position="static" sx={{marginBottom:2}}>
 <CssBaseline />
 <Toolbar>
   <IconButton href="/">
   <Typography variant="h4" className={classes.logo} color="white">
     Elastic 
   </Typography>
   </IconButton>
 
 
     <div className={classes.navlinks} >
       <Link to="/" className={classes.link}>
         Home
       </Link>
       <Link to="/List" className={classes.link} >
         List
       </Link> 
       <Link to="/Search" className={classes.link}>
         Search
       </Link>
      
          
     </div>      
 </Toolbar>
</AppBar>
 
 </>
  )
}

export default Header