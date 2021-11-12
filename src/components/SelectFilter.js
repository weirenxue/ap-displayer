import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { 
    setXlsxFromSelectFilter
} from '../models/actions';

import { Form, Row, FloatingLabel } from 'react-bootstrap';

const SelectFilter = (props) => {
    const {metadata, ap} = useSelector(state => state.xlsxContent.origin);
    const dispatch = useDispatch();
    const [filterValue, setFilterValue] = useState([]);
    const [filterColumn, setFilterColumn] = useState([]);

    let filterSelect = useRef([]);

    useEffect(() => {
        if (metadata !== undefined) {
            let filterColumn_copied = metadata.filter((e) => e['filterPriority'] !== '')
            // 根據優先權大到小排序
            .sort((a, b) => {
                let defaultPriority = -9999;
                let [aOrder, bOrder] = [parseInt(a['filterPriority']), parseInt(b['filterPriority'])];
                // 若值不為空字串，且不為數字，則令其優先權為 defaultPriority
                [aOrder, bOrder] = [isNaN(aOrder) ? defaultPriority : aOrder, isNaN(bOrder) ? defaultPriority : bOrder];
                return bOrder - aOrder;
            });
            // 初始化 filterValue
            setFilterValue(Array(filterColumn_copied.length).fill('*'));
            // 需要篩選的欄位
            setFilterColumn(filterColumn_copied);
        }
    }, [metadata]);

    useEffect(() => {
        let content_copied = ap.slice();
        content_copied = content_copied && content_copied.filter((e) => {
            let ret = true;
            filterColumn.forEach((_e, _i) => {
                // 若為 * 代表全選
                if (filterSelect.current[_i].value === '*') return;
                ret = ret && (e[_e['apHeader']] === filterSelect.current[_i].value);
            });
            return ret;
        });
        dispatch(setXlsxFromSelectFilter({
            metadata: metadata,
            ap: content_copied
        }));
    }, [filterValue, filterColumn, ap, metadata, dispatch])

    // Select 元素
    let selects = filterColumn && filterColumn.map((e, i, self) => {
        let apHeader = e['apHeader']
        let displayHeader = e['displayHeader']
        let options = ap && ap.filter((e) => {
            // 連動調整 Select 選項
            let ret = true;
            self.forEach((__e, __i) => {
                // 比自己篩選順序還要後面或相等的 column 就不用過濾了
                if (__i >= i) return;
                // select 不存在或值為 wildcard，皆不用過濾
                if (filterSelect.current[__i] === undefined || filterSelect.current[__i].value === '*') return;

                ret = ret && (e[__e['apHeader']] === filterSelect.current[__i].value);
            });
            return ret;
        })
        .map((e) => e[apHeader]) // 只要內容
        .filter((e, i, self) => { return self.indexOf(e) === i; }) // 去除重複
        .sort() // 排序內容
        .map((e) => <option key={e} value={e}>{e}</option>); // 得到 option

        return (
            <Form.Label column sm={Math.max(12 / self.length, 3)} xs="12" key={apHeader}>
                <FloatingLabel controlId={`"floatingSelect-${apHeader}"`} label={`${i + 1}. ${displayHeader}`}>
                    <Form.Select aria-label="Floating label select example"
                        onChange={(e) => {
                            let filterValue_copied = filterValue.slice();
                            filterValue_copied[i] = e.target.value;
                            setFilterValue(filterValue_copied);
                        }} 
                        ref={(e) => filterSelect.current[i] = e}
                    >
                        <option value="*">ALL - ({options.length})</option>
                        {options}
                    </Form.Select>
                </FloatingLabel>
            </Form.Label>
        );
    });

    return (
        <Form.Group as={Row} {...props}>
            {selects}
        </Form.Group>
    );
}

export default SelectFilter;