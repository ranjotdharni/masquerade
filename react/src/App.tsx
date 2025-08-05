import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PAGE_HOME, PAGE_WELCOME } from "./lib/constants"
import WelcomePage from "./pages/WelcomePage"
import HomePage from "./pages/HomePage"
import AppLayout from "./pages/AppLayout"

const routes = createBrowserRouter([
  {
    path: PAGE_WELCOME,
    element: <WelcomePage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: PAGE_HOME, element: <HomePage /> }
    ],
  },
])

export default function App() {

  return (
    <RouterProvider router={routes} />
  )
}
