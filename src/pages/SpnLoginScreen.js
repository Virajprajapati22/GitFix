import React from "react";
import { Row, Container, Col } from "react-bootstrap";
import login from "../assets/images/login.svg";
import logo from "../assets/images/logo.svg";
import giticon from "../assets/images/git.svg";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "../components/firebase-auth";

const SpnLoginScreen = (props) => {
  const navigate = useNavigate()

  const handleGithubLogin = async () => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        localStorage.setItem("user-accessToken", JSON.stringify(result?._tokenResponse?.oauthAccessToken));
        navigate(`/repositories`, { state: { skipAuth: true }, replace: true })
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <>
      <section className="multi_colums py-3 ">
        <Container>
          <Row className="row  align-items-md-center">
            <Col sm={6}>
              <div className="content_box">
                <img src={logo} alt="spander icon" />
                <h2 className="text-primary ">Sign in with Github</h2>
                <p className="des text-body">
                  Effortlessly manage your GitHub issues with enhanced readability and comfort.{" "}
                </p>
                <p className="des2 text-body">
                  By signing up, I agree to GitFix{" "}
                  <a href="/terms"> Terms of Service</a> and
                  <a href="/policy"> Privacy Policy</a>.
                </p>
                <a
                  variant="dark"
                  className="signin bg-dark text-white"
                  // to={`https://github.com/login/oauth/authorize?client_id=${getGithubClientID()}`}
                  // href={getLoginToGithubURL()}
                  onClick={handleGithubLogin}
                >
                  <img src={giticon} alt="git icon" />
                  <span>Sign in with GitHub</span>
                </a>
              </div>
            </Col>

            <Col sm={6}>
              <img src={login} alt="login" className="right_img" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
};

export default SpnLoginScreen;
