import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import BiblePage from '../features/bible/BiblePage'
import ComparisonPage from '../features/comparison/ComparisonPage'
import HomePage from '../features/home/HomePage'
import SundaySchoolPage from '../features/sunday-school/SundaySchoolPage'
import NotFoundPage from './NotFoundPage'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'bible', element: <BiblePage /> },
      { path: 'compare', element: <ComparisonPage /> },
      { path: 'sunday-school', element: <SundaySchoolPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default router
