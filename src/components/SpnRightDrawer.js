import React, { useEffect, useState } from "react";
import close from "../assets/images/closseicon.svg";
import edit from "../assets/images/editicon.svg";
import issue from "../assets/images/issue.svg";
import closeissue from "../assets/images/close-issue.svg";
import closseicon from "../assets/images/closseiconwhite.svg";
import readmeicon from "../assets/images/readmeicon.svg";
import Root from "./rightdrawer/Root"
import { getGithubIssue } from "../api/createGithubIssue";
import { createIssueComment, getIssueComments } from "../api/issueComments";

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
  const [commentsFound, setCommentsFound] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    setBodyText(treenode?.issueDetails?.body);

    async function func() {
      try {
        const res = await getIssueComments({currRepository, issue_number: treenode?.issueDetails?.number});
        let tempComments = res?.data;
        if (Array.isArray(tempComments) && tempComments?.length > 0) {
          tempComments = tempComments?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setComments(tempComments);
          setCommentsFound(true);
        }else {
          setCommentsFound(false);
        }
      }catch(err) {
        console.log("NO COMMENTS");
        setCommentsFound(false);
      }

    }
    func();
  }, [treenode])

  const handleNewComment = async (e) => {
    e.preventDefault();

    const res = await createIssueComment({ currRepository, issue_number: treenode?.issueDetails?.number, body: newComment })
    let currComent = [...comments, res?.data];
    setComments(currComent);
    setCommentsFound(true);
    setNewComment()
  }
  return (
    <>
      <div
        className="SpnRightDrawer_wrapper active"
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
            <div><b> Issue Title: </b></div>
            <h1> {treenode?.name} </h1>
            <hr style={{ border: "2px solid black", opacity: 0.55 }} />
            <div className="texteditor_box">
              <label> <b>Description: </b></label>
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

            <hr style={{ border: "2px solid black", opacity: 0.55 }} />

            <div> <b>Comments:</b> </div>

            {commentsFound ? (
              <>
              {Array.isArray(comments) && comments.map((comment, index) => {
                const date = new Date(comment?.created_at);
                // Extract components
                const year = date.getFullYear();
                const month = date.toLocaleString('en-US', { month: 'long' }); // Long month name
                const day = date.getDate();
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0'); // Pad single digit minutes
                const seconds = date.getSeconds().toString().padStart(2, '0'); // Pad single digit seconds
                const timeZone = date.toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ')[2]; // Extract time zone

                // Format the date and time
                const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds} ${timeZone}`;

                return (
                  <div class="card" style={{marginBottom: "4px"}}>
                    <div class="card-header">
                      <b style={{ fontSize: "13px" }}> {comment?.author_association == "OWNER" ? "Me" : comment?.author_association}</b> {" Commented at"} <p style={{ color: "#acadac", fontSize: "10px"}}> {formattedDate} </p>
                    </div>
                    <div class="card-body">
                      <blockquote class="blockquote mb-0">
                        <p> {comment?.body} </p>
                        {/* <footer class="blockquote-footer">Someone famous in <cite title="Source Title">Source Title</cite></footer> */}
                      </blockquote>
                    </div>
                  </div>
                )
              })}
              </>
            ) : (
              <div class="card">
                <div class="card-header">
                  No Comments Found !
                </div>
              </div>
            )}

            <hr style={{ border: "2px solid black", opacity: 0.55 }} />

            <div className="texteditor_box">
              <label> <b>New comment: </b></label>
              <textarea placeholder="Leave a comment"
                onChange={(e) => {
                  e.preventDefault();
                  setNewComment(e.target.value);
                }}
                value={newComment}
              ></textarea>
            </div>
            <button type="button" class="btn btn-primary" onClick={handleNewComment}>Add Comment</button>
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
