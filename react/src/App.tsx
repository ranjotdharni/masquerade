import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PAGE_HOME, PAGE_LOGIN, PAGE_SURVEY_CREATE, PAGE_WELCOME } from "./lib/constants"
import WelcomePage from "./pages/WelcomePage"
import HomePage from "./pages/HomePage"
import AppLayout from "./pages/AppLayout"
import BaseLayout from "./pages/BaseLayout"
import LoginPage from "./pages/LoginPage"
import CreateSurveyPage from "./pages/CreateSurveyPage"
import ErrorView from "./components/utility/ErrorView"
import NotFound from "./components/utility/NotFound"

const routes = createBrowserRouter([
  {
    path: PAGE_WELCOME,
    element: <BaseLayout />,
    errorElement: <ErrorView />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: PAGE_LOGIN, element: <LoginPage /> },
    ]
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: PAGE_HOME, element: <HomePage /> },
      { path: PAGE_SURVEY_CREATE, element: <CreateSurveyPage /> }
    ],
  },
  {
    path: '*', // Path does not exist
    element: <NotFound />,
    errorElement: <ErrorView />,
  }
])

export default function App() {

  return (
    <RouterProvider router={routes} />
  )
}
