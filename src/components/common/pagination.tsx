import React, { useState } from 'react';
import { Pagination, Select, Row, Col } from 'antd';

const { Option } = Select;

type Props = {
  total: number;
  initialPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
};

const PaginationWithLimit: React.FC<Props> = ({
  total,
  initialPageSize = 10,
  onChange,
}) => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handlePageChange = (page: number, size?: number) => {
    setCurrent(page);
    if (onChange) onChange(page, size ?? pageSize);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrent(1);
    if (onChange) onChange(1, value);
  };

  return (
    <Row align="middle" justify="space-between" style={{ marginTop: 16 }}>
      <Col>
        Total: <strong>{total}</strong> items
      </Col>
      <Col>
        <Pagination
          current={current}
          total={total}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </Col>
      <Col>
        Show:{' '}
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          style={{ width: 100 }}
        >
          {[10, 20, 50, 100].map((size) => (
            <Option key={size} value={size}>
              {size} / page
            </Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default PaginationWithLimit;
