import React from "react";

export function useClickAway(cb: (e: Event)=>void) {
  const ref = React.useRef<HTMLElement>(null);
  const refCb = React.useRef(cb);

  React.useLayoutEffect(() => {
    refCb.current = cb;
  });

  React.useEffect(() => {
    const handler = (e: Event) => {
      const element = ref.current;
      if (element && !element.contains(e.target as HTMLElement)) {
        refCb.current(e);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return ref;
}