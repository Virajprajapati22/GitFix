import { Octokit } from "@octokit/core"
import { getToken } from "../utils/accessToken"
import { getContentOfRepository } from "./getContentOfRepository"
import { getEmailOfAuthUser } from "./getEmailOfAuthUser"
    const FILE_PATH = 'treeNode.txt'

export const postContentToRepository = async ({currRepository, user, base64Content}) => {

    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: getToken()
        })
        let response, res;

        response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: currRepository?.owner?.login,
            repo: currRepository?.name,
            path: FILE_PATH,
            message: `Commit from Spander by ${user?.login}`,
            content: `${base64Content}`,
        })
        if (!response) {
            reject(new Error("Error!"))
        }
        resolve(response)
    })
}

export const updatContent = ({currRepository, user, base64Content, sHA}) => {
    return new Promise(async (resolve, reject) => {
        const octokit = new Octokit({
            auth: getToken()
        })
        let response = null;
        let userEmail = await getEmailOfAuthUser();
        const authEmail = userEmail.find(i => i?.primary == true)
        
        if(authEmail?.[0]?.email) {
            response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                path: FILE_PATH,
                message: `Commit from Spander by ${user?.login}`,
                committer: {
                    name: user?.login,
                    email: authEmail?.email
                },
                content: `${base64Content}`,
                sha: sHA
            })
        }
        
        if (!response) {
            reject(new Error("Error!"))
        }
        resolve(response)
    })
}