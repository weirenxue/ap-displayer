import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Badge } from 'react-bootstrap';

import SelectFilter from './SelectFilter';
import KeywordFilter from './KeywordFilter';

const APFilter = () => {
    const {ap} = useSelector(state => state.xlsxContent.origin);
    const {ap: filteredAp } = useSelector(state => state.xlsxContent.fromFilter);
    const [filterCount, setFilterCount] = useState(0);

    useEffect(() => {
        setFilterCount(filteredAp ? filteredAp.length : 0);
    }, [filteredAp]);

    return (
        <div>
            <SelectFilter />
            <KeywordFilter />
            <Badge bg="danger" pill className="mb-3" style={{maxWidth: '150px', width: '100%'}}>
                {filterCount}/{ap ? ap.length : 0}
            </Badge>
        </div>
    );
}

export default APFilter;
