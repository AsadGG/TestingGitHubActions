import { Injectable } from "@angular/core";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class UserService {
  User: any = {};
  accessTokenInfo: any = {};
  refreshTokenInfo: any = {};
  constructor() {}
  // use installed library jwt-decode and get user info and set it in user object
  initLogin(responseData: any) {
    let accessTokenDecoded = this.getDecodedToken(
      responseData.body.token.accessToken
    );
    let refreshTokenDecoded = this.getDecodedToken(
      responseData.body.token.refreshToken
    );

    this.accessTokenInfo = accessTokenDecoded;
    this.refreshTokenInfo = refreshTokenDecoded;

    localStorage.setItem("access_token", responseData.body.token.accessToken);
    localStorage.setItem("refresh_token", responseData.body.token.refreshToken);
    localStorage.setItem("expires_in", refreshTokenDecoded.exp);
    localStorage.setItem(
      "refreshTokenDecoded",
      JSON.stringify(this.refreshTokenInfo)
    );
    localStorage.setItem(
      "accessTokenDecoded",
      JSON.stringify(this.accessTokenInfo)
    );

    this.User = {
      username: accessTokenDecoded.username,
      userId: accessTokenDecoded.userId,
    };
  }

  isAuthenticated(): boolean {
    let accessToken = localStorage.getItem("access_token");
    if (!!accessToken) {
      let accessTokenDecoded = this.getDecodedToken(accessToken);
      this.User = {
        username: accessTokenDecoded.username,
        userId: accessTokenDecoded.userId,
      };
    }
    return !!accessToken;
  }

  private getDecodedToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      console.log(Error);
      return null;
    }
  }
}
