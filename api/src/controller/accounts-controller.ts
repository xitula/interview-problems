import { RouterContext } from 'koa-router';
import AccountsService from '../service/accounts-service';

class AccountsController {
  private service: AccountsService = new AccountsService();

  signup = async (ctx: RouterContext) => {
    const {request: {body}} = ctx;
    ctx.body = await this.service.signup(body);
  };

  login =async (ctx: RouterContext) => {
    ctx.body = await this.service.login(ctx);
  }
}

export default new AccountsController();
