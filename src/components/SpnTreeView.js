import React, { useEffect, useState, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { PanZoom } from "react-easy-panzoom";
import { Button, Modal, Form } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import issue from "../assets/images/issue.svg";
import deleteicon from "../assets/images/delete.svg";
import filter from "../assets/images/filter.svg";
import zoomin from "../assets/images/zoomin.svg";
import zoomout from "../assets/images/zoomout.svg";
import reset from "../assets/images/reset.svg";

import { SpnRightDrawer } from "./SpnRightDrawer";
import { convertCircularStructureToJson } from "../utils/convertCircularStructureToJson";
import { createGithubIssue, updateGithubIssue } from "../api/createGithubIssue";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let guid = 1;
let selectedUniqueIndex = -1;
let isPanning = -1;
const SpnTreeView = (props) => {
  const rootNode = {
    name: "",
    uniqueIndex: 0,
    childNodes: [],
    parentNode: null,
    isGithubIssue: false,
    nonGithubIssueDetail: {
      markAsDone: false,
    },
    issueDetails: {
      id: 0,
      state: "",
      number: 0,
      body: null,
      html_url: null
    },
  };
  const { currRepository } = props;
  const penzoomRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false)

  const [treeNodes, setTree] = useState(rootNode);
  const [showModal, setShowModal] = useState(false);
  const [boxText, setBoxText] = useState("");
  const [maxZoom, setMaxZoom] = useState(1);
  const [activeClass, setActiveClass] = useState(false);
  const [deleteClick, setdeleteClick] = useState(null);
  const [isChanged, setIsChanged] = useState(false)
  const [isTextEditorFocus, setIsTextEditorFocus] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [delShow, setDelShow] = useState(false);

  const deleteNodeHide = () => setDelShow(false);
  const deleteNodeShow = () => setDelShow(true);
  const [activeButton, setActiveButton] = useState(1);
  const [isOpenIssueMenu, setIssueMenuOpen] = useState(null);

  const [isActive, setIsActive] = useState(false);

  const countNodeInTrees = (node) => {
    if (node?.childNodes.length == 0) return;

    node?.childNodes.forEach(curnode => {
      guid++;
      countNodeInTrees(curnode);
    });
  }
  useEffect(() => {
    if (currRepository?.name) {
      let node = localStorage.getItem(`treedata-${currRepository?.name}`);
      if(node) {
        node = JSON.parse(node);

        guid = node?.guid;
        setTree(node?.treeNodes);
      }else {
        const rootNode = {
          name: currRepository?.name,
          uniqueIndex: 0,
          childNodes: [],
          parentNode: null,
          issueDetails: {
            id: 0,
            state: "",
            number: 0,
            body: null,
            html_url: null
          },
          isGithubIssue: false,
          nonGithubIssueDetail: {
            markAsDone: false,
          }, 
        };  
        setTree(rootNode)
        let nonCircTreeNodes = convertCircularStructureToJson({ treeNodes: rootNode });
        
        let cnt=1;
        const countNodeInTrees = (node) => {
          if (node?.childNodes.length == 0) return;
          
          node?.childNodes.forEach(curnode => {
            cnt++;
            countNodeInTrees(curnode);
          });
        }
        
        if(nonCircTreeNodes) {
          countNodeInTrees(JSON.parse(nonCircTreeNodes));
          let obj = {
            guid: cnt,
            treeNodes: JSON.parse(nonCircTreeNodes)
          }
          localStorage.setItem(`treedata-${currRepository?.name}`, JSON.stringify(obj));
        }
      }
    }
    //sendContent();
    setMaxZoom(2);
  }, [currRepository]);


  useEffect(() => {
    if (currRepository?.name) {
      let nonCircTreeNodes = convertCircularStructureToJson({ treeNodes });
      let cnt = 1;
      const countNodeInTrees = (node) => {
        if (node?.childNodes.length == 0) return;

        node?.childNodes.forEach(curnode => {
          cnt++;
          countNodeInTrees(curnode);
        });
      }

      if(nonCircTreeNodes) {
        countNodeInTrees(JSON.parse(nonCircTreeNodes));
        let obj = {
          guid: cnt,
          treeNodes: JSON.parse(nonCircTreeNodes)
        }
        localStorage.setItem(`treedata-${currRepository?.name}`, JSON.stringify(obj));
      }
    }
  }, [treeNodes])

  function handelFilter() {
    setIsActive(!isActive);
  }

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

  const onAddNode = (uniqueIndex) => {
    // setActiveClass(true)
    const newTreeNodes = { ...treeNodes };

    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === uniqueIndex) {
        node.childNodes.push({
          name: "",
          uniqueIndex: guid,
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

    guid++;
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
    // handleClick(newTreeNodes);
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

  const handleNonGithubIssue = (e, idx) => {
    const newTreeNodes = { ...treeNodes };

    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.nonGithubIssueDetail.markAsDone = e.target.checked
        setTree(newTreeNodes);
      }
    });
  };
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
          number: res?.number,
          body: res?.body,
          html_url: res?.html_url
        };
        node.isGithubIssue = true;
        setTree(newTreeNodes);
        setIssueMenuOpen(node);
      }
    });
  };

  const handleIssueMenu = (e, treeNode) => {
    e.preventDefault();
    setIssueMenuOpen(treeNode);
  }

  const handleOpenClosedIssueBtn = async (e, idx, issueState, treenode) => {
    e.preventDefault();

    let res = await updateGithubIssue({
      currRepository,
      issue_number: treenode?.issueDetails?.number,
      state: issueState,
    });

    const newTreeNodes = { ...treeNodes }

    traverseTree(newTreeNodes, (node) => {
      if (node.uniqueIndex === idx) {
        node.issueDetails = {
          id: treenode?.issueDetails?.id,
          state: issueState,
          number: treenode?.issueDetails?.number,
          body: treenode?.issueDetails?.body,
          html_url: treenode?.issueDetails?.html_url
        };
        node.isGithubIssue = true;
        setTree(newTreeNodes);
      }
    });
  }

  const updateGithubIssues = async (treenode, data) => {
    const id = treenode.uniqueIndex;

    let res = await updateGithubIssue({
      currRepository,
      issue_number: treenode?.issueDetails?.number,
      ...data
    });

    if (Object.entries(res).length != 0) {
      const newTreeNodes = { ...treeNodes };
      traverseTree(newTreeNodes, (node) => {
        if (node.uniqueIndex === id) {
          node.issueDetails = {
            id: res?.id,
            state: res?.state,
            number: res?.number,
            body: res?.body,
            html_url: res?.html_url
          };
          return true;
        }
        setTree(newTreeNodes);
        return false;
      });
      return;
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
                  {treeNode?.name}
                </div>
                <button onClick={(e) => { e.stopPropagation(); onAddNode(treeNode.uniqueIndex) }} disabled={isChanged}>
                  +
                </button>
              </div>
            }

          >
            {treeNode?.childNodes?.map((node) => renderTree(node, 1))}
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
                  as="textarea"
                  autoFocus="true"
                  placeholder="please write here.."
                  value={treeNode.name}
                  onChange={(e) => {
                    handleTextArea(e, treeNode.uniqueIndex);
                  }}
                  onBlur={() => setIsChanged(false)}
                ></Form.Control>
                {/* top_action */}
                <div className="top_action">
                  {treeNode?.isGithubIssue ? (
                    <>
                      <div
                        className="close_issue_div"
                      >
                        <div>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Close issue</Tooltip>}
                          >
                            <span> #{treeNode?.issueDetails?.number}</span>
                          </OverlayTrigger>
                        </div>
                        {treeNode?.issueDetails?.state === "closed" ? 
                          <div>
                          <p onClick={(e) => handleOpenClosedIssueBtn(e, treeNode.uniqueIndex, "open", treeNode)}>
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

                          <b onClick={(e) => handleIssueMenu(e, treeNode)}>
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
                          </div> : <div> 
                            <img src={issue} onClick={(e) => handleOpenClosedIssueBtn(e, treeNode.uniqueIndex, "closed", treeNode)} alt="issue" /><b>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={(e) => handleIssueMenu(e, treeNode)}
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
                                // value={!treeNode.nonGithubIssueDetail.markAsDone}
                                checked={treeNode?.nonGithubIssueDetail.markAsDone}
                                onChange={(e) => {
                                  handleNonGithubIssue(e, treeNode.uniqueIndex)
                                }}
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
                            handleCreateGithubIssue(treeNode.uniqueIndex, treeNode)
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
        <PanZoom
          ref={penzoomRef}
          zoomSpeed={3}
          // autoCenter={true}
          minZoom={0.3}
          maxZoom={maxZoom}
          className='penZoomCenter'
          disableKeyInteraction={isTextEditorFocus}
        >
          <div id="treeDiv">
            {renderTree(treeNodes)}
          </div>
        </PanZoom>
      </div>
      {
        isOpenIssueMenu && (<SpnRightDrawer
          treenode={isOpenIssueMenu}
          currRepository={currRepository}
          setIssueMenuOpen={setIssueMenuOpen}
          handleOpenClosedIssueBtn={handleOpenClosedIssueBtn}
          updateGithubIssues={updateGithubIssues}
        />)
      }
      <div className="msg">
        <span> GitFix is unavailable on mobiles!</span>
      </div>
    </>
  );
};
export default SpnTreeView;
