import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";
import logoutHandler from "../utils/logoutHandler";

export const getAllRepositories = () => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `token ${getToken()}`, // Use your access token here
    });
    try {
      const allRepos = await octokit.rest.repos.listForAuthenticatedUser({
        visibility: "all",
      });
      if (!allRepos) {
        reject(new Error("Error fetching repositories"));
      }

      resolve(allRepos.data);
    } catch (err) {
      if (err.status === 401) {
        logoutHandler(); // Handle logout or reauthentication logic
      }
      reject(err);
    }
  });
};
