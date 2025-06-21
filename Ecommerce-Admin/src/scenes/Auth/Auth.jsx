import React, { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const loginResponse = await axios.post('/Account/UI/Login', {
                UserNameOrEmail: emailOrUsername,
                Password: password,
            });

            const { token, userId } = loginResponse.data;

            if (!token || !userId) {
                setError('Invalid login response.');
                return;
            }

            localStorage.setItem('token', token);

            const usersResponse = await axios.get('/Account/Admin/GetUsers', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const users = usersResponse.data;
            const matchedUser = users.find((user) => user.id === userId);

            const allowedRoles = ['Admin', 'SuperAdmin', 'Moderator'];

            if (matchedUser && matchedUser.roles.some(role => allowedRoles.includes(role))) {
                localStorage.setItem('userName', matchedUser.userName);
                localStorage.setItem('userEmail', matchedUser.email);
                localStorage.setItem("userRoles", JSON.stringify(matchedUser.roles));
                navigate('/');
            } else {
                setError('Access denied. You are not an Admin.');
                localStorage.removeItem('token');
            }

        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your credentials.');
            localStorage.removeItem('token');
        }
    };

    return (
        <div className="auth">
            <div className="auth-container">
                <h2>Admin Login</h2>
                <form className="form-auth" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email or Username"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="auth-input"
                    />
                    <button type="submit" className="auth-button">
                        Login
                    </button>
                    {error && <p className="auth-error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Auth;
