import React, { useState } from 'react';
import { Card, Button, Col, Typography } from 'antd';
import moment from 'moment';
import { Murmur } from '../../interfaces/common.interface';
import API_REQUEST from '../../utills/axios-instance';
import { SwalConfirm, SwalSuccess } from '../../utills/sweet-alert';
import { NavLink } from 'react-router-dom';

const { Title, Text } = Typography;

type MurmurProps = {
  murmur: Murmur;
  isMyProfile?: boolean;
};

const MurmurCard: React.FC<MurmurProps> = ({ murmur, isMyProfile }) => {
    const [isLiked, setIsLiked] = useState<boolean>(murmur.is_liked);
    const [likeCount, setLikeCount] = useState<number>(murmur.likes_count);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const handleLike = (murmurId: number, type: number) => {
    setIsLiked(!!type);
    if(type) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }

    API_REQUEST.post(`/murmurs/like/${murmurId}/${type}`);
  };
  const handleDelete = async (murmurId: number) => {
    try {
      SwalConfirm('Are you sure?', 'You will not be able to recover this murmur').then(async (result) => {
        if(result.isConfirmed) {
          await API_REQUEST.delete(`/murmurs/${murmurId}`);
          SwalSuccess('Murmur deleted successfully');
          setIsDeleted(true);
        }
      }).catch(err => {
        throw err;
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
      isDeleted ? null :
      (
        <Col xs={24} sm={12} md={8} lg={6} key={murmur.id}>
            <Card
                title={
                <Title level={5} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {
                      isMyProfile ?
                        <span>{murmur?.user?.name}</span>
                        :
                        <NavLink to={`/users/${murmur?.user?.id}`}>
                            <span>{murmur?.user?.name}</span>
                        </NavLink>
                    }
                    <span>{likeCount} Likes</span>
                </Title>}
                actions={
                  isMyProfile ? [
                    <Button type='primary' color='danger' onClick={() => handleDelete(murmur.id)}>
                        Delete
                    </Button>
                  ] : [
                    !isLiked ? (
                    <Button type="primary" onClick={() => handleLike(murmur.id, 1)}>
                        Like
                    </Button>
                    ) : (
                        <Button type="primary" onClick={() => handleLike(murmur.id, 0)}>
                            Unlike
                        </Button>
                    )
                ]}
            >
            <Text>{murmur.text}</Text><br />
            <Text>Posted at: {moment(murmur.created_at).format('DD-MMM-YYYY HH:mm:ss')}</Text>
            </Card>
        </Col>
      )
  );
};

export default MurmurCard;
