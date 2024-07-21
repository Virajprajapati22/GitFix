import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const addNewRepository = async ({ name, description, isPrivate }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
      const response = await octokit.request("POST /user/repos", {
        name: name,
        description: description,
        private: isPrivate,
      });

      if (!response) {
        reject(new Error("Error!"));
      }

      resolve(response);
    } catch (error) {
      reject(new Error(`Error creating repository: ${error.message}`));
    }
  });
};
