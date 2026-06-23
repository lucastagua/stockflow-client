import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";
import { StockMovementsPage } from "./pages/StockMovementsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ExchangeRatesPage } from "./pages/ExchangeRatesPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/exchange-rates" element={<ExchangeRatesPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/stock-movements" element={<StockMovementsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;