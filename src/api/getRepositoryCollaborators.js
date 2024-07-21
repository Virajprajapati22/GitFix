import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";

export const getRepositoryCollaborators = async (props) => {
  try {
    const octokit = new Octokit({
      auth: `token ${getToken()}`,
    });

    if (props?.owner && props?.repo) {
      const response = await octokit.rest.repos.listCollaborators({
        owner: props?.owner,
        repo: props?.repo,
      });

      if (!response) {
        throw new Error("Error has occurred while fetching");
      }

      return response.data;
    } else {
      throw new Error("Owner and repo parameters are required");
    }
  } catch (error) {
    // Handle error appropriately
    console.error(error);
    throw error;
  }
};
