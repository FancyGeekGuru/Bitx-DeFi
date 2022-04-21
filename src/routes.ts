import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import BitXStaking from './pages/Staking/BitXStaking';
import DiceStaking from './pages/Staking/DiceStaking';
import StakingHome from './pages/Staking';
import PreSale from './pages/Presale';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  staking: '/staking',
  bitxstaking: '/btx-pool',
  dicestaking: '/dice-pool',
  presale: '/presale',
  home: '/',
};

const routes: Array<any> = [
  {
    path: routeNames.bitxstaking,
    title: 'BTX Pool',
    component: BitXStaking
  },
  {
    path: routeNames.dicestaking,
    title: 'Dice Pool',
    component: DiceStaking
  },

  {
    path: routeNames.staking,
    title: 'Staking',
    component: StakingHome
  },

  {
    path: routeNames.presale,
    title: 'PreSale',
    component: PreSale
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
