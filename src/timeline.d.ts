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
  [property: string]: unknown;
}

/**
 * An overlay entry to be displayed on the timeline
 */
export type OverlayEntry = {
  /** Date for the overlay */
  date: Date | string;
  /** Label for the overlay entry */
  label: Label;
  /** Colour for the overlay */
  colour?: string;
  /** Whether the overlay should be persistent */
  persist?: boolean;
}

type HTMLColour = string;

export type CategoryDetails = {
  /** Colour of the category, to be used for bar colours */
  colour: HTMLColour;
  /** Label to use in place of the object key */
  label?: string;
  /** Contrasting colour, to be used for overlaid text on main colour */
  contrastColour?: HTMLColour;
}