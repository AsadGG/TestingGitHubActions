// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

let protocol = "http";
let domain = "192.3.163.18";
let port = "4300";

export const environment = {
  production: false,
  baseUrl: `${protocol}://${domain}:${port}/api/`,
};
