import React, { useState } from 'react';
import { Card, Button, Col, Typography } from 'antd';
import moment from 'moment';
import { Murmur } from '../../interfaces/common.interface';
import API_REQUEST from '../../utills/axios-instance';

const { Title, Text } = Typography;

type MurmurProps = {
  murmur: Murmur;
};

const MurmurCard: React.FC<MurmurProps> = ({ murmur }) => {
    const [isLiked, setIsLiked] = useState<boolean>(murmur.is_liked);
    const [likeCount, setLikeCount] = useState<number>(murmur.likes_count);

  const handleLike = (murmurId: number, type: number) => {
    setIsLiked(!!type);
    if(type) {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }

    API_REQUEST.post(`/murmurs/like/${murmurId}/${type}`);
  };

  return (
    <Col xs={24} sm={12} md={8} lg={6} key={murmur.id}>
        <Card
            title={
            <Title level={5} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{murmur?.user?.name}</span>
                <span>{likeCount} Likes</span>
            </Title>}
            actions={[
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
  );
};

export default MurmurCard;
