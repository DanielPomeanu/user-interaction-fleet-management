import React, { useRef, useState, useEffect } from 'react';
import "../../styles/utils/ScrollableContainer.css";

export default function ScrollableContainer({ children, className = '', ...rest }) {
    const containerRef = useRef(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        function updateIndicators() {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            setShowLeft(scrollLeft > 0);
            setShowRight(scrollLeft + clientWidth < scrollWidth);
        }

        updateIndicators();

        el.addEventListener('scroll', updateIndicators);
        window.addEventListener('resize', updateIndicators);

        return () => {
            el.removeEventListener('scroll', updateIndicators);
            window.removeEventListener('resize', updateIndicators);
        };
    }, []);

    return (
        <div
            className={`scrollable-container ${className}`.trim()}
            ref={containerRef}
            {...rest}
        >
            <div className={`scroll-indicator left${showLeft ? ' visible' : ' hidden'}`}/>
            <div className={`scroll-indicator right${showRight ? ' visible' : ' hidden'}`}/>
            {children}
        </div>
    );
}