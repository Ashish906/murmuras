import React, { useEffect, useState } from 'react';
import API_REQUEST from '../utills/axios-instance';
import { Card, Row } from 'antd';
import { Murmur } from '../interfaces/common.interface';
import MurmurCard from '../components/timeline/murmur-card';
import MurmurForm from '../components/timeline/murmur-form';
import PaginationWithLimit from '../components/common/pagination';

const Timeline: React.FC = () => {
    const [murmurs, setMurmurs] = useState<Murmur[]>([]);
    const [total, setTotal] = useState<number>(0);

    const fetchMurmurs = async (page: number, pageSize: number) => {
        try {
            const response = await API_REQUEST.get('/murmurs/timeline', {
                params: {
                    page: page,
                    limit: pageSize
                }
            });
            setMurmurs(response.data?.data);
            setTotal(response.data?.total);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchMurmurs(1, 10);
    }, []);
    return (
        <Card>
            <h1>Timeline</h1>
            <div style={{ marginTop: 16 }}>
                <MurmurForm/>
            </div>
            <div style={{ marginTop: 16 }}>
                <h2>Murmurs</h2>
                <PaginationWithLimit total={total} onChange={(page, pageSize) => fetchMurmurs(page, pageSize)} />
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    {murmurs.map((murmur) => (
                        <MurmurCard murmur={murmur} key={murmur.id} />
                    ))}
                </Row>
            </div>
        </Card>
    )
}

export default Timeline;