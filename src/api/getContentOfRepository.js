import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";
const FILE_PATH = 'treeNode.txt'

export const getContentOfRepository = async ({ currRepository }) => {
    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: `Bearer ${getToken()}`
        });

        try {
            const response = await octokit.rest.repos.getContent({
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                path: FILE_PATH
            });

            if (!response) {
                reject(new Error('Error in Repository content fetching!'));
            } else {
                resolve(response.data);
            }
        } catch (err) {
            console.error(err);
            reject(err);
        }
    });
};
