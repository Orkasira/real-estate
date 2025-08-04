import Header from "./Header/header.jsx";
import { Route, Routes } from "react-router";
import Main from "./Main/Main.jsx";
import Listpage from "./Listpage/Listpage.jsx";
import Addlist from "./Addlist/Addlist.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/Main" element={<Main />} />
        <Route path="/Listpage" element={<Listpage />} />
        <Route path="/Addlist" element={<Addlist />} />
      </Routes>
    </>
  );
}

export default App;
