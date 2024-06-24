import React, { useEffect, useState } from "react";
import close from "../assets/images/closseicon.svg";
import edit from "../assets/images/editicon.svg";
import issue from "../assets/images/issue.svg";
import closeissue from "../assets/images/close-issue.svg";
import closseicon from "../assets/images/closseiconwhite.svg";
import Root from "./rightdrawer/Root"
import { getGithubIssue } from "../api/createGithubIssue";

export const SpnRightDrawer = ({
  isActive,
  createIssue,
  handleCloseRightIssueTab,
  currRepository,
  activeClass,
  updateGithubIssues = () => { },
  handleClick = () => { },
}) => {

  console.log(createIssue, "[][][][][][][][][][][][][][]");

  const [bodyText, setBodyText] = useState("");
  const [issueState, setIssueState] = useState(isActive);

  // update the issue state --- open or close
  useEffect(() => {

    getGithubIssue({ currRepository: currRepository, issue_number: createIssue?.node?.issueDetails?.number }).then(res => {
      setBodyText(res?.data?.body)
    })
    createIssue?.node?.issueDetails?.state == "closed" ? setIssueState(true) : setIssueState(false)
    setBodyText(createIssue?.node?.issueDetails?.body)

  }, [createIssue])

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

          {activeClass && <Root currRepository={currRepository} handleCloseRightIssueTab={handleCloseRightIssueTab} />}

          {/*  have content */}

          <div className="Drawe_header">
            <div className="left">
              <span className={!issueState ? "issue_btn open" : "issue_btn close"}>
                {" "}
                {!issueState ? <> <img src={issue} alt="issue" /> <i> Open</i> </> : <> <img src={closseicon} alt="issue" /> <i> Closed </i> </>}
              </span>
              <span> #{createIssue?.node?.issueDetails?.number} </span>
            </div>
            <div className="right">
              <button>
                {" "}
                <a href={createIssue?.node?.issueDetails?.html_url} target="_blank">
                  <img src={edit} alt="edit" />{" "}
                </a>
              </button>
              <button>
                {" "}
                <img
                  src={close}
                  alt="close"
                  onClick={() => { handleCloseRightIssueTab(); handleClick() }}
                />{" "}
              </button>
            </div>
          </div>
          <div className="Drawe_body">
            <h1> {createIssue?.node?.name} </h1>
            <div className="texteditor_box">
              <label> Description </label>
              <textarea placeholder="Leave a comment"
                onChange={(e) => setBodyText(e.target.value)}
                value={bodyText}
              ></textarea>
            </div>
            <div className="action_row">
              <button className="close_issue" onClick={() => { setIssueState(!issueState); updateGithubIssues({ state: (createIssue?.node?.issueDetails?.state == 'closed' ? "open" : "closed"), issue_number: createIssue?.node?.issueDetails?.number, id: createIssue?.id }) }}>
                {!issueState ? <> <img src={closeissue} alt="closeissue" />
                  <span> Close issue </span></> : <> <img src={closeissue} alt="openissue" />
                  <span> Open issue </span></>}
              </button>
              <button
                className="update_comment"
                onClick={() => {
                  updateGithubIssues({ body: bodyText, issue_number: createIssue?.node?.issueDetails?.number, id: createIssue?.id });
                  handleCloseRightIssueTab();
                  handleClick()
                }}
              >
                Update comment
              </button>
            </div>
            <p className="additional">
              {" "}
              for additional editing option{" "}
              <a href={createIssue?.node?.issueDetails?.html_url} target="_blank"> open this issue on github</a>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
