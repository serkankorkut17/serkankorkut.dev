"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordPromptDialog from '@/components/Admin/PasswordPromptDialog';

const withAdminAuth = (WrappedComponent) => {
  return function AdminAuthComponent(props) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/admin/verify', {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Auth check error:', error);
          setIsAuthenticated(false);
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    // Loading state
    if (isLoading) {
      return (
        <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </section>
      );
    }

    // Not authenticated - show login
    if (!isAuthenticated) {
      return <PasswordPromptDialog />;
    }

    // Authenticated - show the protected component
    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
