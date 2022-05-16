import { useRoutes } from 'react-router-dom';

// routes
import DefaultRoutes from './DefaultRoutes'

export default function ThemeRoutes() {
    return useRoutes([DefaultRoutes], '');
}
