// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

const baseURL = 'http://localhost:8080/api/';
export const environment = {
  production: false,
  envName: 'dev', // 开发环境
  apiURL: {
    test: baseURL + 'abort/detail',
  },
  textDate: {  // TODO
    START: '2018-08-17 05:04:10',  // TODO 1534453450000
    STR1: '2018-08-21 09:44:02',
    STR2: '2018-08-25 14:23:54',
    END: '2018-08-29 19:03:46',  // TODO 1535540626000  362392000
  }
};
