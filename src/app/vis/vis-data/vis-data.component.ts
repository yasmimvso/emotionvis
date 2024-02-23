import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import 'anychart';
import { FrameService } from '../../services/alphaframe.service'
import { GroundingService } from '../../services/grounding.service'
import { CATEGORIES  } from '../alphavis/alphavis.categories'
import { iou } from '../alphavis/alphavis.iou'

interface Data {
  frame_id: number;
  person_id: any;
  bb_x1: any;
  bb_y1: any;
  bb_x2: any;
  bb_y2: any;
  class: any;
  valid?: string;
  x?: any;
  y?: any;
};


@Component({
  selector: 'app-vis-data',
  templateUrl: './vis-data.component.html',
  styleUrls: ['./vis-data.component.css']
})
export class VisDataComponent implements OnInit{

  constructor(private uploadRs: FrameService, private uploadGt: GroundingService) { }

  dadosRs: Data[] = []
  dadosGt: Data[] = []
  resultado: any
  tecnologia : string = "AlphaVis"
  imagemUrl: string = `https://oraculo.cin.ufpe.br/api/alphaction/frames1`


  filter: any = [];

  ngOnInit(): void {
    this.loadInfo();
  }

  changeImg(frame:any){
      this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${frame}`
  }

  calcErroByAction(result:any){

    let qtdByAcion: any= []
    this.resultado.forEach((action:any)=>{

      let qtd = result.filter((item:any) => item.valid == "false" && item.class == action)
      qtdByAcion.push([ CATEGORIES[action], qtd.length]);
    })

    let arrayObject : any = []

    qtdByAcion.forEach((item:any)=>{

      let data : any  = {x: item[0], value: item[1],
        normal:  {
          fill: "#3db5e7",
          hatchFill: "percent50",
          fontColor: "#000000"
        },
        hovered: {
          fill: "#3db5e7",
          hatchFill: "percent50",
          outline: {
            enabled: true,
            width: 6,
            fill: "#404040",
            stroke: null
          },
          fontColor: "#000000"
        },
        selected: {
          outline: {
            enabled: true,
            width: 6,
            fill: "#404040",
            stroke: null
          },
          fontColor: "#000000"
        }
    }
    arrayObject.push(data)
  })

  this.creatPieChart(arrayObject)
  }

  calcQtdByAction(){

    let qtdByAcion: any= []
    this.resultado = [... new Set(this.dadosRs.map((item)=>item.class))];

    this.resultado.forEach((action:any)=>{

      let qtd = this.dadosRs.filter((item:any) => item.class == action)
      qtdByAcion.push([ CATEGORIES[action], qtd.length]);
    })

    this.createChart( qtdByAcion);
  }

  loadInfo(){
    let result : Data[]

    this.uploadRs.getDataRs().subscribe((dadosRs) => {
    this.dadosRs = dadosRs;
    if(this.dadosRs) this.calcQtdByAction();

   })

   this.uploadGt.getDataGt().subscribe((dadosGt) => {
      this.dadosGt = dadosGt;
      result = iou(this.dadosRs,this.dadosGt)
      //console.log(result)
      this.calcErroByAction(result)
      this.errorByFrames(result)
   })

  }

  createChart(dados:any) {
    let chart = anychart.column(dados);
    chart.title('Quantidade de ações detectadas');
    chart.container('container-bar');
    chart.draw();
  }

  creatPieChart(data:any){
    let Piechart = anychart.pie(data);
    Piechart.title('Errros (%) por ação');
    Piechart.container('container-pie');
    Piechart.draw();
  }

  errorByFrames(dados:any){
  let errorByFrame : any = []

  let result : any = []
  result = dados.filter((item:any)=>{return item.valid == "false"})

  result.forEach((item: any) => {

    if (errorByFrame[item.frame_id] === undefined) {
        errorByFrame[item.frame_id] = 1;
    }
    else errorByFrame[item.frame_id] += 1;
    console.log(errorByFrame[item.frame_id]);
  })

let errorArray: [string, number][] = Object.entries(errorByFrame);

errorArray = errorArray.filter(([frame_id, count]) => count > 2);

errorArray.sort((a, b) => (b[1] as number) - (a[1] as number));

errorArray.forEach(([frame_id, count]) => {
    this.filter.push({'name': count, 'frame': frame_id})
});

}

}
