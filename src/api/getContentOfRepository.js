import { Octokit } from "@octokit/core"
import { getToken } from "../utils/accessToken"
import { FILE_PATH } from "./postContentsToRepository"

export const getContentOfRepository = ({currRepository}) => {
    return new Promise(async(resolve, reject) => {
        const octokit = new Octokit({
            auth: getToken()
        })
        try{
            
            let response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: currRepository?.owner?.login,
                repo: currRepository?.name,
                path: FILE_PATH
            })
            
            if(!response){
                reject(new Error('Error in Repository content fetching!'))
            }
    
            resolve(response)
        }catch(err){}
    })
}