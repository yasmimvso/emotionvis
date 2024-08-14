import {Data} from './interface'
export function iou(Datars: Data[], Datagt: Data[]){

  let frame_atual : number= 0;
  const new_Data_Union: Data[] = [];
  const frame_max : number = Datars[Datars.length - 1].frame_id;

  while (frame_atual <= frame_max) {

    function intersection_of_union(gt: Data, pred: Data): number {
      const Xa = Math.max(gt.person_id, pred.bb_x1);
      const Ya = Math.max(gt.bb_x1, pred.bb_y1);
      const Xb = Math.min(gt.bb_y1, pred.bb_x2);
      const Yb = Math.min(gt.bb_x2, pred.bb_y2);

      const interArea = Math.max(0, Xb - Xa + 1) * Math.max(0, Yb - Ya + 1);

      const boxAArea = (gt.bb_y1 - gt.person_id + 1) * (gt.bb_x2 - gt.bb_x1 + 1);
      const boxBArea = (pred.bb_x2 - pred.bb_x1 + 1) * (pred.bb_y2 - pred.bb_y1 + 1);

      return interArea / (boxAArea + boxBArea - interArea);
    }

    const Dgt = Datagt.filter((dados) => dados.frame_id == frame_atual);


    const Drs = Datars.filter((dados) => dados.frame_id == frame_atual);

    const iou_by_pred: number[] = [];
    let iou_result = 0;

    if(Drs.length && Dgt.length){
      // tratar quando Drs < Dgt e vice versa
      for (let i = 0; i < Drs.length; i++) {
        for (let g = 0; g < Dgt.length; g++) {
          iou_result = intersection_of_union(Dgt[g], Drs[i]);

          if (iou_result >= 0.75) {
            iou_by_pred.push(g);
          }
        }

        for (const index of iou_by_pred) {
          // e se tiver mais de um compatível? Testar diferença ao tirar o break
          /**
           *  const Xa = Math.max(gt.person_id, pred.bb_x1);
          const Ya = Math.max(gt.bb_x1, pred.bb_y1);
          const Xb = Math.max(gt.bb_y1, pred.bb_x2);
          const Yb = Math.max(gt.bb_x2, pred.bb_y2);
           */
          // essa forma limita que identifique + de uma acão identificada
          Drs[i].class_gt = (Dgt[index].bb_y2-1);
          if ((Dgt[index].bb_y2-1)== Drs[i].class) {
            Drs[i].valid = true;
            // break;
          } else {
            Drs[i].valid = false;
          }
          new_Data_Union.push(Drs[i]);
        }

        iou_by_pred.length = 0;
        // new_Data_Union.push(Drs[i]);
      }
    }
    else if(Drs.length == 0 && Dgt.length!=0){
     // console.log(`Tem em DGT no frame ${frame_atual} mas não tem em DRs`);

      Dgt.forEach((d:any)=>{

        let object ={
          frame_id: d.frame_id,
          bb_x1: d.person_id,
          bb_y1: d.bb_x1,
          bb_x2: d.bb_y1,
          bb_y2: d.bb_x2,
          person_id: undefined,
          class: null,
          class_gt: parseInt(d.bb_y2) - 1, // grounding começa com 1 a análise das ações
          valid: false,
        }
        //console.log(object)
        new_Data_Union.push(object);
      })

    }
    else if(Drs.length != 0 && Dgt.length==0){
      // foi identificado ações porém não deveria
       for(let i=0; i<Drs.length; i++){
         let result : Data = Drs[i];
         result.valid = false;
         result.class_gt = null;
         new_Data_Union.push(result);
       }
    }
    // caso final é quando nenhum dos dois identificarama ações

    frame_atual++;
  }

  return new_Data_Union;
}
