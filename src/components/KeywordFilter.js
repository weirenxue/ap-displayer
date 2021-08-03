import React, { useEffect, useState } from 'react';

import { Form, FloatingLabel } from 'react-bootstrap';

const KeywordFilter = (props) => {
    const [content, setContent] = useState({});
    const [keyword, setKeyword] = useState('');

    // 當 props.content 的值變動時，需要更新 content state
    useEffect(() => {
        setContent(props.content);
    }, [props.content]);

    useEffect(() => {
        let content_copied = Object.assign({}, content);

        // 若無關鍵字，則不需篩選
        if (keyword === '') {
            props.getFilteredContent(content_copied);
            return;
        }
        
        let keywords = keyword.split(',');
        content_copied['ap'] = content_copied['ap'] && content_copied['ap'].filter((e) => {
            let ret = false;
            for (let key in e) {
                keywords.forEach((_e) => {
                    // 若關鍵字中包含空字串，跳過空字串不檢查
                    if (_e === '') return;
                    // 檢查關鍵字是否存在
                    if (e[key].includes(_e)) ret = true;
                })
            }
            return ret;
        });

        props.getFilteredContent(content_copied);
    }, [keyword, content])

    return (
        <FloatingLabel controlId="floatingKeyword" label="Keyword (Seperate By Comma)">
            <Form.Control type="text" placeholder="Keyword" onChange={(e) => setKeyword(e.target.value)} className={props.className}/>
        </FloatingLabel>
    );
}

export default KeywordFilter;