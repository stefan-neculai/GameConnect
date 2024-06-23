import React, { useState } from 'react';
import './SignUp.css';

const SignupForm: React.FC = () => {
    const [loading, setLoading] = useState(false); // [1
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        username: ''
    });

    const validateEmail = (email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validation checks
        let error = '';
        if (name === 'email' && !validateEmail(value)) {
            error = 'Invalid email address.';
        } else if (name === 'password' && value.length < 6) {
            error = 'Password must be at least 6 characters.';
        } else if (name === 'username' && value.length < 3) {
            error = 'Username must be at least 3 characters.';
        }
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Check all fields for errors
        const isValid = Object.values(errors).every(x => x === "") && Object.values(formData).every(x => x !== "");
        if (isValid) {
            console.log('Form is valid, submit data:', formData);
            // Submit form
            setLoading(true);
            const response = await fetch('https://localhost:4000/api/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            setLoading(false);
            if (response.ok) {
              console.log('Sign up successful');
            } else {
              console.log('Sign up failed');
            }
        } else {
            console.log('Validation errors', errors);
        }
    };

    return (
      <div className="SignUp">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
                {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            <div>
                <label>Confirm Password:</label>
                <input type="password" />
            </div>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                {errors.username && <p className="error-message">{errors.username}</p>}
            </div>
            {loading ? <div className="loader"></div> : <button type="submit" disabled={loading}> Sign Up </button>}
        </form>
      </div>
    );
};

export default SignupForm;
