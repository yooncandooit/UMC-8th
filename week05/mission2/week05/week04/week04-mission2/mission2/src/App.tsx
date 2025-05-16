import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import HomeLayout from './layouts/HomeLayout'
import Signup from './pages/Signup'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout/>,
    errorElement: <NotFound />,
    children: [
      {index:true,element:<Home/>},
      {path: 'login', element: <Login /> },
      {path: 'signup',element:<Signup/>},
    ]
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
