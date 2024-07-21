import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";

export const createGithubIssue = async ({ currRepository, title, body }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
      const response = await octokit.rest.issues.create({
        owner: currRepository?.owner?.login,
        repo: currRepository?.name,
        title,
        body,
        labels: ["DEV"],
      });

      if (!response) {
        reject(new Error("Error creating issue!"));
      } else {
        resolve(response.data);
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

export const updateGithubIssue = async ({ currRepository, issue_number, ...updatedBody }) => {

  console.log(issue_number, updatedBody, "HELLO");
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
      const response = await octokit.rest.issues.update({
        owner: currRepository?.owner?.login,
        repo: currRepository?.name,
        issue_number,
        ...updatedBody,
      });

      if (!response) {
        reject(new Error("Error updating issue!"));
      } else {
        resolve(response.data);
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

export const getGithubIssue = async ({ currRepository, issue_number }) => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
      const response = await octokit.rest.issues.get({
        owner: currRepository?.owner?.login,
        repo: currRepository?.name,
        issue_number,
      });

      if (!response) {
        reject(new Error("Error fetching issue!"));
      } else {
        resolve(response.data);
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
