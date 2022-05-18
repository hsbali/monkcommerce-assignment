import { lazy } from 'react';

// project imports
import DefaultLayout from '../components/layouts/DefaultLayout';
import Loadable from '../components/loaders/Loadable';
import TopLoader from '../components/loaders/TopLoader';

const HomePage = Loadable(
	lazy(() => import('../pages/HomePage')),
	TopLoader
);

// ==============================|| MAIN ROUTING ||============================== //

const DefaultRoutes = {
	path: '',
	element: <DefaultLayout />,
	children: [
		{
			path: '',
			element: <HomePage />,
		},
	],
};

export default DefaultRoutes;
