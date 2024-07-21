import SpnRepositoryMembers from "../components/SpnRepositoryMembers";
import SpnReqDescriptionView from "../components/SpnReqDescriptionView";
import SpnTopBar from "../components/SpnTopBar";
import SpnTreeModelView from "../components/SpnTreeModelView";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllRepositories } from "../api/getAllRepositories";
import { getRepositoryCollaborators } from "../api/getRepositoryCollaborators";
import { getToken } from "../utils/accessToken";

const SpnRepositoryScreen = (props) => {
  const params = useParams();
  const { id } = params;
  const [currRepository, setCurrRepository] = useState({});
  const [collaborators, setCollaborators] = useState(null);
  const [curUser, setCurUser] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/login', { replace: true })
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      setCurUser(parsedData?.data);
    }
    
    const loadRepositories = async () => {
      const res = await getAllRepositories();
      let currRepo = res.find((repo) => repo.id == id);
      setCurrRepository(currRepo);
    };
    loadRepositories();
  }, []);

  useEffect(() => {
    const loadCollaborators = async () => {
      if (currRepository?.owner?.login && currRepository?.name) {
        let collaborators = await getRepositoryCollaborators({ owner:currRepository?.owner?.login, repo:currRepository?.name});
        setCollaborators(collaborators);
        
      }
    };
    loadCollaborators();
  }, [currRepository]);

  return (
    <>
      <SpnTopBar userData={curUser}/>
      {/* The SpnTreeModelView takes all the screen and is centered, the tree view width shuld be 100% but the CLI should be about 50% or leff */}
      <SpnTreeModelView currRepository={currRepository}/>
      {/* Members view should be at the left side to the CLI and the bottom */}
      {collaborators && <SpnRepositoryMembers collaborators={collaborators} />}
      {/* Req description   view should be at the right side to the CLI and the bottom */}
      {/* <SpnReqDescriptionView currRepository={currRepository} /> */}
    </>
  );
};


export default SpnRepositoryScreen;