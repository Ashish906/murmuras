import React, { useEffect, useState } from 'react';
import API_REQUEST from '../utills/axios-instance';
import { Card, Row } from 'antd';
import UserCard from '../components/users/user-card';
import { User } from '../interfaces/common.interface';

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await API_REQUEST.get('/users/all');
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <Card>
            <h1>Users</h1>
            <div style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {users.map((user) => (
                        <UserCard user={user} key={user.id} />
                    ))}
                </Row>
            </div>
        </Card>
    )
}

export default Users;