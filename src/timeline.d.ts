type Label = string | string[]

/**
 * The description of a single entry on the timeline.
 */
export type TimelineEntry = {
  /** Start date of the timeline entry */
  start: Date | string;
  /** End date of the timeline entry */
  end: Date | string;
  /** Label for the timeline entry */
  label: Label;
  /** Additional properties */
  [property: string]: any;
}

/**
 * An overlay entry to be displayed on the timeline
 */
export type OverlayEntry = {
  /** Date for the overlay */
  date: Date | string;
  /** Label for the overlay entry */
  label: Label;
}