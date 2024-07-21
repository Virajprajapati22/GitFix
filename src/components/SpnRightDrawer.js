import React, { useEffect, useState } from "react";
import close from "../assets/images/closseicon.svg";
import edit from "../assets/images/editicon.svg";
import issue from "../assets/images/issue.svg";
import closeissue from "../assets/images/close-issue.svg";
import closseicon from "../assets/images/closseiconwhite.svg";
import readmeicon from "../assets/images/readmeicon.svg";
import Root from "./rightdrawer/Root"
import { getGithubIssue } from "../api/createGithubIssue";

export const SpnRightDrawer = ({
  treenode,
  currRepository,
  handleOpenClosedIssueBtn = () => {},
  setIssueMenuOpen = () => {},
  updateGithubIssues = () => {},
  isActive=true,
  activeClass = true,
}) => {

  const [bodyText, setBodyText] = useState("");
  const [issueState, setIssueState] = useState(isActive);
  const [openReadME, setOpenReadME] = useState(false);

  useEffect(() => {
    setBodyText(treenode?.issueDetails?.body);
  }, [treenode])

  return (
    <>
      <div
        className={
          isActive || activeClass ? `SpnRightDrawer_wrapper active` : `SpnRightDrawer_wrapper`
        }
      >
        {/* <div className='SpnRightDrawer_wrapper active'>  */}
        <div className="drawer_backdrop"></div>
        <div className="SpnRightDrawer">
          {/*  root */}

          {openReadME && <Root
            currRepository={currRepository}
            setIssueMenuOpen={setIssueMenuOpen}
            setOpenReadME={setOpenReadME}
          />}

          {/*  have content */}

          <div className="Drawe_header">
            <div className="left">
              <span className={treenode?.issueDetails?.state ? "issue_btn open" : "issue_btn close"}>
                {" "}
                {treenode?.issueDetails?.state == "open" ? <> <img src={issue} alt="issue" /> <i> Open</i> </> : <> <img src={closseicon} alt="issue" /> <i> Closed </i> </>}
              </span>
              <span> #{treenode?.issueDetails?.number} </span>
            </div>
            <div className="right">
              <button>
                {" "}
                <a href={treenode?.issueDetails?.html_url} target="_blank">
                  <img src={edit} alt="edit" />
                </a>
              </button>
              <button>
                {" "}
                <img
                  src={readmeicon}
                  alt="readme_icon"
                  style={{
                    maxWidth: "27px"
                  }}
                  onClick={()=> setOpenReadME(true)}
                />
              </button>
             
              <button>
                {" "}
                <img
                  src={close}
                  alt="close"
                  onClick={() => { setIssueMenuOpen(null) }}
                />{" "}
              </button>
            </div>
          </div>
          <div className="Drawe_body">
            <h1> {treenode?.name} </h1>
            <div className="texteditor_box">
              <label> Description </label>
              <textarea placeholder="Leave a comment"
                onChange={(e) => {
                  e.preventDefault();
                  setBodyText(e.target.value);
                }}
                value={bodyText}
              ></textarea>
            </div>
            <div className="action_row">
              <button className="close_issue" onClick={(e) => {
                let state = "";
                if (treenode?.issueDetails?.state === "closed") {
                  state = "open"
                } else {
                  state = "closed"
                }
                handleOpenClosedIssueBtn(e, treenode.uniqueIndex, state, treenode);
                setIssueMenuOpen({
                  ...treenode,
                  issueDetails: {
                    ...treenode?.issueDetails,
                    state: state
                  }
                });
              }}>
                {!issueState ? <> <img src={closeissue} alt="closeissue" />
                  <span> Close issue </span></> : <> <img src={closeissue} alt="openissue" />
                  <span> Open issue </span></>}
              </button>
              <button
                className="update_comment"
                onClick={(e) => {
                  console.log(bodyText, "[BODY TEXT]");
                  updateGithubIssues(treenode, {body: bodyText})
                  setIssueMenuOpen({
                    ...treenode,
                    issueDetails: {
                      ...treenode?.issueDetails,
                      body: bodyText
                    }
                  });
                }}
              >
                Update comment
              </button>
            </div>
            <p className="additional">
              {" "}
              for additional editing option{" "}
              <a href={treenode?.issueDetails?.html_url} target="_blank"> open this issue on github</a>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
