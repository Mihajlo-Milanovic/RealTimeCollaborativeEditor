import {useCallback, useEffect, useRef, useState} from "react";

type TUseCommentsResizeOptions = {
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    // uz koju ivicu prozora je panel prikačen (određuje kako se
    // iz pozicije miša računa širina panela)
    side?: "left" | "right";
};

type TUseCommentsResize = {
    width: number;
    isResizing: boolean;
    startResize: () => void;
};

/**
 * Sva logika za promenu širine bočnog panela prevlačenjem.
 *
 * - drži trenutnu širinu panela u state-u,
 * - startResize() pokreće resize operaciju (poziva se iz onMouseDown na handle-u),
 * - dok je resize aktivan sluša pomeranje miša na celom prozoru,
 * - računa novu širinu na osnovu pozicije miša i ivice uz koju je panel
 *   prikačen (side: "right" za komentare, "left" za file explorer),
 * - ograničava širinu na [minWidth, maxWidth],
 * - završava resize na otpuštanje miša.
 *
 * Pozivaoci (page.tsx, Sidebar.tsx) samo koriste vraćene vrednosti.
 */
export function useCommentsResize(
    options: TUseCommentsResizeOptions = {}
): TUseCommentsResize {

    const {
        initialWidth = 384,
        minWidth = 250,
        maxWidth = 800,
        side = "right",
    } = options;

    const [width, setWidth] = useState<number>(initialWidth);
    const [isResizing, setIsResizing] = useState<boolean>(false);

    // ref se koristi da event handler uvek čita aktuelnu vrednost bez re-bind-ovanja
    const isResizingRef = useRef<boolean>(false);

    const startResize = useCallback(() => {
        isResizingRef.current = true;
        setIsResizing(true);
    }, []);

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizingRef.current) return;
            // širina = razdaljina od kursora do ivice uz koju je panel prikačen
            const newWidth = side === "left"
                ? e.clientX
                : window.innerWidth - e.clientX;
            setWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
        };

        const stopResize = () => {
            isResizingRef.current = false;
            setIsResizing(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopResize);

        // spreči selekciju teksta dok se prevlači
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = "none";

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResize);
            document.body.style.userSelect = previousUserSelect;
        };
    }, [isResizing, minWidth, maxWidth, side]);

    return {width, isResizing, startResize};
}
