import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import HomeLayout from './layouts/HomeLayout'
import Signup from './pages/Signup'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import ProtectedLayout from './layouts/ProtectedLayout'
import GoogleLoginRedirect from './pages/GoogleLoginRedirect'

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      {path:"v1/auth/google/callback",element:<GoogleLoginRedirect/>},
    ],
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: "/my",
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <MyPage /> }
    ]
  }
]

const router = createBrowserRouter([...publicRoutes, ...protectedRoutes])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
