"use client";

import * as React from "react";
import { cn, generateInitials } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Signal Design System -- Avatar
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: { box: "h-6 w-6", text: "text-[10px]", dot: "h-2 w-2 -bottom-0 -right-0" },
  md: { box: "h-8 w-8", text: "text-xs", dot: "h-2.5 w-2.5 -bottom-0.5 -right-0.5" },
  lg: { box: "h-10 w-10", text: "text-sm", dot: "h-3 w-3 -bottom-0.5 -right-0.5" },
} as const;

const statusColors = {
  online: "bg-emerald-500 ring-2 ring-zinc-950",
  offline: "bg-zinc-600 ring-2 ring-zinc-950",
  busy: "bg-red-500 ring-2 ring-zinc-950",
} as const;

// Deterministic pastel background based on name
function stringToColor(str: string): string {
  const hues = [210, 260, 330, 30, 160, 190, 280, 350, 50, 120];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hues[Math.abs(hash) % hues.length];
  return `hsl(${hue}, 50%, 28%)`;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full name -- used for initials fallback and color generation */
  name?: string;
  /** Image URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  size?: keyof typeof sizeMap;
  /** Status indicator dot */
  status?: keyof typeof statusColors;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, name = "", src, alt, size = "md", status, style, ...props },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false);
    const s = sizeMap[size];
    const initials = generateInitials(name);
    const showImage = src && !imgError;

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          "rounded-full overflow-hidden",
          "font-semibold select-none",
          s.box,
          s.text,
          !showImage && "text-zinc-200",
          className
        )}
        style={{
          backgroundColor: showImage ? undefined : stringToColor(name),
          ...style,
        }}
        aria-label={alt ?? name}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}

        {/* Status dot */}
        {status && (
          <span
            className={cn(
              "absolute rounded-full",
              s.dot,
              statusColors[status]
            )}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

// -- AvatarStack (overlapping avatars) ----------------------------------------

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum number of avatars to show before a +N counter */
  max?: number;
  size?: keyof typeof sizeMap;
  children: React.ReactNode;
}

function AvatarStack({
  className,
  max = 4,
  size = "md",
  children,
  ...props
}: AvatarStackProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - max;
  const s = sizeMap[size];

  return (
    <div
      className={cn("flex items-center -space-x-2", className)}
      {...props}
    >
      {visible.map((child, i) => (
        <div
          key={i}
          className="relative ring-2 ring-zinc-950 rounded-full"
          style={{ zIndex: visible.length - i }}
        >
          {child}
        </div>
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            "relative inline-flex items-center justify-center",
            "rounded-full ring-2 ring-zinc-950",
            "bg-zinc-800 text-zinc-400 font-medium",
            s.box,
            s.text
          )}
          style={{ zIndex: 0 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

AvatarStack.displayName = "AvatarStack";

export { Avatar, AvatarStack };
