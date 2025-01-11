import { useState, useEffect } from "react";
import { breakpoints } from "../config/breakpoints";

type Breakpoint = keyof typeof breakpoints;

// Individual media query hooks
export const useIsMobile = () =>
  useMediaQuery(`(max-width: ${breakpoints.md}px)`);
export const useIsTablet = () =>
  useMediaQuery(
    `(min-width: ${breakpoints.md + 1}px) and (max-width: ${breakpoints.lg}px)`
  );
export const useIsDesktop = () =>
  useMediaQuery(`(min-width: ${breakpoints.lg + 1}px)`);

// Generic media query hook
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query list
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    media.addEventListener("change", listener);

    // Cleanup
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// Breakpoint specific hooks
export const useBreakpoint = (
  breakpoint: Breakpoint,
  direction: "up" | "down" = "down"
) => {
  const query =
    direction === "down"
      ? `(max-width: ${breakpoints[breakpoint]}px)`
      : `(min-width: ${breakpoints[breakpoint]}px)`;

  return useMediaQuery(query);
};

// Hook to get current breakpoint
export const useCurrentBreakpoint = () => {
  const breakpointEntries = Object.entries(breakpoints).reverse();

  for (const [breakpoint, width] of breakpointEntries) {
    const isMatch = useMediaQuery(`(min-width: ${width}px)`);
    if (isMatch) return breakpoint;
  }

  return "xs";
};
