import { Routes, Route, useLocation } from "react-router-dom";
import styled from "styled-components";
import SiteHeader from "./components/Header";
import SiteFooter from "./components/Footer";
import TILList from "./pages/TILList.tsx";
import TILView from "./pages/TILView.tsx";

function App() {
  useLocation();
  return (
    <Layout>
      <SiteHeader />
      <Main>
        <Routes>
          <Route path="/" element={<TILList />} />
          <Route path="/til" element={<TILList />} />
          <Route path="/til/:slug" element={<TILView />} />
        </Routes>
      </Main>
      <SiteFooter />
    </Layout>
  );
}

export default App;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 24px 16px;
  ${({ theme }) => theme.mq.sm} {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.main`
  min-height: 60vh;
`;
