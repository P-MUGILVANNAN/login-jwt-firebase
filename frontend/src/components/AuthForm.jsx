import { useState, useEffect } from "react";
import { signInWithGoogle } from "../services/firebase";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-success" : "bg-danger";

  return (
    <div 
      className={`toast show position-fixed ${bgColor} text-white`}
      style={{ top: "20px", right: "20px", zIndex: 1050, minWidth: "300px" }}
      role="alert"
    >
      <div className="toast-header">
        <strong className="me-auto">{type === "success" ? "Success" : "Error"}</strong>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleAuth = async () => {
    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();

      // send token to backend
      const { data } = await API.post("/auth/google", { idToken });

      localStorage.setItem("token", data.token);
      showToast("Google authentication successful!");
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      showToast("Google authentication failed!", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const endpoint = isLogin ? "/auth/signin" : "/auth/signup";
      const { data } = await API.post(endpoint, form);
      localStorage.setItem("token", data.token);
      
      const successMessage = isLogin ? "Signin successful!" : "Signup successful!";
      showToast(successMessage);
      
      // Redirect based on action
      setTimeout(() => {
        if (isLogin) {
          navigate("/dashboard");
        } else {
          // After signup, redirect to signin page
          setIsLogin(true);
          setForm({ name: "", email: "", password: "" });
        }
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error during ${isLogin ? "signin" : "signup"}`;
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container my-5">
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-center text-muted mb-4">
                {isLogin 
                  ? "Sign in to your account to continue" 
                  : "Fill in your details to create your account"}
              </p>
              
              {/* Google Sign In Button */}
              <div className="d-grid mb-4">
                <button 
                  className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-google me-2" viewBox="0 0 16 16">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                  </svg>
                  Sign {isLogin ? "in" : "up"} with Google
                </button>
              </div>
              
              <div className="position-relative text-center mb-4">
                <hr />
                <span className="position-absolute top-50 translate-middle-y bg-white px-3 text-muted">or</span>
              </div>
              
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    placeholder={isLogin ? "Enter your password" : "Create a password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  {!isLogin && (
                    <div className="form-text">
                      Use 8 or more characters with a mix of letters, numbers & symbols
                    </div>
                  )}
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isLogin ? "Signing in..." : "Creating Account..."}
                      </>
                    ) : (
                      isLogin ? "Sign in" : "Create Account"
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-4">
                  <p className="text-muted">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button 
                      type="button" 
                      className="btn btn-link p-0"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setForm({ name: "", email: "", password: "" });
                      }}
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}