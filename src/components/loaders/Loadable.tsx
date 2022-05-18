import { FC, Suspense } from 'react';

/* eslint-disable react/function-component-definition */
export default function Loadable(Component: any, Loader: FC) {
	/* eslint-disable react/display-name */
	return (props: any) => (
		<Suspense fallback={<Loader />}>
			<Component {...props} />
		</Suspense>
	);
	/* eslint-enable react/display-name */
}
/* eslint-enable react/function-component-definition */
