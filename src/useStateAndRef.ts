import { useRef, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

export default function useStateAndRef<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>, React.RefObject<S>] {
  const [state, setState] = useState(initialState);
  const ref = useRef(state);
  ref.current = state;

  return [state, setState, ref];
}
