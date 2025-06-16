import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import logo from "../../assets/Logo.png";
import { useRef, useState, type FormEvent } from "react";
import type { LoginError } from "../../types/Types";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
import '../signup/SignUp.css'

const SignIn = () => {
  const navigate = useNavigate();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<LoginError>({});
  const [loading, setLoading] = useState<boolean>(false);

  const singIn = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    axios
      .post(
        "https://web-production-3ca4c.up.railway.app/api/login",
        {
          email: email.current?.value,
          password: password.current?.value,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        localStorage.clear();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_image", res.data.user.profile_image_url);
        localStorage.setItem("user_name", res.data.user.user_name);

        toast.success(`Logged in as ${res.data.user.user_name}`, {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/dashboard"),
        });
      })
      .catch((err) => {
        setError(err.response?.data.errors || {});
        toast.error("Login failed ❌", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-100vh mw-100 bg-primary-color d-flex justify-content-center align-items-center flex-column p-relative">

      <Form className="bg-white log-shadow px-5 py-5 rounded-20 signin-w" onSubmit={singIn}>
        <div className="txt">
          <div className="d-flex justify-content-center">
            <img src={logo} alt="focal-x" />
          </div>
          <div className="content text-center my-sm-5 my-2">
            <h3 className="fs-3">SIGN IN</h3>
            <p>Enter your credentials to access your account</p>
          </div>
        </div>

        <Form.Label>Email</Form.Label>
        <Row className="d-flex align-items-center">
          <Col>
            <Form.Group className="mb-3" id="emailsignin">
              <Form.Control type="email" placeholder="Email" ref={email} disabled={loading} required/>
              {error?.email && (
                <p data-aos="fade" className="text-danger">
                  {error?.email[0] + " !"}
                </p>
              )}
            </Form.Group>
          </Col>

          <Form.Label>Password</Form.Label>
          <Form.Group className="mb-3" id="passSignin">
            <Form.Control type="password" placeholder="Password" ref={password} disabled={loading} required/>
            <div>
              {error?.password && (
                <p className="text-danger">{error?.password[0] + " !"}</p>
              )}
            </div>
          </Form.Group>
        </Row>

        <Button className="my-btn text-white w-100 my-2 d-flex justify-content-center align-items-center" type="submit" disabled={loading}>
          {loading ? (

                          <>
                <ClipLoader size={20} color="#fff" />
                <span>Logging in...</span>
              </>
            
          ) : (
            "SIGN IN"
          )}
        </Button>

        <div className="text-center pt-4">
          <span className="text-black-50">
            Don’t have an account?{" "}
            <Link to={"/signup"} className="text-main">
              Create one
            </Link>
          </span>
        </div>
      </Form>

      <ToastContainer />
    </div>
  );
};

export default SignIn;
