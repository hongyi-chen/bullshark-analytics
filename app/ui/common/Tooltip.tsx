"use client";

import { useState, useRef, useId, ReactNode, CSSProperties } from 'react';
import css from './Tooltip.module.scss';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <span
      ref={triggerRef}
      className={css.trigger}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-describedby={isVisible ? tooltipId : undefined}
      tabIndex={0}
    >
      {children}
      {isVisible && (
        <span
          id={tooltipId}
          className={`${css.tooltip} ${css[position]}`}
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  );
}
