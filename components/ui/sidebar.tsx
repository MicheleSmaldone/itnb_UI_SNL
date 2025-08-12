"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft } from "lucide-react"

interface SidebarContextType {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultOpen)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded, setExpanded } = React.useContext(SidebarContext) || {}
  const [isHovering, setIsHovering] = React.useState(false)
  const [isInteracting, setIsInteracting] = React.useState(false)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  
  // Function to check if the user is interacting with a dropdown menu
  const isInteractingWithDropdown = React.useCallback(() => {
    // Check if any dropdown menu is open
    return !!document.querySelector('[data-state="open"]');
  }, []);
  
  // Expand sidebar on hover and collapse when not hovering
  React.useEffect(() => {
    if ((isHovering || isInteracting || isInteractingWithDropdown()) && !expanded) {
      setExpanded?.(true)
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    } else if (!isHovering && !isInteracting && !isInteractingWithDropdown() && expanded) {
      // Add a longer delay before collapsing to prevent accidental collapses
      // when the mouse briefly leaves the sidebar area or when interacting with dropdowns
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      hoverTimeoutRef.current = setTimeout(() => {
        // Double-check that we're still not interacting with a dropdown before collapsing
        if (!isInteractingWithDropdown()) {
          setExpanded?.(false)
        }
        hoverTimeoutRef.current = null
      }, 300) // Reduced from 800ms to 300ms for quicker collapse
    }
    
    // Cleanup timeout on unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [isHovering, isInteracting, expanded, setExpanded, isInteractingWithDropdown])
  
  // Add a global event listener to detect dropdown menu interactions
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Check if the mouse is over a dropdown menu
      const isOverDropdown = !!e.composedPath().find(el => 
        el instanceof HTMLElement && 
        (el.getAttribute('role') === 'menu' || el.hasAttribute('data-radix-dropdown-menu'))
      );
      
      if (isOverDropdown && !isInteracting) {
        setIsInteracting(true);
      }
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isInteracting]);
  
  return (
    <div 
      className="relative flex"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={() => setIsInteracting(true)}
      onMouseUp={() => {
        // Add a small delay before setting isInteracting to false
        // to ensure dropdown menus have time to open
        setTimeout(() => setIsInteracting(false), 300)
      }}
      onClick={() => {
        // Keep sidebar expanded when clicked
        setIsInteracting(true)
        // Reset after a delay to allow for dropdown interaction
        setTimeout(() => setIsInteracting(false), 1000)
      }}
    >
      {/* Wider edge hover area - only visible when sidebar is collapsed */}
      {!expanded && (
        <div 
          className="absolute left-0 top-0 w-8 h-full z-50 cursor-pointer"
          onMouseEnter={() => setExpanded?.(true)}
        />
      )}
      
      <aside
        className={cn(
          "will-change-transform rounded-xl overflow-hidden",
          expanded ? "w-64 opacity-100" : "w-0 opacity-0",
          "transition-all duration-500 ease-out",
          className
        )}
      >
        <div className="h-full overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </div>
      </aside>
      <button
        onClick={() => setExpanded?.(!expanded)}
        onMouseEnter={() => !expanded && setExpanded?.(true)}
        className={cn(
          "absolute z-[100]",
          "flex h-10 w-10 items-center justify-center rounded-full",
          "border-2 border-gray-300 bg-white text-gray-600",
          "dark:border-gray-600 dark:bg-[#02102e] dark:text-gray-300",
          "hover:bg-gray-100 dark:hover:bg-[#041c4d] transition-all duration-500",
          "will-change-transform shadow-lg",
          expanded ? "left-60" : "left-2"
        )}
      >
        <ChevronLeft className={cn("h-6 w-6 transition-transform duration-500", expanded ? "" : "rotate-180")} />
      </button>
    </div>
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = React.useContext(SidebarContext) || {}
  return (
    <div className={cn("p-4 transition-all duration-300", className)} {...props}>
      {expanded ? props.children : <div className="h-8" />}
    </div>
  )
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-2", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-0.5", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  icon?: React.ReactNode
  label?: string
  labelClassName?: string
  secondaryLabel?: string
  secondaryLabelClassName?: string
  children?: React.ReactNode
}

// AnimatedText component to handle letter-by-letter animation
function AnimatedText({ text, expanded }: { text: string; expanded: boolean }) {
  // Calculate a reasonable delay per character based on text length
  // For longer text, we want faster animation to keep total time reasonable
  const baseDelay = Math.max(20, Math.min(50, 500 / text.length));
  
  return (
    <span className="flex overflow-hidden whitespace-nowrap">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={cn(
            "transition-all will-change-transform",
            expanded
              ? "opacity-100 translate-y-0 max-w-[1em]"
              : "opacity-0 translate-y-4 max-w-0",
          )}
          style={{
            transitionDelay: expanded 
              ? `${index * baseDelay}ms` 
              : `${(text.length - index - 1) * baseDelay}ms`,
            transitionDuration: "300ms",
            transitionProperty: "opacity, transform, max-width",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

export function SidebarMenuButton({ 
  className, 
  isActive,
  icon,
  label,
  labelClassName,
  secondaryLabel,
  secondaryLabelClassName,
  children,
  ...props 
}: SidebarMenuButtonProps) {
  const { expanded } = React.useContext(SidebarContext) || {}
  
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-md transition-colors",
        "px-3 py-2 text-gray-800 hover:bg-gray-400/50 dark:text-gray-100 dark:hover:bg-white/10",
        isActive && "bg-gray-400 text-gray-900 font-semibold dark:bg-white/20 dark:text-white",
        !expanded && "justify-center px-2",
        "will-change-[width,padding]",
        className
      )}
      {...props}
    >
      {icon}
      <div 
        className={cn(
          "flex flex-col font-medium overflow-hidden w-full",
          expanded 
            ? "opacity-100 max-w-[200px] ml-0" 
            : "opacity-0 max-w-0 ml-[-10px]",
          "transition-all duration-500 ease-out"
        )}
      >
        {label && (
          <div className="flex justify-between items-center w-full">
            <span className={labelClassName}>
              <AnimatedText text={label} expanded={!!expanded} />
            </span>
            {secondaryLabel && expanded && (
              <span className={cn("text-[10px] text-gray-500 dark:text-gray-400", secondaryLabelClassName)}>
                {secondaryLabel}
              </span>
            )}
          </div>
        )}
        {expanded && children}
      </div>
    </button>
  )
} 