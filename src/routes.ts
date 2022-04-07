import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import Staking from './pages/Staking';
import UnlockPage from './pages/UnlockPage';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  staking: '/'
};

const routes: Array<any> = [
  {
    path: routeNames.staking,
    title: 'Staking',
    component: Staking
  },
];

const mappedRoutes = routes.map((route) => {
  const title = route.title
    ? `${route.title} • Elrond ${dAppName}`
    : `Elrond ${dAppName}`;

  const requiresAuth = Boolean(route.authenticatedRoute);
  const wrappedComponent = withPageTitle(title, route.component);

  return {
    path: route.path,
    component: wrappedComponent,
    authenticatedRoute: requiresAuth
  };
});

export default mappedRoutes;
