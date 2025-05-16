import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

// 不需要认证的路由
const notProtectedRoutes = ['/login', '/register', '/'];

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  
  useEffect(() => {
    console.log('router.pathname', router.pathname)
    console.log('isLoggedIn', isLoggedIn)

    if (!notProtectedRoutes.includes(router.pathname) && !isLoggedIn) {
      console.log('未登录，重定向到登录页');
      router.push({
        pathname: '/login',
        query: { redirect: router.pathname }
      });
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
} 