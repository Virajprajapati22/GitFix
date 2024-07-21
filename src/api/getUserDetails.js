import { Octokit } from "@octokit/rest";
import { getToken } from "../utils/accessToken";
import logoutHandler from "../utils/logoutHandler";

export const getUserDetails = async () => {
    try {
        const octokit = new Octokit({
            auth: `Bearer ${getToken()}`
        });

        const userData = await octokit.rest.users.getAuthenticated();

        if (!userData) {
            throw new Error("Error!"); // Use throw to handle the error
        }

        return userData.data;
    } catch (err) {
        console.log(err, "ERR");
        if (err.status === 401) {
            logoutHandler();
        } else if (err.status === 403 && err.message.includes("API rate limit exceeded")) {
            console.error("API rate limit exceeded. Please try again later.");
        } else {
            throw err; // Reject the promise with the caught error
        }
    }
};
