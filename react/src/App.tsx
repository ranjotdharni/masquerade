import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PAGE_HOME, PAGE_LOGIN, PAGE_SURVEY_CREATE, PAGE_SURVEY_FIND, PAGE_SURVEY_SUBMITTED, PAGE_SURVEY_TAKE, PAGE_SURVEY_PREVIEW, PAGE_WELCOME, PAGE_SURVEY_VIEW, PAGE_SURVEY_STATISTICS, PAGE_ABOUT, PAGE_USAGE } from "./lib/constants"
import WelcomePage from "./pages/WelcomePage"
import HomePage from "./pages/HomePage"
import AppLayout from "./pages/AppLayout"
import BaseLayout from "./pages/BaseLayout"
import LoginPage from "./pages/LoginPage"
import CreateSurveyPage from "./pages/CreateSurveyPage"
import ErrorView from "./components/utility/ErrorView"
import NotFound from "./components/utility/NotFound"
import CatalogPage from "./pages/CatalogPage"
import TakeSurveyPage from "./pages/TakeSurveyPage"
import SubmittedPage from "./pages/SubmittedPage"
import PreviewSurveyPage from "./pages/PreviewSurveyPage"
import MySurveysPage from "./pages/MySurveysPage"
import ViewSurveyPage from "./pages/ViewSurveyPage"
import StatisticsPage from "./pages/StatisticsPage"
import AboutPage from "./pages/AboutPage"
import UsagePage from "./pages/UsagePage"
import { UIProvider } from "./components/context/provider/UIProvider"

const routes = createBrowserRouter([
  {
    path: PAGE_WELCOME,
    element: <BaseLayout />,
    errorElement: <ErrorView />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: PAGE_ABOUT, element: <AboutPage /> },
      { path: PAGE_USAGE, element: <UsagePage /> },
      { path: PAGE_LOGIN, element: <LoginPage /> },
    ]
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: PAGE_HOME, element: <HomePage /> },
      { path: PAGE_SURVEY_CREATE, element: <CreateSurveyPage /> },
      { path: PAGE_SURVEY_FIND, element: <CatalogPage /> },
      { path: PAGE_SURVEY_VIEW, element: <MySurveysPage /> },
      { path: `${PAGE_SURVEY_VIEW}/:id`, element: <ViewSurveyPage /> },
      { path: `${PAGE_SURVEY_PREVIEW}/:id`, element: <PreviewSurveyPage /> },
      { path: PAGE_SURVEY_SUBMITTED, element: <SubmittedPage /> },
      { path: `${PAGE_SURVEY_TAKE}/:id`, element: <TakeSurveyPage /> },
      { path: PAGE_SURVEY_STATISTICS, element: <MySurveysPage /> },
      { path: `${PAGE_SURVEY_STATISTICS}/:id`, element: <StatisticsPage /> },
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
    
      <UIProvider notify={() => {}} confirm={() => {}}>
        <RouterProvider router={routes} />
      </UIProvider>
  )
}
