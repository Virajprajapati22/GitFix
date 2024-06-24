import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";
import logoutHandler from "../utils/logoutHandler";

export const getAllRepositories = () => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });
    try{
      const allRepos = await octokit.request("GET /user/repos", {
        sort: 'created',
        direction: 'asc',
        per_page: 1000,
      });
      if (!allRepos) {
        reject(new Error("Error!"));
      }
  
      resolve(allRepos?.data);
    }catch(err){
      if(err.status ==401){
        logoutHandler()
      }
    }
  });
};
