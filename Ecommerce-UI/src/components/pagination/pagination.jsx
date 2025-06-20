import React, { useState } from 'react';
import { Pagination } from '@mui/material';

const pagination = (max) => {
    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);

    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
            <Pagination count={max} page={page} onChange={handleChange} shape="rounded" color="primary" />
        </div>
    );
};

export default pagination;
