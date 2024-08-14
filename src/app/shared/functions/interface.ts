export interface Data{
  frame_id: number;
  person_id?: any;
  bb_x1: any;
  bb_y1: any;
  bb_x2: any;
  bb_y2: any;
  class: any;
  valid?: boolean;
  class_gt?: any;
  iou?: number;
  x?: any;
  y?: any;
  width?: any;
  height?: any;
  accuracy?:number;
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
