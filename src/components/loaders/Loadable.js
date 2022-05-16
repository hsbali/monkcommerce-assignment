import { Suspense } from 'react';

const Loadable = (Component, Loader) => (props) =>
(
    <Suspense fallback={<Loader />}>
        <Component {...props} />
    </Suspense>
);

export default Loadable;
