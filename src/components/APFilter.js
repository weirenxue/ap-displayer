import React, { useEffect, useState, useRef } from 'react';

import { Form, Row, FloatingLabel, Badge } from 'react-bootstrap';

import SelectFilter from './SelectFilter';
import KeywordFilter from './KeywordFilter';

const APFilter = (props) => {
    const [content, setContent] = useState({});
    const [filteredBySelectFilterContent, setFilteredBySelectFilterContent] = useState({});
    const [filteredContent, setFilteredContent] = useState({});

    // 當 props.content 的值變動時，需要更新 content state
    useEffect(() => {
        setContent(props.content);
    }, [props.content]);

    return (
        <div>
            <SelectFilter content={content} getFilteredContent={(content) => setFilteredBySelectFilterContent(content)}/>
            <KeywordFilter className="mb-1" content={filteredBySelectFilterContent} 
                getFilteredContent={(content) => {
                    setFilteredContent(content);
                    props.getFilteredContent(content);
                }}
            />
            <Badge bg="danger" pill className="mb-3" style={{maxWidth: '150px', width: '100%'}}>
                {filteredContent['ap'] ? filteredContent['ap'].length: 0}/{content['ap'] ? content['ap'].length : 0}
            </Badge>
        </div>
    );
}

export default APFilter;
