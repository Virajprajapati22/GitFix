import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";

export const getEmailOfAuthUser = async () => {
  return new Promise(async (resolve, reject) => {
    const octokit = new Octokit({
      auth: `Bearer ${getToken()}`,
    });

    try {
        const userEmail = await octokit.rest.users.listPublicEmailsForAuthenticatedUser({
        visibility: 'all'
      });

      if (!userEmail) {
        reject(new Error("Error fetching user email!"));
      } else {
        resolve(userEmail.data);
      }
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
