import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ServerContext } from '@/state/server';
import stripAnsi from 'strip-ansi';
import { SocketEvent } from '@/components/server/events';
import CopyOnClick from '@/components/elements/CopyOnClick';

const MAX_BUFFERED_LINES = 5000;

const containerStyle: React.CSSProperties = {
    fontSize: '15px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1.5%',
    marginRight: '1.5%',
};

const iconStyle: React.CSSProperties = {
    fontSize: '15px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
};

const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    right: '3.5%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#ffffff',
    padding: '5px 10px',
    borderRadius: '5px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    zIndex: 99999,
    opacity: 1,
    transition: 'opacity 0.2s ease-in-out',
};

/**
 * Blueprint component injected into the Pterodactyl server terminal "CommandRow".
 *
 * We keep a rolling in-memory buffer of recent CONSOLE_OUTPUT lines so copying stays fast and we
 * don't accumulate unbounded memory on long-running servers.
 */
const CopyConsole: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [isTooltipVisible, setTooltipVisible] = useState(false);

    const addLog = useCallback((data: string) => {
        const line = data.startsWith('>') ? data.substring(1) : data;

        setLogs((prevLogs) => {
            const next = [...prevLogs, line];
            return next.length > MAX_BUFFERED_LINES ? next.slice(-MAX_BUFFERED_LINES) : next;
        });
    }, []);

    useEffect(() => {
        if (!connected || !instance) return;

        instance.addListener(SocketEvent.CONSOLE_OUTPUT, addLog);
        return () => instance.removeListener(SocketEvent.CONSOLE_OUTPUT, addLog);
    }, [addLog, connected, instance]);

    const copyText = useMemo(() => stripAnsi(logs.join('\n')), [logs]);

    return (
        <div style={containerStyle}>
            <CopyOnClick text={copyText}>
                <i
                    className="fa-solid fa-copy text-white cursor-pointer"
                    onMouseEnter={() => setTooltipVisible(true)}
                    onMouseLeave={() => setTooltipVisible(false)}
                    style={iconStyle}
                />
            </CopyOnClick>
            {isTooltipVisible && <div style={tooltipStyle}>Copy console log</div>}
        </div>
    );
};

export default CopyConsole;
