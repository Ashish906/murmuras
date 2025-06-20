import React, { useEffect, useState } from "react";
import API_REQUEST from "../utills/axios-instance";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import { Card, Layout } from "antd";
import TopNavbar from "./topbar";
import { UserProfile } from "../interfaces/common.interface";
const { Content } = Layout;

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>({
        email: "",
        name: "",
        follower_count: 0,
        following_count: 0,
    });

    const handleNavigate = (key: string) => {
        navigate(key);
    }

    const handleSignOut = () => {
        cookie.remove('access_token');
        cookie.remove('refresh_token');
        navigate('/login');
    }

    const fetchMyProfile = async () => {
        try {
            const response = await API_REQUEST.get('/users/me');
            setProfile(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMyProfile();
    }, []);
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <TopNavbar
                profile={profile}
                onSignOut={handleSignOut}
                onNavigate={handleNavigate}
            />
            <Card style={{}}>
                {children}
            </Card>
        </Layout>
    )
};

export default AuthWrapper;