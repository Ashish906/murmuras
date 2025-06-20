import React, { useEffect, useState } from 'react';
import API_REQUEST from '../utills/axios-instance';
import { Card, Row } from 'antd';
import { Murmur, User } from '../interfaces/common.interface';
import { useLocation, useParams } from 'react-router-dom';
import ProfileUserCard from '../components/users/profile-user-card';
import MurmurCard from '../components/timeline/murmur-card';

const UserProfile: React.FC = () => {
    const [userData, setUserData] = useState<User>({} as User);
    const [murmurs, setMurmurs] = useState<Murmur[]>([]);
    const { id } = useParams();
    const location = useLocation();
    const { from } = location.state || {};

    const fetchUser = async () => {
        try {
            const response = await API_REQUEST.get(`/users/${id}`);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchMurmurs = async () => {
        try {
            const response = await API_REQUEST.get(`/murmurs/specific-user/${id}`);
            setMurmurs(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        fetchMurmurs();
    }, [id]);

    return (
        <Card key={userData?.id}>
            <h1>{userData?.name}'s Profile</h1>
            <div style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <ProfileUserCard 
                        user={userData as User} 
                        key={userData?.id}
                        isMyProfile={from === 'profile'} 
                    />
                </Row>
            </div>
            <div style={{ marginTop: 16 }}>
                <h2>Murmurs</h2>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {murmurs?.map((murmur) => (
                        <MurmurCard 
                            murmur={murmur} 
                            key={murmur.id} 
                            isMyProfile={from === 'profile'} 
                        />
                    ))}
                </Row>
            </div>
        </Card>
    )
}

export default UserProfile;