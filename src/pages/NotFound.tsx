import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "react-day-picker";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b">
      <div className="text-center">
      <img src="/capybara.svg" alt="capybara" className="w-60 h-62 mx-auto mb-8" />
      <h1 className="text-6xl font-extrabold text-white mb-4 ">
          404
        </h1>
        <p className="text-xl text-white  mb-4">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-2 text-sm font-medium text-white bg-orx-gradient rounded-full hover:bg-blue-700 transition-colors"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
