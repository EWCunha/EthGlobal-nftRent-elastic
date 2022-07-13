
import {Routes, Route} from "react-router-dom";
import Home from "./components /Home";
import Rent from "./components /Rent";
import List from "./components /List";
import Search from "./components /Search";
import Header from "./components /Header";
import Dashboard from "./components /Dashboard";
import { createTheme, ThemeProvider} from "@mui/material"
import { useSelector } from "react-redux"


let theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
    },
    secondary: {
      main: '#ffef62',
    },
  }
});

function App() {


  return (
    <>
      <ThemeProvider theme={theme}>
        <Header/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="Rent" element={<Rent/>}/>
          <Route path="Search" element={<Search/>}/>
          <Route path="List" element={<List/>}/> 
          <Route path="Dashboard" element={<Dashboard/>}/>
        </Routes> 
      </ThemeProvider>
    </>

  );
}

export default App;
