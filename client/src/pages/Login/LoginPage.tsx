import { useState, useContext, useEffect } from "react";
import { login } from "../../services/api";
import { AuthContext } from "./authContext";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

// Rate limiting configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes

interface LoginAttempt {
  timestamp: number;
  count: number;
}

export const Login = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // UI states
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number>(0);
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Check if account is locked on mount
  useEffect(() => {
    checkAccountLockout();
  }, []);

  // Update lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setLockoutTime(0);
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const checkAccountLockout = () => {
    const attemptData = localStorage.getItem("login_attempts");
    if (attemptData) {
      try {
        const attempts: LoginAttempt = JSON.parse(attemptData);
        const now = Date.now();
        
        // Check if still in lockout period
        if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
          const lockoutEnd = attempts.timestamp + LOCKOUT_DURATION;
          if (now < lockoutEnd) {
            setIsLocked(true);
            setLockoutTime(lockoutEnd);
            return;
          } else {
            // Lockout expired, reset
            localStorage.removeItem("login_attempts");
          }
        }
        
        // Reset if attempt window has passed
        if (now - attempts.timestamp > ATTEMPT_WINDOW) {
          localStorage.removeItem("login_attempts");
        }
      } catch {
        localStorage.removeItem("login_attempts");
      }
    }
  };

  const recordFailedAttempt = () => {
    const attemptData = localStorage.getItem("login_attempts");
    let attempts: LoginAttempt;

    if (attemptData) {
      attempts = JSON.parse(attemptData);
      const now = Date.now();
      
      // Reset if attempt window has passed
      if (now - attempts.timestamp > ATTEMPT_WINDOW) {
        attempts = { timestamp: now, count: 1 };
      } else {
        attempts.count++;
        attempts.timestamp = now;
      }
    } else {
      attempts = { timestamp: Date.now(), count: 1 };
    }

    localStorage.setItem("login_attempts", JSON.stringify(attempts));

    // Check if should lock account
    if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const lockoutEnd = attempts.timestamp + LOCKOUT_DURATION;
      setIsLocked(true);
      setLockoutTime(lockoutEnd);
    }

    return MAX_LOGIN_ATTEMPTS - attempts.count;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    // Prevent common XSS attempts
    if (/<|>|script|javascript/i.test(email)) {
      setEmailError("Invalid characters in email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const sanitizeInput = (input: string): string => {
    // Remove potential XSS characters
    return input.replace(/[<>"'&]/g, '');
  };

  const getRemainingLockoutTime = (): string => {
    const remaining = Math.max(0, lockoutTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError("");
    
    // Check if locked out
    if (isLocked) {
      setError(`Too many failed attempts. Please try again in ${getRemainingLockoutTime()}`);
      return;
    }

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedPassword = sanitizeInput(password);

    setIsLoading(true);

    try {
      const data = await login(sanitizedEmail, sanitizedPassword);
      
      if (!data.access_token) {
        setError("Invalid response from server. Please try again.");
        return;
      }
      
      localStorage.removeItem("login_attempts");
      authContext?.login(data.access_token, data.refresh_token);
      
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        
        if (status === 401 || status === 403) {
          const attemptsRemaining = recordFailedAttempt();
          if (attemptsRemaining > 0) {
            setError(`Invalid email or password. ${attemptsRemaining} attempts remaining.`);
          } else {
            setError("Too many failed attempts. Account locked for 15 minutes.");
          }
        } else if (status === 429) {
          setError("Too many requests. Please try again later.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (err.request) {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      validateEmail(e.target.value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      validatePassword(e.target.value);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error" role="alert">{error}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => validateEmail(email)}
            placeholder="Email"
            required
            disabled={isLoading || isLocked}
            autoComplete="email"
            aria-label="Email address"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && <span id="email-error" className="field-error">{emailError}</span>}
        </div>
        
        <div className="form-group">
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              placeholder="Password"
              required
              disabled={isLoading || isLocked}
              autoComplete="current-password"
              aria-label="Password"
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading || isLocked}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          {passwordError && <span id="password-error" className="field-error">{passwordError}</span>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || isLocked || !email || !password}
          className={isLoading ? "loading" : ""}
        >
          {isLoading ? "Logging in..." : isLocked ? `Locked (${getRemainingLockoutTime()})` : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
