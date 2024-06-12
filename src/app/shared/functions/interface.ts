export interface Data{
  frame_id: number;
  person_id?: any;
  bb_x1: any;
  bb_y1: any;
  bb_x2: any;
  bb_y2: any;
  class: any;
  valid?: boolean;
  x?: any;
  y?: any;
  width?: any;
  height?: any;
}

export interface Interval{
  init: number;
  end: number;
  label: string;
  color: string
};

export interface Filter{
  label: String;
  selected: boolean;
  disabled: boolean;
}
