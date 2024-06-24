import React, { useEffect, useState, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { PanZoom } from "react-easy-panzoom";
import { Button, Modal, FloatingLabel, Form, Row } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import close from "../assets/images/close.svg";
import edit from "../assets/images/edit.svg";
import trash from "../assets/images/trash.svg";
import menu from "../assets/images/menu.svg";
import issue from "../assets/images/issue.svg";
import deleteicon from "../assets/images/delete.svg";
import filter from "../assets/images/filter.svg";
import zoomin from "../assets/images/zoomin.svg";
import zoomout from "../assets/images/zoomout.svg";
import reset from "../assets/images/reset.svg";

import { SpnRightDrawer } from "./SpnRightDrawer";
import { getContentOfRepository } from "../api/getContentOfRepository";
import {
  postContentToRepository,
  updatContent,
} from "../api/postContentsToRepository";
import { getUserDetails } from "../api/getUserDetails";
import { Base64 } from "js-base64";
import { convertCircularStructureToJson } from "../utils/convertCircularStructureToJson";
import { createGithubIssue, updateGithubIssue } from "../api/createGithubIssue";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";

let guid = 0;
let selectedUniqueIndex = -1;
let isPanning = -1;
const SpnTreeView = (props) => {
  const { currRepository } = props;
  const penzoomRef = useRef(null);
  const [currRepo, setCurrRepo] = useState({});
  const [isDragging, setIsDragging] = useState(false)
  const [currentRepoUpdated, setCurrentRepoUpdated] = useState(false)
  const [user, setUser] = useState(null);
  const [repoContent, setRepoContent] = useState({});

  console.log(currRepository, "CURR REPOSITORY");

  const rootNode = {
    name: "",
    uniqueIndex: 0,
    childNodes: [],
    parentNode: null,
    isGithubIssue: false,
    nonGithubIssueDetail: {
      markAsDone: false,
    },
    issueDetails: {},
  };
  const [treeNodes, setTree] = useState(rootNode);
  const [showModal, setShowModal] = useState(false);
  const [boxText, setBoxText] = useState("");
  const [maxZoom, setMaxZoom] = useState(1);
  const [currSelectedIdx, setCurrSelectedIdx] = useState(0);
  const [githubIssue, setGithubIssue] = useState(false);
  const [createIssue, setIssue] = useState({
    id: 0,
    node: {},
  });
  const [activeClass, setActiveClass] = useState(false);
  const [deleteClick, setdeleteClick] = useState(null);
  const [isChanged, setIsChanged] = useState(false)
  const [treeIsLoading, setTreeIsLoading] = useState(true);
  const [isTextEditorFocus, setIsTextEditorFocus] = useState(false)
  const state = useSelector(
    (state) => state.loginUserDetailsSlice.loginUserDetails
  );

  // useEffect(() => {
  //   if (penzoomRef.current) {
  //     const panZoom = penzoomRef.current.getApi();
  //     const container = panZoom.getContainer();
  //     const content = container.querySelector('.content'); // replace with your content selector

  //     // calculate the zoom level required to fit the content in the container
  //     const contentWidth = content.offsetWidth;
  //     const contentHeight = content.offsetHeight;
  //     const containerWidth = container.offsetWidth;
  //     const containerHeight = container.offsetHeight;
  //     const zoom = Math.min(containerWidth / contentWidth, containerHeight / contentHeight);

  //     console.log(zoom, "[ZOOM]");

  //     // zoom to fit the content
  //     panZoom.fitSelection(content, {
  //       animate: true,
  //       contain: true,
  //       zoom: zoom,
  //     });
  //   }
  // }, [])

  // useEffect(() => {
  //   penzoomRef?.current?.autoCenter(0.1)
  //   penzoomRef?.current?.moveByRatio(window?.scrollX + 25, window?.scrollY + 2)
  // })

  const getUser = async () => {
    // let userData = await getUserDetails();
    setUser(state.userData);
  };

  const getContent = async () => {
    try {
      const res = await getContentOfRepository({ currRepository });
      setRepoContent(res?.data)
      setCurrentRepoUpdated(true)
      setTreeIsLoading(false)
    } catch (err) {
      console.log(err, "ERR")
    }
  }

  const sendContent = async () => {
    const rootNode = {
      name: currRepository?.name,
      uniqueIndex: 0,
      childNodes: [],
      parentNode: null,
      issueDetails: {},
      isGithubIssue: false,
      nonGithubIssueDetail: {
        markAsDone: false,
      },
    };

    let response;
    const data = convertCircularStructureToJson({ treeNodes: rootNode });
    try {
      if (Object.entries(repoContent).length == 0) {

        response = await postContentToRepository({
          currRepository,
          user,
          base64Content: Base64.encode(data),
        });
      }
      if (response) {
        const res = await getContentOfRepository({ currRepository });
        setRepoContent(res?.data)
        setTreeIsLoading(false)
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    guid = 0;
    const rootNode = {
      name: currRepository?.name,
      uniqueIndex: 0,
      childNodes: [],
      parentNode: null,
      issueDetails: {},
      isGithubIssue: false,
      nonGithubIssueDetail: {
        markAsDone: false,
      },
    };
    setTree(rootNode);

    setCurrRepo(currRepository);
    getUser();
    if (currRepository?.name && !currentRepoUpdated) {
      getContent();
    }
    if (currRepository?.name && repoContent?.sha?.length > 0) {
      sendContent();
    }
    // setTree(rootNode);

    //sendContent();
    setMaxZoom(2);
  }, [currRepository]);

  // useEffect(() => {
  //   setCurrRepo(currRepository);
  //   let getUser = async () => {
  //     let userData = await getUserDetails();
  //     setUser(userData);
  //   };
  //   getUser();
  // }, [currRepository, ]);


  // useEffect(() => {
  //   const fetch = async ()=>{
  //       try{
  //           const res = await getContentOfRepository({ currRepository });
  //           setRepoContent(res?.data)
  //           currentRepoUpdated = true
  //       }catch(err){
  //           console.log(err, "ERR")
  //       }
  //   }
  //   if(currRepository && !currentRepoUpdated){
  //       fetch();
  //   }
  // }, [currRepository])


  // useEffect(() => {
  //   guid = 0;

  //   // setTree(rootNode);
  //   const sendContent = async () => {
  //       const rootNode = {
  //           name: currRepository?.name,
  //           uniqueIndex: 0,
  //           childNodes: [],
  //           parentNode: null,
  //           issueDetails: {},
  //           isGithubIssue: false,
  //           nonGithubIssueDetail: {
  //             markAsDone: false,
  //           },
  //         };

  //     let response;
  //     const data = convertCircularStructureToJson({ treeNodes : rootNode });
  //     try {
  //       if(Object.entries(repoContent).length == 0) {

  //           response = await postContentToRepository({
  //               currRepository,
  //               user,
  //               base64Content: Base64.encode(data),
  //           });
  //       }
  //       if(response){
  //           const res = await getContentOfRepository({ currRepository });
  //           setRepoContent(res?.data)
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   sendContent();
  //   setMaxZoom(2);
  // }, [currRepository]);

  const handleClick = async (nodes) => {

    if (repoContent?.sha != "") {
      const data = convertCircularStructureToJson({ treeNodes: nodes ?? treeNodes });

      toast("Saving...", {
        position: toast.POSITION.BOTTOM_RIGHT,
        theme: "dark",
        autoClose: 100
        // hideProgressBar: true,
      });

      const updatedRes = await updatContent({
        currRepository,
        user,
        base64Content: Base64.encode(data),
        sHA: repoContent?.sha,
      });

      if (updatedRes) {
        toast("SAVED TO GITHUB!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          theme: "dark",
          hideProgressBar: true,
        });
      }
      const res = await getContentOfRepository({ currRepository });
      setRepoContent(res?.data)


    }
    setIsChanged(false)
  };

  useEffect(() => {
    if (Object.entries(repoContent).length != 0) {
      let treeContentBase64 = repoContent?.content;
      const treeContentParsed = treeContentBase64 && JSON.parse(Base64.decode(treeContentBase64));
      setTree(treeContentParsed);
    }
  }, [repoContent, user]);

  useEffect(() => {
    if (currSelectedIdx != 0) {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === currSelectedIdx) {
          node.name = boxText;
          setTree(newTreeNodes);
        }
      });
    }
  }, [currSelectedIdx]);

  const [activeButton, setActiveButton] = useState(1);

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  const [isActive, setIsActive] = useState(false);
  function handelFilter() {
    setIsActive(!isActive);
  }

  const [isChecked, setIsChecked] = useState(false);
  function handleCheckboxChange(event, idx) {
    setIsChecked(event.target.checked);

    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.nonGithubIssueDetail = {
          markAsDone: event?.target?.checked,
        };
        setTree(newTreeNodes);
      }
    });
  }

  const [delShow, setDelShow] = useState(false);

  const deleteNodeHide = () => setDelShow(false);
  const deleteNodeShow = () => setDelShow(true);
  useEffect(() => {
    /*
        document.addEventListener('pointermove',()=>{
          isPanning = true;
          console.log("move");
        });
        */
  }, []);

  const traverseTree = (node, callback) => {
    // if callback returns 'false' then
    // the function continues looping
    // otherwise 'true' will stop the loop
    // the node is passed to the custom callback
    if (callback(node)) {
      return;
    }
    // loop through all the child nodes
    node.childNodes.forEach((childNode) => {
      traverseTree(childNode, callback);
    });
  };

  let keys = new Set();
  const getUniqueKey = () => {
    let key
    key = Math.floor(Math.random() * (1000 - 1) + 1);
    if (keys.has(key)) {
      key = getUniqueKey()
    }
    keys.add(key)

    return key;
  }

  const onAddNode = (uniqueIndex) => {
    // setActiveClass(true)
    const newTreeNodes = { ...treeNodes };

    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === uniqueIndex) {
        node.childNodes.push({
          name: "",
          uniqueIndex: getUniqueKey(),
          childNodes: [],
          parentNode: node,
          nonGithubIssueDetail: {
            markAsDone: false,
          },
          isGithubIssue: false,
          issueDetails: {},
        });
        setTree(newTreeNodes);
        return true;
      }
      return false;
    });
  };
  const onSetNodeText = (e, uniqueIndex) => {
    if (isPanning === 2) {
      isPanning = -1;
      return;
    }
    if (e === "updateNodeText") {
      setShowModal(false);
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === selectedUniqueIndex) {
          node.name = boxText;
          setTree(newTreeNodes);
          return true;
        }
        return false;
      });
      return;
    }
    if (e.target instanceof HTMLDivElement) {
      selectedUniqueIndex = uniqueIndex;
      traverseTree(treeNodes, (node) => {
        if (node.uniqueIndex === uniqueIndex) {
          setBoxText(node.name);
          setShowModal(true);
          return true;
        }
        return false;
      });
    }
  };
  const touchEvents = (treeNode) => {
    return {
      onTouchStart: (e) => handleTouchEvents(e, 1),
      onTouchMove: (e) => handleTouchEvents(e, 2),
      onTouchEnd: (e) => handleTouchEvents(e, 3),
      onMouseDown: (e) => handleTouchEvents(e, 1),
      onMouseMove: (e) => handleTouchEvents(e, 2),
      onMouseUp: (e) => handleTouchEvents(e, 3, treeNode),
    };
  };
  const handleTouchEvents = (event, type, treeNode) => {
    if (type === 3) {
      //setTimeout(()=>{ isPanning=-1; },1000);
      if (isPanning === 1) {
        onSetNodeText(event, treeNode.uniqueIndex, treeNode.name);
      }
      if (!(isPanning == 2)) {
        setIsDragging(false)
      }
      isPanning = -1;
    }
    if (type === 1) isPanning = 1;
    else if (type === 2 && isPanning === 1) {
      isPanning = 2
      setIsDragging(true)
    };
  };
  const handleDeleteNode = () => {

    const deletedNodeId = deleteClick.uniqueIndex;
    const newTreeNodes = { ...treeNodes };

    // Find the node with the specific uniqueIndex in the tree
    traverseTree(newTreeNodes, (node) => {
      // Node found
      if (node.childNodes.find(i => i?.uniqueIndex === deletedNodeId)) {

        // Go to the parent node of node and find index in childNode array
        // Delete the node from the childNodes of the parent (thus removing itself from the tree)
        node.childNodes = node.childNodes.filter((i) => i.uniqueIndex !== deletedNodeId);
        setTree(newTreeNodes);
        return true;
      }
      return false;
    });
    deleteNodeHide();
    handleClick(newTreeNodes);
  };
  const handleTextArea = (e, idx) => {
    setBoxText(e.target.value);
    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        setIsChanged(isChanged || (node.name !== e.target.value))
        node.name = e.target.value;
        setTree(newTreeNodes);
      }
    });
  };
  const handleMenuNode = () => { };


  function handleZoomIn() {
    if (penzoomRef.current) {
      penzoomRef.current.zoomIn();
    }
  }

  function handleZoomOut() {
    if (penzoomRef.current) {
      penzoomRef.current.zoomOut();
    }
  }

  function handleResetZoom() {
    if (penzoomRef.current) {
      penzoomRef.current.reset();
      // penzoomRef.current.autoCenter();
    }
  }

  const handleCreateGithubIssue = async (idx, treenode) => {
    if ((treenode.name == "", Object.entries(currRepository).length == 0)) {
      return false;
    }

    const res = await createGithubIssue({
      currRepository,
      title: treenode?.name,
      body: "",
    });

    const newTreeNodes = { ...treeNodes };
    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.issueDetails = {
          id: res?.data?.id,
          state: isChecked ? "closed" : "open",
          number: res?.data?.number,
          body: res?.data?.body,
          html_url: res?.data?.html_url
        };
        node.isGithubIssue = true;
        setTree(newTreeNodes);
      }
    });

    setIssue({
      id: idx,
      node: {
        ...treenode,
        issueDetails: {
          ...treenode.issueDetails,
          state: isChecked ? "closed" : "open",
          number: res?.data?.number
        }
      },
    });
    setIsChecked(false)
  };

  function handleCloseRightIssueTab() {
    setGithubIssue(false);
    setActiveClass(false);
  }

  const updateGithubIssues = async (updatedBody) => {
    setGithubIssue(true);
    if (
      Object.entries(updatedBody).length == 0 ||
      Object.entries(currRepository).length == 0
    ) {
      return false;
    }
    const id = updatedBody?.id;
    delete updatedBody?.id;

    let res = await updateGithubIssue({
      currRepository,
      ...updatedBody,
    });

    if (Object.entries(res?.data).length != 0) {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === id) {
          node.issueDetails = {
            id: res?.data?.id,
            state: updatedBody?.state ?? res?.data?.state,
            number: res?.data?.number,
            body: res?.data?.body,
            html_url: res?.data?.html_url
          };
          return true;
        }
        setTree(newTreeNodes);
        return false;
      });
      return;
    }
  };

  const renderTree = (treeNode, level) => {
    return (
      <>
        {!level ? (
          <Tree
            lineWidth={"2px"}
            lineColor={"#ADB5BD"}
            nodePadding={"10px"}
            lineBorderRadius={"5px"}
            label={
              <div className="tree_levels root" {...touchEvents(treeNode)} onClick={() => {
                if (!isDragging) setActiveClass(true)
              }}>
                <div
                  className="tree_description_text"
                >
                  {treeNode.name}
                </div>
                <button onClick={(e) => { e.stopPropagation(); onAddNode(treeNode.uniqueIndex) }} disabled={isChanged}>
                  +
                </button>
              </div>
            }

          >
            {treeNode.childNodes.map((node) => renderTree(node, 1))}
          </Tree>
        ) : (
          <TreeNode
            key={treeNode.uniqueIndex}
            label={
              <div
                {...touchEvents(treeNode)}
                className={`tree_levels level${((level - 1) % 5) + 1}`}
              >
                <Form.Control
                  id="defaultTexteditor"
                  onChange={(e) => {
                    handleTextArea(e, treeNode.uniqueIndex);
                    setCurrSelectedIdx(treeNode.uniqueIndex);
                  }}
                  value={treeNode?.name}
                  onBlur={() => {
                    if (isChanged) {
                      handleClick()
                    }
                    setIsTextEditorFocus(false)
                  }}
                  onClick={() => setIsTextEditorFocus(true)}
                  as="textarea"
                  autoFocus="true"
                  placeholder="please write here.."
                ></Form.Control>
                {/* top_action */}
                <div className="top_action">
                  {treeNode?.isGithubIssue ? (
                    <>
                      <div
                        className="close_issue_div"
                        onClick={() => {
                          setGithubIssue(true);
                          setIssue({
                            id: treeNode?.uniqueIndex,
                            node: treeNode,
                          });
                        }}
                      >
                        <div>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Close issue</Tooltip>}
                          >
                            <span> #{treeNode?.issueDetails?.number}</span>
                          </OverlayTrigger>
                        </div>
                        {treeNode?.issueDetails?.state === "closed" ? <div>
                          <p>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M8 14C4.68629 14 2 11.3137 2 8V8C2 4.68629 4.68629 2 8 2V2C11.3137 2 14 4.68629 14 8V8C14 11.3137 11.3137 14 8 14V14Z"
                                fill="#6610F2"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M7.5 9.5L6 8"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M10 7L7.5 9.5"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </p>

                          <b>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M3.66508 7.99998H12.3351"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M3.66508 10.6677H12.3351"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M3.66486 5.33225H12.3349"
                                stroke="#F8F9FA"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </b>
                        </div> : <div> <img src={issue} alt="issue" /><b>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M3.66508 7.99998H12.3351"
                              stroke="#F8F9FA"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M3.66508 10.6677H12.3351"
                              stroke="#F8F9FA"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M3.66486 5.33225H12.3349"
                              stroke="#F8F9FA"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </b> </div>}
                      </div>
                    </>
                  ) : (
                    <>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>
                            {" "}
                            {isChecked
                              ? " Mark as not done"
                              : "Mark as done"}{" "}
                          </Tooltip>
                        }
                      >
                        <div
                          className="check_box"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          data-bs-tooltip="Tooltip text"
                        >
                          <label className="custom-checkbox">
                            <input
                              type="checkbox"
                              checked={
                                treeNode?.nonGithubIssueDetail?.markAsDone
                              }
                              onChange={(event) => {
                                handleCheckboxChange(
                                  event,
                                  treeNode.uniqueIndex
                                );
                                handleClick()
                              }
                              }
                            />
                            <span className="checkmark"></span>
                          </label>
                        </div>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Convert to issue</Tooltip>}
                      >
                        <div
                          className="convert_to_issue"
                          onClick={() => {
                            handleCreateGithubIssue(
                              treeNode.uniqueIndex,
                              treeNode
                            );
                            setGithubIssue(true);
                          }}
                        >
                          <img src={issue} alt="issue" />
                        </div>
                      </OverlayTrigger>

                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete</Tooltip>}
                      >
                        <div className="top_delete" onClick={() => { setdeleteClick(treeNode); deleteNodeShow() }}>
                          <img src={deleteicon} alt="issue" />
                        </div>
                      </OverlayTrigger>
                    </>
                  )}
                  <Modal show={delShow} onHide={deleteNodeHide}>
                    <Modal.Header closeButton>
                      <Modal.Title>Delete node</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      DELETE will also remove all the sub nodes are you sure you
                      want to continue?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={deleteNodeHide}>
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          handleDeleteNode();
                        }}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
                {/* <div className='actions' id={treeNode.uniqueIndex} >
                        <span onClick={() => handleDeleteNode(treeNode.uniqueIndex)}> <img src={trash} alt="trash" /> </span>
                        <span onClick={handleMenuNode}> <img src={menu} alt="menu" /> </span>
                    </div> */}
                <button
                  id="addNode"
                  onClick={(e) => onAddNode(treeNode.uniqueIndex)}
                  disabled={isChanged}
                >
                  +
                </button>
              </div>
            }
          >
            {treeNode.childNodes.map((node) => renderTree(node, level + 1))}
          </TreeNode>
        )}
      </>
    );
  };

  return (
    <>
      <div className="panzoom_action">
        <div className={isActive ? "filter_panel active" : " filter_panel"}>
          <OverlayTrigger placement="top" overlay={<Tooltip>done nodes</Tooltip>}>
            <button
              className={`button ${activeButton === 1 ? "selected" : ""}`}
              onClick={() => handleButtonClick(1)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.30811 8.87746L7.77011 10.3395L10.9614 7.14746"
                  stroke="#6C757D"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.1667 14.5H3.83333C3.09667 14.5 2.5 13.9033 2.5 13.1667V3.83333C2.5 3.09667 3.09667 2.5 3.83333 2.5H13.1667C13.9033 2.5 14.5 3.09667 14.5 3.83333V13.1667C14.5 13.9033 13.9033 14.5 13.1667 14.5Z"
                  stroke="#6C757D"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>not done nodes</Tooltip>}>
            <button
              className={`button ${activeButton === 2 ? "selected" : ""}`}
              onClick={() => handleButtonClick(2)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.1667 14.5H3.83333C3.09667 14.5 2.5 13.9033 2.5 13.1667V3.83333C2.5 3.09667 3.09667 2.5 3.83333 2.5H13.1667C13.9033 2.5 14.5 3.09667 14.5 3.83333V13.1667C14.5 13.9033 13.9033 14.5 13.1667 14.5Z"
                  stroke="#6C757D"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>open issues</Tooltip>}>
            <button
              className={`button ${activeButton === 3 ? "selected" : ""}`}
              onClick={() => handleButtonClick(3)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.3855 6.61455C11.4269 7.65595 11.4269 9.34439 10.3855 10.3858C9.34414 11.4272 7.6557 11.4272 6.6143 10.3858C5.5729 9.34438 5.5729 7.65594 6.6143 6.61455C7.6557 5.57315 9.34414 5.57315 10.3855 6.61455Z"
                  fill="#6C757D"
                />
                <path
                  d="M10.3855 6.61455C11.4269 7.65595 11.4269 9.34439 10.3855 10.3858C9.34414 11.4272 7.6557 11.4272 6.6143 10.3858C5.5729 9.34438 5.5729 7.65594 6.6143 6.61455C7.6557 5.57315 9.34414 5.57315 10.3855 6.61455"
                  stroke="#6C757D"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12.7426 4.25736C15.0858 6.60051 15.0858 10.3995 12.7426 12.7426C10.3995 15.0858 6.60049 15.0858 4.25736 12.7426C1.91421 10.3995 1.91421 6.60049 4.25736 4.25736C6.60051 1.91421 10.3995 1.91421 12.7426 4.25736"
                  stroke="#6C757D"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </OverlayTrigger>

          <OverlayTrigger placement="top" overlay={<Tooltip>closed issues</Tooltip>}>
            <button
              className={`button ${activeButton === 4 ? "selected" : ""}`}
              onClick={() => handleButtonClick(4)}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.5 14.5C5.18629 14.5 2.5 11.8137 2.5 8.5C2.5 5.18629 5.18629 2.5 8.5 2.5C11.8137 2.5 14.5 5.18629 14.5 8.5C14.5 11.8137 11.8137 14.5 8.5 14.5Z"
                  fill="#6610F2"
                  stroke="#F8F9FA"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8 10L6.5 8.5"
                  stroke="#F8F9FA"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.5 7.5L8 10"
                  stroke="#F8F9FA"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </OverlayTrigger>
        </div>

        <OverlayTrigger placement="top" overlay={<Tooltip>Filters </Tooltip>}>
          <button onClick={handelFilter}>
            {" "}
            <img src={filter} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip>Zoom in</Tooltip>}>
          <button onClick={handleZoomIn}>
            {" "}
            <img src={zoomin} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger
          placement="right"
          overlay={<Tooltip> Zoom out</Tooltip>}
        >
          <button onClick={handleZoomOut}>
            {" "}
            <img src={zoomout} />
          </button>
        </OverlayTrigger>

        <OverlayTrigger placement="right" overlay={<Tooltip> Rest</Tooltip>}>
          <button onClick={handleResetZoom}>
            {" "}
            <img src={reset} />
          </button>
        </OverlayTrigger>
      </div>
      <ToastContainer />
      <div className="zoom_view_outer full_height  o-auto" id="treeNode">
        {(treeNodes && treeIsLoading) ? (
          <>
            <div className="panzoom-loader">
              <TailSpin
                height="80"
                width="80"
                color="#6610F2"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                wrapperClass=""
                visible={true}
              />
            </div>
          </>
        ) :
          (<PanZoom
            ref={penzoomRef}
            zoomSpeed={3}
            // autoCenter={true}
            minZoom={0.3}
            maxZoom={maxZoom}
            className='penZoomCenter'
            keyMapping={
              {
                // '87': { x: 0, y: -1, z: 0 },
                // '83': { x: 0, y: 1, z: 0 },
                // '65': { x: -1, y: 0, z: 0 },
                // '68': { x: 1, y: 0, z: 0 },
              }
            }
            disableKeyInteraction={isTextEditorFocus}
          >
            <div id="treeDiv">
              {renderTree(treeNodes)}
            </div>
            {/*  Add Node Modal */}
            {/* <Modal show={showModal} onHide={() => setShowModal(false)} className="add_comment_modal">
                          <Modal.Body>
                              <button className='close' onClick={() => setShowModal(false)}>
                                  <img src={close} alt="close" /></button>
                              <FloatingLabel controlId="floatingTextarea2" label="Enter title here">
                                  <Form.Control onChange={(e) => setBoxText(e.target.value)}
                                      as="textarea"
                                      placeholder=" ">
                                      {boxText}
                                  </Form.Control>
                              </FloatingLabel>
                              <div className='btns_bottom'>
                                  <Button variant="primary" onClick={() => onSetNodeText("updateNodeText")}>
                                      Save
                                  </Button>
                                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                                      Close
                                  </Button>
                              </div>
                          </Modal.Body>
                      </Modal> */}
            {/*  Edit Node Modal */}
            {/* <Modal show={editModal} onHide={() => setEditModal(false)} className="add_comment_modal">
                          <Modal.Body>
                              <button className='close' onClick={() => setEditModal(false)}>
                                  <img src={close} alt="close" /></button>
                              <FloatingLabel controlId="floatingTextarea2" >
                                  <Form.Control onChange={editTextHandler}
                                      as="textarea"
                                      placeholder=" ">
                                      {editboxText}
                                  </Form.Control>
                              </FloatingLabel>
                              <div className='btns_bottom'>
                                  <Button variant="primary" onClick={OnEditNodeText}>
                                      Edit
                                  </Button>
                                  <Button variant="secondary" onClick={() => setEditModal(false)}>
                                      Close
                                  </Button>
                              </div>
                          </Modal.Body>
                      </Modal> */}
          </PanZoom>)
        }
      </div>
      <SpnRightDrawer
        isActive={githubIssue}
        updateGithubIssues={updateGithubIssues}
        handleCloseRightIssueTab={handleCloseRightIssueTab}
        createIssue={createIssue}
        currRepository={currRepository}
        activeClass={activeClass}
        handleClick={handleClick}
      />
      <div className="msg">
        <span> Spander is unavailable on mobiles!</span>
      </div>
    </>
  );
};
export default SpnTreeView;
