import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import stripAnsi from 'strip-ansi';
import { SocketEvent } from '@/components/server/events';
import CopyOnClick from '@/components/elements/CopyOnClick'; // Ensure this path is correct

const copyConsole: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const { connected, instance } = ServerContext.useStoreState((state) => state.socket);
    const [isTooltipVisible, setTooltipVisible] = useState(false); // State to manage tooltip visibility

    // Function to handle incoming logs
    const addLog = (data: string) => {
        setLogs((prevLogs) => [...prevLogs, data.startsWith('>') ? data.substring(1) : data]);
    };

    // UseEffect to manage log listening
    useEffect(() => {
        if (!connected || !instance) return;

        // Listen for console output logs
        instance.addListener(SocketEvent.CONSOLE_OUTPUT, addLog);

        return () => {
            // Cleanup listener on unmount
            instance.removeListener(SocketEvent.CONSOLE_OUTPUT, addLog);
        };
    }, [connected, instance]);

    // Prepare the logs for copying
    const logData = stripAnsi(logs.join('\n')); // Strip ANSI codes from logs

    return (
        <div style={{ fontSize: '15px', justifyContent: 'center', display: 'flex', flexDirection: 'column', marginLeft: '1.5%', marginRight: '1.5%' }}>
            <CopyOnClick text={logData}>
                <i
                    className="fa-solid fa-copy text-white cursor-pointer" // Font Awesome icon
                    onMouseEnter={() => setTooltipVisible(true)} // Show tooltip on mouse enter
                    onMouseLeave={() => setTooltipVisible(false)} // Hide tooltip on mouse leave
                    style={{ fontSize: '15px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }} // Adjust size as necessary
                ></i>

            </CopyOnClick>
            {isTooltipVisible && ( // Conditional rendering for tooltip
                <div style={{
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
                }}>
                    Copy console log
                </div>
            )}
        </div>
    );
};

export default copyConsole;
