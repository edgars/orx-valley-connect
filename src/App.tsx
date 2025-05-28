
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import EventManagement from "./pages/EventManagement";
import EventDetails from "./pages/EventDetails";
import Members from "./pages/Members";
import MyEvents from "./pages/MyEvents";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogManagement from "./pages/BlogManagement";
import CreateBlogPost from "./pages/CreateBlogPost";
import EditBlogPost from "./pages/EditBlogPost";
import NotFound from "./pages/NotFound";
import CertificateGenerator from "./components/CertificateGenerator";
import CertificateGeneratorPage from "./pages/certificados";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/eventos/gerenciar" element={<EventManagement />} />
            <Route path="/eventos/:id" element={<EventDetails />} />
            <Route path="/Comunidade" element={<Members />} />
            <Route path="/meus-eventos" element={<MyEvents />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/blog/gerenciar" element={<BlogManagement />} />
            <Route path="/blog/criar" element={<CreateBlogPost />} />
            <Route path="/blog/editar/:id" element={<EditBlogPost />} />
           <Route path="/certificados" element={<CertificateGeneratorPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
