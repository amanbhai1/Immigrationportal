import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DashboardNew from "./pages/Dashboard";
import ImmigrationFile from "./pages/ImmigrationFile";
import CRSScore from "./pages/CRSScore";
import DocumentUpload from "./pages/DocumentUpload";
import ApplicationCategoryNew from "./pages/ApplicationCategory";
import ChecklistNew from "./pages/ChecklistNew";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
  };

  // Public Route Component (redirect to dashboard if authenticated)
  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
  };

  return (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route 
      path="/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <DashboardNew />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/immigration-file" 
      element={
        <ProtectedRoute>
          <ImmigrationFile />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/crs-score" 
      element={
        <ProtectedRoute>
          <CRSScore />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/document-upload" 
      element={
        <ProtectedRoute>
          <DocumentUpload />
        </ProtectedRoute>
      } 
    />
    <Route
      path="/application-category"
      element={
        <ProtectedRoute>
          <ApplicationCategoryNew />
        </ProtectedRoute>
      }
    />
    <Route 
      path="/checklist" 
      element={
        <ProtectedRoute>
          <ChecklistNew />
        </ProtectedRoute>
      } 
    />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
