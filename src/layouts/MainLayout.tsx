import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  DollarSign,
  FolderTree,
  ReceiptText,
  Shuffle,
} from "lucide-react";

export function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>StockFlow</h1>
          <p>Business management</p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end>
            <BarChart3 size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/categories">
            <FolderTree size={18} />
            Categories
          </NavLink>

          <NavLink to="/products">
            <Boxes size={18} />
            Products
          </NavLink>

          <NavLink to="/exchange-rates">
            <DollarSign size={18} />
            Exchange Rates
          </NavLink>

          <NavLink to="/sales">
            <ReceiptText size={18} />
            Sales
          </NavLink>

          <NavLink to="/stock-movements">
            <Shuffle size={18} />
            Stock Movements
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}