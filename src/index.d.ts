import type { ReactElement } from 'react';

export interface ScreenReaderStatusMessageProps {
  /** Text to announce. Pass an empty string to clear the live region. */
  message: string;
  /** Increment for distinct events that reuse identical message text. */
  sequence?: number;
}

export declare function ScreenReaderStatusMessage(
  props: ScreenReaderStatusMessageProps
): ReactElement;
