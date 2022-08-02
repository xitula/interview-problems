import homeController from './controller/home-controller';
import accountsController from './controller/accounts-controller';

export default [
  {
    path: '/',
    method: 'get',
    action: homeController.hello
  },
  {
    path: '/accounts/signup',
    method: 'post',
    action: accountsController.signup
  },
  {
    path: '/accounts/login',
    method: 'post',
    action: accountsController.login
  },
];
