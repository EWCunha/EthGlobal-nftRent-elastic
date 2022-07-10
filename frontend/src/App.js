
import {Routes, Route} from "react-router-dom";
import Home from "./components /Home";
import Rent from "./components /Rent";
import List from "./components /List";
import Search from "./components /Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="Rent" element={<Rent/>}/>
      <Route path="Search" element = {<Search/>}/>
      <Route path ="List" element = {<List/>}/> 
    </Routes>
  );
}

export default App;
