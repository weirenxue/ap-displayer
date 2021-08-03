import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDesktop, faGlobe, faDatabase, faFolderOpen, faTerminal, faQuestion } from '@fortawesome/free-solid-svg-icons'

const rdp = window.node_rdp;
const open = window.open; 

// ms-rdp
function rdpConnect(uri, username, password, thenFun){
    rdp({
        address: uri,
        username: username,
        password: password
    }).then(thenFun);
}

const ActionIcon = (props) => {
    // 不同協定對應到不同 icon
    const protocolIconMap = {
            'rdp': faDesktop,
            'http': faGlobe,
            'https': faGlobe,
            'mssql': faDatabase,
            'smb': faFolderOpen,
            'ssh': faTerminal
    };
    // 點擊 icon 後要做的事情
    const handleClick = useCallback(
        (actionInfo) => {
            switch (actionInfo.protocol) {
                case 'rdp':
                    rdpConnect(actionInfo.uri, actionInfo.account, actionInfo.password, () => {});
                    break;
                case 'http':
                case 'https':
                    open(actionInfo.uri);
                    break;
                case 'mssql':
                    console.log('mssql');
                case 'ssh':
                    console.log('ssh');
                    break;
                case 'ftp':
                    console.log('ftp');
                    break;
                case 'sftp':
                    console.log('sftp');
                    break;
                case 'smb':
                    console.log('smb');
                    break;
                default:
                    break;
            }
        }, []
    );
    return (
        <FontAwesomeIcon 
            icon={protocolIconMap[props.info.protocol] ?? faQuestion} 
            style={{cursor: 'pointer'}}
            onClick={() => handleClick(props.info)}
        />
    );
}

export default ActionIcon;