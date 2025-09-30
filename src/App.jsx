import Header from "./header/Header.jsx";
import { Route, Routes } from "react-router";
import Listpage from "./Listpage/Listpage.jsx";
import Addlist from "./Addlist/Addlist.jsx";
import MainPage from "./MainPage/MainPage.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Listpage" element={<Listpage />} />
        <Route path="/Addlist" element={<Addlist />} />
      </Routes>
    </>
  );
}

export default App;
