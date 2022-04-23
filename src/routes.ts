import { dAppName } from 'config';
import withPageTitle from './components/PageTitle';
import BTXFinanceHome from './pages';
import NFTMint from './pages/NFTMint';
import PreSale from './pages/Presale';
import StakingHome from './pages/Staking';
import BitXStaking from './pages/Staking/BitXStaking';
import DiceStaking from './pages/Staking/DiceStaking';
import MareStaking from './pages/Staking/MareStaking';

export const routeNames = {
  unlock: '/unlock',
  ledger: '/ledger',
  walletconnect: '/walletconnect',
  staking: '/staking',
  presale: '/presale',
  nftmint: '/nft-mint',
  home: '/',

  bitxstaking: '/btx-pool',
  dicestaking: '/dice-pool',
  marestaking: '/mare-pool',
};

const routes: Array<any> = [
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

  {
    path: routeNames.nftmint,
    title: 'NFT Mint',
    component: NFTMint
  },

  {
    path: routeNames.home,
    title: 'BTX Finance',
    component: BTXFinanceHome
  },

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
    path: routeNames.marestaking,
    title: 'Mare Pool',
    component: MareStaking
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
