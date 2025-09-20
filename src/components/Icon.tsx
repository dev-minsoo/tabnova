import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface IconProps {
  name: string;
  size?: number;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  alt?: string;
}

function getTooltipPosition(rect: DOMRect, position: TooltipPosition, tooltipText: string) {
  const offset = 8;
  const padding = 12; // 경계로부터의 최소 여백

  // 툴팁 크기 추정 (대략적인 계산)
  const tooltipWidth = tooltipText.length * 6 + 12; // 문자당 6px + padding
  const tooltipHeight = 20;

  // 뷰포트 크기
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let finalPosition = position;
  let left, top, transform;

  // 기본 위치 계산
  switch (position) {
    case 'top':
      left = rect.left + rect.width / 2;
      top = rect.top - offset;
      transform = 'translate(-50%, -100%)';

      // 상단 경계 체크
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

      // 하단 경계 체크
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

      // 좌측 경계 체크
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

      // 우측 경계 체크
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

  // 좌우 중앙 배치 툴팁의 좌우 경계 체크
  if (finalPosition === 'top' || finalPosition === 'bottom') {
    const tooltipLeft = left - tooltipWidth / 2;
    const tooltipRight = left + tooltipWidth / 2;

    if (tooltipLeft < padding) {
      left = padding + tooltipWidth / 2;
    } else if (tooltipRight > viewportWidth - padding) {
      left = viewportWidth - padding - tooltipWidth / 2;
    }
  }

  return {
    left,
    top,
    transform
  };
}

export function Icon({
  name,
  size = 16,
  tooltip,
  tooltipPosition = 'top',
  onClick,
  className = '',
  alt = ''
}: IconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const iconRef = useRef<HTMLImageElement>(null);
  const iconSrc = `icons/${name}${size}.png`;

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

  const iconElement = (
    <img
      ref={iconRef}
      src={iconSrc}
      alt={alt || name}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    />
  );

  if (tooltip) {
    return (
      <>
        {iconElement}
        {showTooltip && createPortal(
          <div
            style={tooltipStyle}
            className="px-1.5 py-0.5 text-[10px] text-white bg-gray-800 rounded whitespace-nowrap shadow-lg pointer-events-none"
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