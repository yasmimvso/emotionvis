
interface Data {
  frame_id: number;
  person_id: any;
  bb_x1: any;
  bb_y1: any;
  bb_x2: any;
  bb_y2: any;
  class: any;
  valid?: string;
  x?:any;
  y?: any;
};

export function iou(Datars: Data[], Datagt: Data[]){
  
  let frame_atual = 0;
  const new_Data_Union: Data[] = [];
  const frame_max = Datars[Datars.length - 1].frame_id;

  while (frame_atual <= frame_max) {

    function intersection_of_union(gt: Data, pred: Data): number {
      const Xa = Math.max(gt.person_id, pred.bb_x1);
      const Ya = Math.max(gt.bb_x1, pred.bb_y1);
      const Xb = Math.max(gt.bb_y1, pred.bb_x2);
      const Yb = Math.max(gt.bb_x2, pred.bb_y2);

      const interArea = Math.max(0, Xb - Xa + 1) * Math.max(0, Yb - Ya + 1);

      const boxAArea = (gt.bb_y1 - gt.person_id + 1) * (gt.bb_x2 - gt.bb_x1 + 1);
      const boxBArea = (pred.bb_x2 - pred.bb_x1 + 1) * (pred.bb_y2 - pred.bb_y1 + 1);

      return interArea / boxAArea + boxBArea - interArea;
    }

    const Dgt = Datagt.filter((dados) => dados.frame_id == frame_atual);

    const Drs = Datars.filter((dados) => dados.frame_id == frame_atual);

    const iou_by_pred: number[] = [];
    let iou_result = 0;

    // se Dgt.lenth < 0 e Drs.gt>0. Então Drs está com erros
    // Se um dos dois não existir. Temos erros

    // deveria reescrever sobre gt

    for (let i = 0; i < Drs.length; i++) {
      for (let g = 0; g < Dgt.length; g++) {
        iou_result = intersection_of_union(Dgt[g], Drs[i]);

        if (iou_result >= 0.75) {
          iou_by_pred.push(g);
        }
      }

      for (const index of iou_by_pred) {
        if (Dgt[index].bb_y2-1 == Drs[i].class) {
          Drs[i].valid = "true";
          break;
        } else {
          Drs[i].valid = "false";
        }
      }

      iou_by_pred.length = 0;
      new_Data_Union.push(Drs[i]);
    }

    frame_atual++;
  }

  return new_Data_Union;
}
