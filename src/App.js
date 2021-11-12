import './App.css';

import React from 'react';

import XlsxReader from './components/XlsxReader';
import APTable from './components/APTable';
import APFilter from './components/APFilter';

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

function App() {
    const {ap} = useSelector(state => state.xlsxContent.origin);
    return (
        <div style={{ marginLeft: '20px', marginRight: '20px', marginTop: '10px' }}>
            <XlsxReader />
            { ap && <APFilter /> }
            { ap && <APTable /> }
        </div>
    );
}

export default App;
