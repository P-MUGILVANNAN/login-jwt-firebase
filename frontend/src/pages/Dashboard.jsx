import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Toast Notification Component (same as in AuthForm)
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

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch user data (this is just a mock implementation)
    const fetchUserData = async () => {
      try {
        // In a real app, you would fetch user data from your API
        // const response = await API.get("/user/me");
        // setUser(response.data);
        
        // For demo purposes, we'll use mock data
        setUser({
          name: "John Doe",
          email: "john@example.com",
          joinDate: "January 2023"
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        showToast("Failed to load user data", "error");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    showToast("You have been logged out successfully", "success");
    
    // Redirect to home after a brief delay to show the toast
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
      
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-rocket me-2"></i>
            Dashboard App
          </a>
          
          <div className="d-flex align-items-center">
            {user && (
              <span className="navbar-text me-3 d-none d-md-block">
                Welcome, {user.name}
              </span>
            )}
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-white py-3">
                <h2 className="card-title mb-0">
                  <i className="bi bi-speedometer2 me-2 text-primary"></i>
                  Welcome to Your Dashboard 🚀
                </h2>
              </div>
              <div className="card-body p-4">
                {user ? (
                  <>
                    <div className="alert alert-success" role="alert">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      You have successfully logged in!
                    </div>
                    
                    <div className="row mt-4">
                      <div className="col-md-6">
                        <div className="card mb-4">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="bi bi-person-circle me-2 text-primary"></i>
                              User Profile
                            </h5>
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item d-flex justify-content-between align-items-center">
                                Name
                                <span className="text-muted">{user.name}</span>
                              </li>
                              <li className="list-group-item d-flex justify-content-between align-items-center">
                                Email
                                <span className="text-muted">{user.email}</span>
                              </li>
                              <li className="list-group-item d-flex justify-content-between align-items-center">
                                Member since
                                <span className="text-muted">{user.joinDate}</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="card mb-4">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="bi bi-graph-up me-2 text-primary"></i>
                              Quick Stats
                            </h5>
                            <div className="d-flex justify-content-around text-center my-3">
                              <div>
                                <div className="h4 text-primary mb-0">12</div>
                                <small className="text-muted">Projects</small>
                              </div>
                              <div>
                                <div className="h4 text-success mb-0">24</div>
                                <small className="text-muted">Tasks</small>
                              </div>
                              <div>
                                <div className="h4 text-info mb-0">8</div>
                                <small className="text-muted">Completed</small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card">
                          <div className="card-body">
                            <h5 className="card-title">
                              <i className="bi bi-lightning me-2 text-primary"></i>
                              Quick Actions
                            </h5>
                            <div className="d-grid gap-2">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-plus-circle me-2"></i>
                                Create New Project
                              </button>
                              <button className="btn btn-outline-secondary">
                                <i className="bi bi-pencil me-2"></i>
                                Edit Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading your dashboard...</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center mt-4 text-muted">
              <small>© 2023 Dashboard App. All rights reserved.</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}