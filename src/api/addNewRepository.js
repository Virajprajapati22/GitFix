import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const addNewRepository = async ({ name, description, isPrivate }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: getToken(),
    });

    const response = await octokit.request("POST /user/repos", {
      name: name,
      description: description,
      //   homepage: "https://github.com",
      private: isPrivate,
    });

    if (!response) {
      reject(new Error("Error!"));
    }

    resolve(response);
  });
};
