export function getLoginToGithubURL() {
  return `https://github.com/login/oauth/authorize?client_id=Ov23liEL5ohjioi0ugyx&scope=repo`;
}

export function getGithubClientID() {
  return process.env[`CLIENT_ID`];
}

export function getAppMode() {
  return window.location.host === "localhost:3000"
}