import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import OrderManagement from "pages/order-management";
import Dashboard from "pages/dashboard";
import MenuManagement from "pages/menu-management";
import UserManagement from "pages/user-management";
import SalesReports from "pages/sales-reports";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu-management" element={<MenuManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/sales-reports" element={<SalesReports />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;