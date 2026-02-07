/**
 * Polyfill for React.useActionState (React 19) when running on React 18.
 * Required by @clerk/nextjs KeylessCreatorOrReader. Remove when upgrading to React 19.
 */
import React from 'react';

if (typeof (React as any).useActionState === 'undefined') {
  const useState = React.useState;
  const useTransition = React.useTransition;
  const useCallback = React.useCallback;
  const useRef = React.useRef;

  const useActionState = function useActionStateImpl<TState>(
    action: (prevState: TState | null, formData: unknown) => TState | Promise<TState>,
    initialState: TState | null
  ): [TState | null, (formData?: unknown) => void, boolean] {
    const [state, setState] = useState<TState | null>(initialState);
    const [isPending, startTransition] = useTransition();
    const stateRef = useRef(state);
    stateRef.current = state;

    const dispatch = useCallback(
      (formData?: unknown) => {
        startTransition(() => {
          const result = action(stateRef.current, formData);
          if (result != null && typeof (result as Promise<TState>).then === 'function') {
            (result as Promise<TState>).then(setState);
          } else {
            setState(result as TState);
          }
        });
      },
      [action]
    );

    return [state, dispatch, isPending];
  };

  (React as any).useActionState = useActionState;
}

export {};
