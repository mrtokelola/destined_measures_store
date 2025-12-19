import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductPage.jsx";
import ProductsDetail from "./pages/ProductsDetail.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";

const AppWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

function App() {
  return (
    <AppWrapper>
      <Navbar />

      <Main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductsDetail />} />
          <Route path="/about/" element={<AboutUs />} />
          <Route path="/contact/" element={<ContactUs />} />
        </Routes>
      </Main>

      <Footer />
    </AppWrapper>
  );
}

export default App;
