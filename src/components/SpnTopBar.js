import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Dropdown } from "react-bootstrap";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import SpnDropdownMenu from "./SpnDropdownMenu";
import { useSelector } from "react-redux";
import logoutHandler from "../utils/logoutHandler";

const SpnTopBar = (props) => {

  // const { userData } = props;

  const [userData, setCurUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if(user) {
      let parsedUser = JSON.parse(user);
      setCurUser(parsedUser?.data);
    }
  }, [props])

  return (
    <>
      {["md"].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="bg-blue-100 border-0 header"
        >
          <Container fluid style={{
            maxHeight: "3em"
          }}>
            <Navbar.Brand href="/">
              {" "}
              <img src={logo} alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Navbar.Brand href="#">
                  {" "}
                  <img src={logo} alt="logo" />
                </Navbar.Brand>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav>
                  <Link to="/repositories" className="spn-link">
                    Repositories
                  </Link>
                  <Link to="/addrepository" className="Repository">
                    Create Repository
                  </Link>
                  
                  {/* <SpnDropdownMenu /> */}
                </Nav>
                <Nav className="align-items-center">
                  {/* <Link to="/addrepository" className="Repository">
                    New Repository
                  </Link> */}
                  <Link
                    className="user"

                  >
                    <span className="text-secondary">
                      {userData?.login ?? userData?.name}
                    </span>

                    <Dropdown className="user_details">
                      <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <img src={userData?.avatar_url} alt="user" />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1"> <i>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2998_135253)">
                              <path d="M6.99981 4.15907C6.62682 4.15907 6.25748 4.23253 5.91289 4.37527C5.56829 4.51801 5.25519 4.72722 4.99145 4.99096C4.7277 5.2547 4.51849 5.56781 4.37576 5.9124C4.23302 6.257 4.15956 6.62633 4.15956 6.99932C4.15956 7.3723 4.23302 7.74164 4.37576 8.08624C4.51849 8.43083 4.7277 8.74394 4.99145 9.00768C5.25519 9.27142 5.56829 9.48063 5.91289 9.62337C6.25748 9.7661 6.62682 9.83957 6.99981 9.83957C7.75309 9.83957 8.47552 9.54033 9.00817 9.00768C9.54082 8.47503 9.84006 7.7526 9.84006 6.99932C9.84006 6.24604 9.54082 5.52361 9.00817 4.99096C8.47552 4.45831 7.75309 4.15907 6.99981 4.15907ZM5.03456 6.99932C5.03456 6.4781 5.24161 5.97823 5.61016 5.60968C5.97872 5.24112 6.47859 5.03407 6.99981 5.03407C7.52102 5.03407 8.02089 5.24112 8.38945 5.60968C8.758 5.97823 8.96506 6.4781 8.96506 6.99932C8.96506 7.52053 8.758 8.0204 8.38945 8.38896C8.02089 8.75752 7.52102 8.96457 6.99981 8.96457C6.47859 8.96457 5.97872 8.75752 5.61016 8.38896C5.24161 8.0204 5.03456 7.52053 5.03456 6.99932Z" fill="#495057" />
                              <path d="M8.57131 1.17444C8.11018 -0.391807 5.88943 -0.391807 5.42831 1.17444L5.34606 1.45357C5.31385 1.5629 5.25759 1.66364 5.1814 1.74841C5.1052 1.83317 5.011 1.89981 4.90571 1.94344C4.80041 1.98707 4.68668 2.00658 4.57287 2.00055C4.45905 1.99451 4.34802 1.96309 4.24793 1.90857L3.99243 1.76857C2.55743 0.988068 0.988557 2.55782 1.76993 3.99194L1.90906 4.24744C1.96357 4.34754 1.995 4.45856 2.00103 4.57238C2.00707 4.6862 1.98756 4.79992 1.94393 4.90522C1.9003 5.01051 1.83366 5.10471 1.7489 5.18091C1.66413 5.2571 1.56339 5.31336 1.45406 5.34557L1.17493 5.42782C-0.391318 5.88894 -0.391318 8.10969 1.17493 8.57082L1.45406 8.65307C1.56339 8.68527 1.66413 8.74153 1.7489 8.81773C1.83366 8.89392 1.9003 8.98812 1.94393 9.09342C1.98756 9.19872 2.00707 9.31244 2.00103 9.42626C1.995 9.54008 1.96357 9.6511 1.90906 9.75119L1.76906 10.0067C0.988557 11.4417 2.55743 13.0114 3.99243 12.2292L4.24793 12.0901C4.34802 12.0356 4.45905 12.0041 4.57287 11.9981C4.68668 11.9921 4.80041 12.0116 4.90571 12.0552C5.011 12.0988 5.1052 12.1655 5.1814 12.2502C5.25759 12.335 5.31385 12.4357 5.34606 12.5451L5.42831 12.8242C5.88943 14.3904 8.11018 14.3904 8.57131 12.8242L8.65356 12.5451C8.68576 12.4357 8.74202 12.335 8.81822 12.2502C8.89441 12.1655 8.98861 12.0988 9.09391 12.0552C9.1992 12.0116 9.31293 11.9921 9.42675 11.9981C9.54056 12.0041 9.65159 12.0356 9.75168 12.0901L10.0072 12.2301C11.4422 13.0114 13.0119 11.4408 12.2297 10.0067L12.0906 9.75119C12.036 9.6511 12.0046 9.54008 11.9986 9.42626C11.9925 9.31244 12.0121 9.19872 12.0557 9.09342C12.0993 8.98812 12.166 8.89392 12.2507 8.81773C12.3355 8.74153 12.4362 8.68527 12.5456 8.65307L12.8247 8.57082C14.3909 8.10969 14.3909 5.88894 12.8247 5.42782L12.5456 5.34557C12.4362 5.31336 12.3355 5.2571 12.2507 5.18091C12.166 5.10471 12.0993 5.01051 12.0557 4.90522C12.0121 4.79992 11.9925 4.6862 11.9986 4.57238C12.0046 4.45856 12.036 4.34754 12.0906 4.24744L12.2306 3.99194C13.0119 2.55694 11.4413 0.988068 10.0072 1.76944L9.75168 1.90857C9.65159 1.96309 9.54056 1.99451 9.42675 2.00055C9.31293 2.00658 9.1992 1.98707 9.09391 1.94344C8.98861 1.89981 8.89441 1.83317 8.81822 1.74841C8.74202 1.66364 8.68576 1.5629 8.65356 1.45357L8.57131 1.17444ZM6.26743 1.42207C6.48268 0.691443 7.51693 0.691443 7.73218 1.42207L7.81443 1.70119C7.88357 1.93577 8.00434 2.1519 8.16787 2.33373C8.3314 2.51557 8.53355 2.6585 8.7595 2.75205C8.98545 2.8456 9.22947 2.8874 9.47368 2.87438C9.71789 2.86137 9.95608 2.79386 10.1708 2.67682L10.4254 2.53682C11.0939 2.17369 11.8254 2.90432 11.4614 3.57369L11.3223 3.82919C11.2054 4.04394 11.1381 4.28212 11.1252 4.52627C11.1123 4.77042 11.1543 5.01435 11.2479 5.2402C11.3415 5.46605 11.4845 5.6681 11.6663 5.83152C11.8482 5.99495 12.0643 6.11562 12.2988 6.18469L12.5771 6.26694C13.3077 6.48219 13.3077 7.51644 12.5771 7.73169L12.2979 7.81394C12.0634 7.88309 11.8472 8.00385 11.6654 8.16738C11.4836 8.33091 11.3406 8.53306 11.2471 8.75901C11.1535 8.98496 11.1117 9.22898 11.1247 9.47319C11.1378 9.7174 11.2053 9.95559 11.3223 10.1703L11.4623 10.4249C11.8254 11.0934 11.0948 11.8249 10.4254 11.4609L10.1708 11.3218C9.95602 11.2048 9.71777 11.1373 9.47351 11.1244C9.22926 11.1114 8.9852 11.1533 8.75924 11.2469C8.53328 11.3405 8.33114 11.4836 8.16765 11.6655C8.00416 11.8474 7.88347 12.0637 7.81443 12.2983L7.73218 12.5766C7.51693 13.3072 6.48268 13.3072 6.26743 12.5766L6.18518 12.2974C6.11601 12.063 5.99526 11.847 5.8318 11.6652C5.66833 11.4835 5.46627 11.3406 5.24044 11.2471C5.0146 11.1535 4.77069 11.1117 4.52659 11.1246C4.28249 11.1376 4.04437 11.2049 3.82968 11.3218L3.57418 11.4618C2.90568 11.8249 2.17418 11.0943 2.53818 10.4249L2.67731 10.1703C2.79451 9.95556 2.86215 9.71728 2.87525 9.47297C2.88836 9.22866 2.8466 8.98452 2.75303 8.75846C2.65947 8.53239 2.51648 8.33014 2.33455 8.16655C2.15262 8.00296 1.93638 7.88218 1.70168 7.81307L1.42256 7.73082C0.691932 7.51557 0.691932 6.48132 1.42256 6.26607L1.70168 6.18382C1.93601 6.11461 2.1519 5.99389 2.33356 5.83048C2.51521 5.66708 2.65803 5.46512 2.75155 5.23939C2.84508 5.01367 2.88695 4.76988 2.87411 4.52589C2.86126 4.28189 2.79402 4.04385 2.67731 3.82919L2.53731 3.57369C2.17418 2.90519 2.90481 2.17369 3.57418 2.53769L3.82968 2.67682C4.04437 2.7937 4.28249 2.86107 4.52659 2.874C4.77069 2.88693 5.0146 2.8451 5.24044 2.75156C5.46627 2.65802 5.66833 2.51514 5.8318 2.3334C5.99526 2.15166 6.11601 1.93565 6.18518 1.70119L6.26743 1.42207Z" fill="#495057" />
                            </g>
                            <defs>
                              <clipPath id="clip0_2998_135253">
                                <rect width="14" height="14" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </i><span>
                            {userData?.login ?? userData?.name}
                          </span>

                          <i className="cheron_top"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5602 9.93568C12.5195 9.97642 12.4713 10.0087 12.4181 10.0308C12.365 10.0529 12.308 10.0642 12.2504 10.0642C12.1929 10.0642 12.1359 10.0529 12.0828 10.0308C12.0296 10.0087 11.9813 9.97642 11.9407 9.93568L7.00044 4.99455L2.06019 9.93568C2.01951 9.97635 1.97122 10.0086 1.91807 10.0306C1.86493 10.0526 1.80796 10.064 1.75044 10.064C1.69291 10.064 1.63595 10.0526 1.5828 10.0306C1.52966 10.0086 1.48137 9.97635 1.44069 9.93568C1.40001 9.895 1.36775 9.84671 1.34573 9.79356C1.32372 9.74042 1.31239 9.68345 1.31239 9.62593C1.31239 9.5684 1.32372 9.51144 1.34573 9.45829C1.36775 9.40514 1.40001 9.35685 1.44069 9.31618L6.69069 4.06618C6.73133 4.02543 6.77961 3.99311 6.83276 3.97105C6.88591 3.949 6.94289 3.93764 7.00044 3.93764C7.05799 3.93764 7.11497 3.949 7.16812 3.97105C7.22127 3.99311 7.26955 4.02543 7.31019 4.06618L12.5602 9.31618C12.6009 9.35682 12.6333 9.4051 12.6553 9.45825C12.6774 9.5114 12.6887 9.56838 12.6887 9.62593C12.6887 9.68347 12.6774 9.74045 12.6553 9.79361C12.6333 9.84676 12.6009 9.89504 12.5602 9.93568Z" fill="#495057" />
                          </svg>
                          </i></Dropdown.Item>
                        <Dropdown.Item href="#/logout" onClick={logoutHandler}> <span>Log out </span></Dropdown.Item>

                      </Dropdown.Menu>
                    </Dropdown>



                  </Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
};

export default SpnTopBar;
