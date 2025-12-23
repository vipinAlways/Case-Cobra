import {handleAuth} from "@kinde-oss/kinde-auth-nextjs/server";
export const GET = handleAuth({
    async postLoginRedirectURL() {
        return "/auth-callback"; 
      },
      async postSignupRedirectURL() {
        return "/auth-callback"; 
      },
});
