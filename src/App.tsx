
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Members = lazy(() => import("@/pages/Members"));
const MemberDetails = lazy(() => import("@/pages/MemberDetails"));
const MyEvents = lazy(() => import("@/pages/MyEvents"));
const EventDetails = lazy(() => import("@/pages/EventDetails"));
const Profile = lazy(() => import("@/pages/Profile"));
const Admin = lazy(() => import("@/pages/Admin"));
const EventManagement = lazy(() => import("@/pages/EventManagement"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const BlogManagement = lazy(() => import("@/pages/BlogManagement"));
const CreateBlogPost = lazy(() => import("@/pages/CreateBlogPost"));
const EditBlogPost = lazy(() => import("@/pages/EditBlogPost"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/:id" element={<MemberDetails />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/events" element={<EventManagement />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/blog" element={<BlogManagement />} />
              <Route path="/admin/blog/create" element={<CreateBlogPost />} />
              <Route path="/admin/blog/edit/:id" element={<EditBlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
