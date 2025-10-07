import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SvgIconProps } from '@mui/material/SvgIcon';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface IconButtonProps {
  icon: React.ReactElement<SvgIconProps>;
  size?: 'small' | 'medium' | 'large';
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

function getTooltipPosition(rect: DOMRect, position: TooltipPosition, tooltipText: string) {
  const offset = 8;
  const padding = 12;
  const tooltipWidth = tooltipText.length * 6 + 12;
  const tooltipHeight = 20;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let finalPosition = position;
  let left, top, transform;

  switch (position) {
    case 'top':
      left = rect.left + rect.width / 2;
      top = rect.top - offset;
      transform = 'translate(-50%, -100%)';
      if (top - tooltipHeight < padding) {
        finalPosition = 'bottom';
        top = rect.bottom + offset;
        transform = 'translate(-50%, 0)';
      }
      break;

    case 'bottom':
      left = rect.left + rect.width / 2;
      top = rect.bottom + offset;
      transform = 'translate(-50%, 0)';
      if (top + tooltipHeight > viewportHeight - padding) {
        finalPosition = 'top';
        top = rect.top - offset;
        transform = 'translate(-50%, -100%)';
      }
      break;

    case 'left':
      left = rect.left - offset;
      top = rect.top + rect.height / 2;
      transform = 'translate(-100%, -50%)';
      if (left - tooltipWidth < padding) {
        finalPosition = 'right';
        left = rect.right + offset;
        transform = 'translate(0, -50%)';
      }
      break;

    case 'right':
      left = rect.right + offset;
      top = rect.top + rect.height / 2;
      transform = 'translate(0, -50%)';
      if (left + tooltipWidth > viewportWidth - padding) {
        finalPosition = 'left';
        left = rect.left - offset;
        transform = 'translate(-100%, -50%)';
      }
      break;

    default:
      left = rect.left + rect.width / 2;
      top = rect.top - offset;
      transform = 'translate(-50%, -100%)';
  }

  if (finalPosition === 'top' || finalPosition === 'bottom') {
    const tooltipLeft = left - tooltipWidth / 2;
    const tooltipRight = left + tooltipWidth / 2;

    if (tooltipLeft < padding) {
      left = padding + tooltipWidth / 2;
    } else if (tooltipRight > viewportWidth - padding) {
      left = viewportWidth - padding - tooltipWidth / 2;
    }
  }

  return { left, top, transform };
}

export function IconButton({
  icon,
  size = 'medium',
  tooltip,
  tooltipPosition = 'top',
  onClick,
  className = '',
  disabled = false
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const iconRef = useRef<HTMLDivElement>(null);

  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const updateTooltipPosition = () => {
    if (iconRef.current && showTooltip && tooltip) {
      const rect = iconRef.current.getBoundingClientRect();
      const position = getTooltipPosition(rect, tooltipPosition, tooltip);
      setTooltipStyle({
        position: 'fixed',
        left: position.left,
        top: position.top,
        transform: position.transform,
        zIndex: 999999
      });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
      return () => {
        window.removeEventListener('scroll', updateTooltipPosition);
        window.removeEventListener('resize', updateTooltipPosition);
      };
    }
  }, [showTooltip, tooltipPosition]);

  const handleClick = (e: React.MouseEvent) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  const iconElement = (
    <div
      ref={iconRef}
      className={`inline-flex items-center justify-center ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {React.cloneElement(icon, { sx: { width: sizeMap[size], height: sizeMap[size] } })}
    </div>
  );

  if (tooltip) {
    return (
      <>
        {iconElement}
        {showTooltip && createPortal(
          <div
            style={{
              ...tooltipStyle,
              backgroundColor: 'var(--text-primary)',
              color: 'var(--bg-primary)',
            }}
            className="px-1.5 py-0.5 text-[10px] rounded whitespace-nowrap shadow-lg pointer-events-none"
          >
            {tooltip}
          </div>,
          document.body
        )}
      </>
    );
  }

  return iconElement;
}
