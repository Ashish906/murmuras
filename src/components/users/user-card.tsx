import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography } from 'antd';
import { User } from '../../interfaces/common.interface';
import API_REQUEST from '../../utills/axios-instance';
import { NavLink } from 'react-router-dom';

const { Title, Text } = Typography;

type UserListProps = {
  user: User;
};

const UserCard: React.FC<UserListProps> = ({ user }) => {
    const [isFollowing, setIsFollowing] = useState<boolean>(user.is_following);
    const [followerCount, setFollowerCount] = useState<number>(user.followers_count);

  const handleFollow = (userId: number, type: number) => {
    setIsFollowing(!!type);
    if(type) {
      setFollowerCount(followerCount + 1);
    } else {
      setFollowerCount(followerCount - 1);
    }

    API_REQUEST.post(`/users/follow/${userId}/${type}`);
  };

  return (
    <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
        <Card
            title={<NavLink to={`/users/${user.id}`}>{user.name}</NavLink>}
            actions={[
                !isFollowing ? (
                <Button type="primary" onClick={() => handleFollow(user.id, 1)}>
                    Follow
                </Button>
                ) : (
                    <Button type="primary" onClick={() => handleFollow(user.id, 0)}>
                        Unfollow
                    </Button>
                )
            ]}
        >
        <Text>Followers: {followerCount}</Text><br />
        <Text>Following: {user.following_count}</Text>
        </Card>
    </Col>
  );
};

export default UserCard;
