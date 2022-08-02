import { RouterContext } from "koa-router";

// 用户信息
interface AccountInfo {
  username?: string;
  password?: string;
}

// 响应信息
interface RespData {
  ok: boolean;
  status: number;
  msg?: string;
}

// 内存存储的用户列表
const accountsListMemory: Array<AccountInfo> = [];

/**
 * 检查用户名是否合法，不合法时返回对应的包含错误信息的响应数据
 *
 * @param {string} username 用户名
 */
function checkUsername(username: string): void {
  const idx = accountsListMemory.findIndex((elem) => {
    const { username: savedUsername } = elem;
    return savedUsername === username;
  });
  if (username.length < 5 || username.length > 20)
    throw { ok: false, status: 401, msg: "用户名不规范,长度应在 5 - 20 之间" };
  if (/^\d+/.test(username))
    throw { ok: false, status: 401, msg: "用户名不规范,不能以数字开头" };
  if (idx !== -1) throw { ok: false, status: 500, msg: "用户名已存在" };
}

/**
 * 检查密码是否合法，不合法时返回对应的包含错误信息的响应数据
 *
 * @param {string} password 密码
 */
function checkPassword(password: string): void {
  if (password.length < 6)
    throw { ok: false, status: 401, msg: "密码不规范,长度须6位以上" };
  const typeList: boolean[] = [];
  typeList.push(/[a-z]+/.test(password));
  typeList.push(/[A-Z]+/.test(password));
  typeList.push(/\d+/.test(password));

  const init = 0;
  const sum = typeList.reduce(
    (prevValue, currValue) => prevValue + (currValue ? 1 : 0),
    init
  );

  if (sum < 2)
    throw {
      ok: false,
      status: 401,
      msg: "密码不规范,须包含大写，小写，数字至少二项",
    };
}

/**
 * 账户服务类
 *
 * @export
 * @class AccountsService
 */
export default class AccountsService {

  /**
   * 注册服务
   *
   * @param {AccountInfo} data 注册用用户信息
   * @return {Promise<RespData>} 响应信息
   * @memberof AccountsService
   */
  signup(data: AccountInfo) {
    return new Promise((resolve) => {
      const { username, password } = data;
      try {
        checkUsername(username);
        checkPassword(password);
        accountsListMemory.push(data);

        const result = {
          ok: true,
          status: 200,
        };
        resolve(result);
      } catch (error) {
        resolve(error);
      }
    });
  }

  /**
   * 登陆服务
   *
   * @param {RouterContext} ctx 路由上下文
   * @return {Promise<RespData>} 响应信息 
   * @memberof AccountsService
   */
  login(ctx: RouterContext) {
    const {
      request: { body },
    } = ctx;
    return new Promise((resolve) => {
      const wrongResp: RespData = {
        ok: false,
        status: 401,
        msg: "用户名或密码错误",
      };
      const { username, password } = body;
      const userIdx = accountsListMemory.find(
        (elem) => elem.username === username
      );
      if (!userIdx) return resolve(wrongResp);
      const { password: savedPwd } = userIdx;
      if (password !== savedPwd) return resolve(wrongResp);

      ctx.cookies.set("username", username);
      resolve({
        ok: true,
        status: 200,
        msg: "登陆成功",
      });
    });
  }
}
