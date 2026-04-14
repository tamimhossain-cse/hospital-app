import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card, { CardBody } from "../components/ui/Card";
import IconInput from "../components/ui/IconInput";
import Button from "../components/ui/Button";
import { validateEmail, validatePassword, validatePasswordMatch, getPasswordStrength } from "../utils/validation";

// Icons
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

const strengthColors = {
  0: 'bg-gray-200',
  1: 'bg-danger-500',
  2: 'bg-warning-500',
  3: 'bg-info-500',
  4: 'bg-success-500',
};

const strengthLabels = {
  0: 'text-gray-400',
  1: 'text-danger-600',
  2: 'text-warning-600',
  3: 'text-info-600',
  4: 'text-success-600',
};

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const navigate = useNavigate();
  const { register, userRole, user } = useAuth();

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  // Handle role-based redirect after registration succeeds and role is loaded
  useEffect(() => {
    if (registerSuccess && user && userRole) {
      // Role-based redirect
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        default:
          navigate('/dashboard');
      }
      setRegisterSuccess(false);
      setLoading(false);
    }
  }, [registerSuccess, user, userRole, navigate]);

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (email && !validateEmail(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordBlur = () => {
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordError(validation.errors[0]);
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmBlur = () => {
    if (confirmPassword && !validatePasswordMatch(password, confirmPassword)) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmError("Please confirm your password");
      hasError = true;
    } else if (!validatePasswordMatch(password, confirmPassword)) {
      setConfirmError("Passwords do not match");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      await register(email, password);
      // Set register success flag - redirect will happen when userRole is loaded
      setRegisterSuccess(true);
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.");
      } else {
        setError(error.message || "Failed to create account. Please try again.");
      }
      setLoading(false);
    }
  };

  const isFormValid = email && password && confirmPassword &&
    validateEmail(email) &&
    validatePassword(password).isValid &&
    validatePasswordMatch(password, confirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-md w-full transition-all duration-700 ease-out ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us to book appointments</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardBody>
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="p-3 bg-danger-50 text-danger-700 rounded-lg text-sm flex items-start gap-2 animate-[shake_0.5s_ease-in-out]">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <IconInput
                label="Email Address"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                icon={<EmailIcon />}
                error={emailTouched ? emailError : ''}
                required
              />

              <div>
                <IconInput
                  label="Password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••"
                  icon={<LockIcon />}
                  error={passwordError}
                  required
                />
                {password && !passwordError && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strengthColors[passwordStrength.level]}`}
                          style={{ width: `${(passwordStrength.level + 1) * 25}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${strengthLabels[passwordStrength.level]}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <IconInput
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={handleConfirmBlur}
                placeholder="••••••••"
                icon={<LockIcon />}
                error={confirmError}
                required
              />

              <Button
                type="submit"
                variant="success"
                className="w-full shadow-lg shadow-green-500/30 hover:shadow-green-500/40 transition-shadow"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{" "}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1 transition-colors">
                Sign in here
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </CardBody>
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default Register;
