import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <div className="project grid w-full">
        <Header />
        <div>
          <Outlet />
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App;