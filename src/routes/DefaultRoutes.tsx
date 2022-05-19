import { lazy } from 'react';

// project imports
import DefaultLayout from '../components/layouts/DefaultLayout';
import Loadable from '../components/loaders/Loadable';
import TopLoader from '../components/loaders/TopLoader';

const IndexPage = Loadable(
	lazy(() => import('../pages/IndexPage')),
	TopLoader
);

// ==============================|| MAIN ROUTING ||============================== //

const DefaultRoutes = {
	path: '',
	element: <DefaultLayout />,
	children: [
		{
			path: '',
			element: <IndexPage />,
		},
	],
};

export default DefaultRoutes;
