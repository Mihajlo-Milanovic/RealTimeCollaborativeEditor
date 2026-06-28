import {useAccessStore} from "./accessStore";
import {accessProxy} from "./accessProxy";
import {DocumentAction} from "./accessPolicy";

/**
 * Reaktivni hook za UI. Pretplaćuje se na promenu uloge (zustand) da bi se
 * komponenta ponovo iscrtala, a samu ODLUKU prepušta Proxy-ju (jedina tačka).
 */
export function useCanAccess(action: DocumentAction): boolean {
    // pretplata: re-render kada se uloga promeni
    useAccessStore((state) => state.role);
    return accessProxy.can(action);
}
