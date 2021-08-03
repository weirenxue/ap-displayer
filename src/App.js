import './App.css';

import React, { useState } from 'react';

import XlsxReader from './components/XlsxReader';
import APTable from './components/APTable';
import APFilter from './components/APFilter';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [content, setConent] = useState({});
    const [filteredContent, setFilteredContent] = useState({});
    return (
        <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
            <XlsxReader getContent={(content) => setConent(content)}/>
            { content['ap'] && <APFilter content={content} getFilteredContent={(content) => setFilteredContent(content)}/> }
            { content['ap'] && <APTable content={filteredContent}/> }
        </div>
    );
}

export default App;
