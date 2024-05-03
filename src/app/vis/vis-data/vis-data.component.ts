import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FrameService } from '../../services/alphaframe.service'
import { GroundingService } from '../../services/grounding.service'
import { CATEGORIES  } from '../../shared/functions/alphavis.categories'
import { iou } from '../../shared/functions/alphavis.iou'
import {plotInfo} from '../../shared/functions/vis-data.infoPlot'
import {infoCard} from '../../shared/functions/vis-data.infoPlot'

import { forkJoin } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Data } from 'src/app/shared/functions/interface';

import 'anychart';
import * as d3 from 'd3';

interface Dados {
  qtd: number;
  nome: string;
  image?: string;
}

// APENAS PRINTAR COISAS SE EXISTIR IMAGENS
@Component({
  selector: 'app-vis-data',
  templateUrl: './vis-data.component.html',
  styleUrls: ['./vis-data.component.css']
})
export class VisDataComponent implements OnInit{
  @ViewChild('img', { static: true }) private img!: ElementRef;
  @ViewChild('containerBar', {static: true}) private chartBar!: ElementRef;

  constructor(private uploadRs: FrameService, private uploadGt: GroundingService) { }


  dadosRs: Data[] = []
  dadosGt: Data[] = []
  resultado: any
  frame: any;

  tecnologia : string = "AlphAction"
  imagemUrl: string = `https://oraculo.cin.ufpe.br/api/alphaction/frames1`
  infoCard: any = []

  resultIou: Data[] = []
  filter: any = [];
  id: boolean = false;

  ngOnInit(): void {
    this.loadInfo();
  }

  callInfoByFrame(data:any, wdt:any, hgt:any, frame:any){
     plotInfo(wdt, hgt, frame, data);
  }

  changeImg(frame:any){
      this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${frame}`

      this.frame = infoCard(this.resultIou, frame)
      this.callInfoByFrame(this.resultIou,this.img.nativeElement.clientWidth, this.img.nativeElement.clientHeight, frame);
  }

  calcErroByAction(result:any){

    let qtdByAcion: any= []
    let imgUrl : any;
    this.resultado.forEach((action:any)=>{

      let qtdIndv  = result.filter((item:any) => item.valid == false && item.class == action);
      let qtdTotal = result.filter((item:any) => item.class == action);

      if([10,13,11,79,16].indexOf(action)>=0){
        imgUrl = `../../../assets/img/img${action}.png`
      } else imgUrl = '../../../assets/img/img14.png';

      let object : Dados = {nome: CATEGORIES[action], qtd: (qtdIndv.length/qtdTotal.length), image: imgUrl}

      qtdByAcion.push(object);
    })

  //   let arrayObject : any = []

  //   qtdByAcion.forEach((item:any)=>{

  //     let data : any  = {x: item[0], value: item[1],
  //       normal:  {
  //         fill: "#3db5e7",
  //         hatchFill: "percent50",
  //         fontColor: "#000000"
  //       },
  //       hovered: {
  //         fill: "#3db5e7",
  //         hatchFill: "percent50",
  //         outline: {
  //           enabled: true,
  //           width: 6,
  //           fill: "#404040",
  //           stroke: null
  //         },
  //         fontColor: "#000000"
  //       },
  //       selected: {
  //         outline: {
  //           enabled: true,
  //           width: 6,
  //           fill: "#404040",
  //           stroke: null
  //         },
  //         fontColor: "#000000"
  //       }
  //   }
  //   arrayObject.push(data)
  // })

  this.creatPieChart(qtdByAcion)
  }

  calcQtdByAction(){

    let qtdByAcion: any= [];
    let imgUrl: any,  qtd: any;

    this.resultado = [... new Set(this.dadosRs.map((item)=>item.class))];
    this.resultado.forEach((action:any)=>{
      qtd = this.dadosRs.filter((item:any) => item.class == action)

      if([10,13,11,79,16].indexOf(action)>=0){
        imgUrl = `../../../assets/img/img${action}.png`
      } else imgUrl = '../../../assets/img/img14.png';

      let object : Dados = {nome: CATEGORIES[action], qtd: qtd.length, image: imgUrl}
      qtdByAcion.push(object);

    })

    this.createChart( qtdByAcion);
  }

  loadInfo(){
    forkJoin([
      this.uploadRs.getDataRs().pipe(shareReplay()),
      this.uploadGt.getDataGt().pipe(shareReplay())
    ]).subscribe(([dadosRs, dadosGt]) => {
      this.dadosRs = dadosRs;
      this.calcQtdByAction();
      this.dadosGt = dadosGt;
      this.resultIou = iou(this.dadosRs, this.dadosGt);
      this.calcErroByAction(this.resultIou);
      this.errorByFrames(this.resultIou);
    });

  }

  createChart(dados:Dados[]) {

    let margin = {top: 30, right: 30, bottom: 30, left: 70},
    width = this.chartBar.nativeElement.clientWidth - margin.left - margin.right,
    height =  this.chartBar.nativeElement.clientHeight - margin.top - margin.bottom;

    let svg = d3.select("#containerBar")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 80 + "," + margin.top + ")");

    var y = d3.scaleBand()
      .range([height, 0])
      .domain(dados.map((d:any) => d.nome))
      .padding(0.2);


    let x = d3.scaleLinear()
      .domain([0, d3.max(dados, (d:any) => d.qtd)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text");

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(dados)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d:any) => 10)
      .attr("y", (d:any) => y(d.nome)!)
      .attr("height", y.bandwidth() * 0.9)
      .attr("width", (d:any) => x(d.qtd) * 0.8)
      .attr("fill", "#3498db");

    svg
      .selectAll(".class-image")
      .data(dados)
      .enter()
      .append("image")
      .attr("class", "class-image")
      .attr("xlink:href", (d:any) => d.image)
      .attr("x", (d:any) => x(d.qtd) * 0.8 + 15)
      .attr("y", (d:any) => y(d.nome)!)
      .attr("width", y.bandwidth());

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "1.3rem")
      .style("color", "rgb(103, 104, 104)")
      .text("Total de ações detectadas");
  }

  creatPieChart(dados:Dados[]){
    // let Piechart = anychart.pie(data);
    // Piechart.title('Errros (%) por ação')
    // Piechart.container('container-pie');
    // Piechart.draw();

    let margin = {top: 30, right: 30, bottom: 30, left: 70},
    width = this.chartBar.nativeElement.clientWidth - margin.left - margin.right,
    height =  this.chartBar.nativeElement.clientHeight - margin.top - margin.bottom;

    let svg = d3.select("#containerPie")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + 80 + "," + margin.top + ")");

    var y = d3.scaleBand()
      .range([height, 0])
      .domain(dados.map((d:any) => d.nome))
      .padding(0.2);


    let x = d3.scaleLinear()
      .domain([0, d3.max(dados, (d:any) => d.qtd)])
      .range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text");

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(dados)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d:any) => 10)
      .attr("y", (d:any) => y(d.nome)!)
      .attr("height", y.bandwidth() * 0.9)
      .attr("width", (d:any) => x(d.qtd) * 0.8)
      .attr("fill", "#3498db");

    svg
      .selectAll(".class-image")
      .data(dados)
      .enter()
      .append("image")
      .attr("class", "class-image")
      .attr("xlink:href", (d:any) => d.image)
      .attr("x", (d:any) => x(d.qtd) * 0.8 + 15)
      .attr("y", (d:any) => y(d.nome)!)
      .attr("width", y.bandwidth());

    svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "1.3rem")
      .style("color", "rgb(103, 104, 104)")
      .text("Porcentagem de erros por ação");


  }

  errorByFrames(dados:any){

      let errorByFrame : any = [];
      let result : any = [];

      result = dados.filter((item:any)=>{return item.valid == false && item.frame_id <= 1800})

      result.forEach((item: any) => {

        if (errorByFrame[item.frame_id] === undefined) {
            errorByFrame[item.frame_id] = 1;
        }
        else errorByFrame[item.frame_id]++;
      })

      let errorArray: [string, number][] = Object.entries(errorByFrame);

      errorArray = errorArray.filter(([frame_id, length]) => length >= 2);

      errorArray.sort((a, b) => (b[1] as number) - (a[1] as number));

      errorArray.forEach(([frame_id, length]) => {
          this.filter.push({'length': length, 'frame': frame_id})
      });

  }

}
