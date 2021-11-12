import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, FloatingLabel } from 'react-bootstrap';

import { 
    setXlsxFromFilter
} from '../models/actions';

const KeywordFilter = () => {
    const {ap, metadata} = useSelector(state => state.xlsxContent.fromSelectFilter)
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        if (ap === undefined || ap.length === 0) {
            dispatch(setXlsxFromFilter({metadata, ap: []}));
            return;
        }
        let content_copied = ap.slice();

        // 若無關鍵字，則不需篩選
        if (keyword === '') {
            dispatch(setXlsxFromFilter({metadata, ap: content_copied}));
            return;
        }
        
        let keywords = keyword.split(',');
        content_copied = content_copied && content_copied.filter((e) => {
            for (let key in e) {
                for (let i = 0; i < keywords.length; i++) {
                    let _e = keywords[i];
                    // 若關鍵字中包含空字串，跳過空字串不檢查
                    if (_e === '') continue;
                    // 檢查關鍵字是否存在
                    if (e[key].includes(_e)) return true;
                }
            }
            return false;
        });

        dispatch(setXlsxFromFilter({metadata, ap: content_copied}));
    }, [keyword, ap, dispatch, metadata])

    return (
        <FloatingLabel controlId="floatingKeyword" label="Keyword (Seperate By Comma)">
            <Form.Control type="text" placeholder="Keyword" onChange={(e) => setKeyword(e.target.value)} className="mb-1"/>
        </FloatingLabel>
    );
}

export default KeywordFilter;