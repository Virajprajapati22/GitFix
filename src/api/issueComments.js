import { Octokit } from "@octokit/core";
import { getToken } from "../utils/accessToken";

export const getIssueComments = ({ currRepository, issue_number }) => {
    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: `Bearer ${getToken()}`,
        });

        try {
            let response = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                issue_number: issue_number,
            })

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

export const createIssueComment = ({ currRepository, issue_number, body }) => {
    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: `Bearer ${getToken()}`,
        });

        try {
            let response = await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                issue_number: issue_number,
                body: body
            })

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
