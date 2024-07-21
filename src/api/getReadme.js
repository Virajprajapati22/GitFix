import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const getReadmeDetails = ({ currRepository }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
      let response = await octokit.request("GET /repos/{owner}/{repo}/readme", {
        owner: currRepository?.owner?.login,
        repo: currRepository?.name,
        headers: {
          accept: 'application/vnd.github.html+json'
        }
      });

      resolve(response);
    } catch (error) {
      if (error.status === 404) {
        reject(new Error("README file not found in the repository!"));
      } else {
        reject(new Error("Error in Repository content fetching!"));
      }
    }
  });
};
