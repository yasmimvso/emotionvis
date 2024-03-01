import { Component,  OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router,  ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { calcPoint } from '../alphavis/alphavis.points';
import { CATEGORIES } from '../alphavis/alphavis.categories';



import * as d3 from 'd3';
import * as h337 from 'heatmap.js';
import { contourDensity } from "d3-contour";
interface Data {
  frame_id: any;
  person_id: any;
  bb_x1: any;
  bb_y1: any;
  bb_x2: any;
  bb_y2: any;
  class: any;
  valid: any;
  x: any;
  y: any;
  width: any;
  height: any;
};

interface Canva{
  x: any;
  y: any;
  label: string;
  color: string
};

interface DataPoint {
  x: number;
  y: number;
  value: number;
}

interface HeatmapData {
  max: number;
  min: number;
  data: DataPoint[];
}

@Component({
  selector: 'app-alphavis-id',
  templateUrl: './alphavis-id.component.html',
  styleUrls: ['./alphavis-id.component.css']
})
export class AlphavisIdComponent {

  @ViewChild('chartLine', { static: true }) private chartLine!: ElementRef;
  @ViewChild('imgView', {static:true }) private imgView! : ElementRef;
  @ViewChild('dataPlot',{static: true}) private dataPlot! : ElementRef;
  @ViewChild('barCharts', {static: true}) private barCharts! : ElementRef;
  @ViewChild('heatmap', {static: true}) private heatmapInf! : ElementRef;

  context: any;

  filter: any =[
    {label: "all", selected: false}
  ];

  sliderValue: number = 0;
  minValue: number = 32;
  maxValue: number = 1800;
  stepValue: number = 5;
  isPlaying: boolean = false;
  intervalId: any;
  imagemUrl: any;
  xhttp: number = 0;
  opacityRange: number = 0.46;

  state: any;
  idP : any;

  dataSet: Canva[] = [];
  chartOptions: any = {};
  chartInfo: any = {}

  paragrafos: any = [];
  filterSelect : any = [];
  dadosHeatMap: any = [];

  heatmapBackgroundColor : string = "white";
  flagAlter: boolean = true;
  heatmapColorAlter: string [] = ['rgba(240, 235, 235, 0.807)', 'white'];

constructor(private router: Router, private location: Location) {
    location.getState();

    const navigation = this.router.getCurrentNavigation();
    this.state = navigation!.extras.state as {
      frame: number,
      id: any,
      classId: any,
      dados: Data[]
    };

    this.idP = this.state.id;
}


ngOnInit(): void {

  const reloadedRecently = sessionStorage.getItem('reloadedRecently');
  if (!reloadedRecently) {
    this.load();
    sessionStorage.setItem('reloadedRecently', 'true');
  } else {
    sessionStorage.removeItem('reloadedRecently');
  }

}

load() {
  window.location.reload();
}

async atualizarImagem() {

  this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${this.sliderValue}`;

  //await this.esperar(850);

  this.plotRec();
  this.atualizaParagrafo();


}

async esperar(milissegundos: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milissegundos));
}
ngAfterViewInit() {

  this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${this.state.frame}`;

  this.sliderValue = this.state.frame;
  this. minValue = this.state.dados[0].frame_id;
  this.maxValue =  this.state.dados[ this.state.dados.length-1].frame_id;
  this.filterSelect =  CATEGORIES[this.state.classId];

  this.idP = this.state.id;

  let dadoById = this.state.dados.filter((item:any)=>{
    return item.person_id == this.state.id;
  })

  let valoresDistintos = [...new Set(dadoById.map((item:any) => CATEGORIES[item.class]))];

    let res = {};
    valoresDistintos.forEach((d)=>{
      if(d == CATEGORIES[this.state.classId])  res = {label: d, selected: true}
      else res = {label: d, selected: false}

      this.filter.push(res);
    })

   this.atualizaParagrafo();
   this.PlotdataSet();
   this.ChartLine();
   this.percInf();
   this.heatMap();
}


changeByFilter(event:any){

      if(event.target.name == 'all'){
        if(event.target.checked){
          this.filter[0].selected = !this.filter[0].selected;
          this.filter.forEach((item:any)=>{
              if(item.label != 'all'){
                if(item.selected) {
                  item.selected = !item.selected;
                }
              }

          })

        }else{
          this.filter[0].selected = !this.filter[0].selected;
        }
      }else {
        if(!event.target.checked){

          this.filter.forEach((item:any) =>{
            if(item.label == event.target.name){
              item.selected = false;
            }
          })

        }else {
          if(this.filter[0].selected) this.filter[0].selected = !this.filter[0].selected;
          this.filter.forEach((item:any)=>{
            if(item.label == event.target.name){
              item.selected = true;
            }
          });

        }

    }

  let resultado = Array();

  if(this.filter[0].selected){
    this.filter.filter((item:any)=>{
      if(item.label != 'all'){
        resultado.push(item.label);
       }
     }
    );
  }
  else{
    resultado = this.filter.filter((item:any)=>{
      return item.selected == true;
    });

    resultado = [... new Set(resultado.map((item:any)=>item.label))];
  }
  this.filterSelect = resultado;

  this.plotRec();

}


public percInf(){
   let result = this.state.dados.filter((item:any)=>{
        return (item.person_id == this.state.id)
   })

   let action = [... new Set(result.map((item:any)=>item.class))];

   let data_certo = Array();
   let data_error = Array();
   let i=0;
   action.forEach((act:any)=>{

      let valid = result.filter((d:any)=>{
        return (d.class == act) && d.valid == "true";
      })
      let invalid = result.filter((d:any)=>{
        return (d.class == act) && d.valid == "false";
      })

      i++;
      let soma = valid.length + invalid.length;

      let aux = {label: CATEGORIES[act], y: (valid.length)/soma, color: "#3db5e7", x:i};
      let aux1 = {label: CATEGORIES[act], y: (invalid.length)/soma,color: "rgb(190, 186, 186)", x:i};

      data_certo.push(aux);
      data_error.push(aux1);
   })

    const width =  this.barCharts.nativeElement.clientWidth;
    const height =  this.barCharts.nativeElement.clientHeight * 1.3;

          this.chartInfo = {
            interactivityEnabled: true,
            width: width,
            height: height,
            animationEnabled: true,
            theme: "light2",
            axisY:{
              gridThickness: 0
            },
            axisX: {
              title: "Métricas por ações(%)",
              gridThickness: 0,
              lineThickness: 0,
              tickThickness: 0

            },
            data: [{
              type: "stackedBar",
              showInLegend: true,
              yValueFormatString: "#0.#%",
              legendText: "true",
              color: "#3db5e7",
              dataPoints: data_certo
            },{
              type: "stackedBar",
              showInLegend: true,
              yValueFormatString: "#0.#%",
              legendText: "false",
              color: "rgb(190, 186, 186)",
              dataPoints: data_error
            }]
          }
}


PlotdataSet(){

  var aux =new Array();
  let validAnt = '';

  let id = this.state.dados.filter((d:any)=>{
    return d.person_id == this.state.id;
  });

  let act = [... new Set(id.map((item:any)=>item.class))];


    act.forEach((action)=>{

      validAnt = '';
      aux.length = 0;
      let rs = id.filter((d:any)=>{
          return d.class == action;
      })
      rs.forEach((item:any)=>{

        if(validAnt == "") validAnt = item.valid;

        if(validAnt == item.valid){

            if((item.frame_id - 1) != aux[aux.length-1]){
                  let n:any = action;
                  let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt=="true"? "#3db5e7":"rgb(190, 186, 186)"};
                  this.dataSet.push(objeto);
                  aux.length = 0;

            }
            else if((aux.length + 1 == rs.length) && (item.frame_id - 1) == aux[aux.length-1]){
              let n:any = action;
              let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt=="true"? "#3db5e7":"rgb(190, 186, 186)"};
              this.dataSet.push(objeto);
              aux.length = 0;
            }

        }
        else if(aux.length == 1 && item.frame_id - 1 != aux[aux.length-1]){
              let n:any = action;
              let objeto = {x: act.indexOf(action),y: [aux[0],aux[0]+1], label: CATEGORIES[n], color: validAnt=="true"? "#3db5e7":"rgb(190, 186, 186)"};
              this.dataSet.push(objeto);
              aux.length = 0;
        }
        else{

            let n:any = action;
            let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt=="true"? "#3db5e7":"rgb(190, 186, 186)"};
            this.dataSet.push(objeto);
            aux.length = 0;
            validAnt = item.valid;

        }
        aux.push(item.frame_id);

      })

    })
}

 calcSize(val1: any, val2: any){
  return Math.abs(val2 - val1);
}

plotRec(): void{


  let widthImg = this.imgView.nativeElement.clientWidth;
  let heightImg = this.imgView.nativeElement.clientHeight;

  let Drs: Data[] = [];


  Drs = this.state.dados.filter((d:any) => d.frame_id === this.sliderValue && d.person_id == this.state.id
   && this.filterSelect.includes(CATEGORIES[d.class]));

  let result:number[] = [];


  let chartContainer: any = d3.select("#chart-container")
  chartContainer.selectAll("*").remove();

  if(Drs.length>0){

    Drs.forEach(d=>{

        result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2, widthImg, heightImg);
        if(result){

           d.x = result[0];
           d.y = result[1];
           d.width =  this.calcSize(d.bb_x1 * widthImg, d.bb_x2 * widthImg );
           d.height = this.calcSize(d.bb_y1 * heightImg, d.bb_y2 * heightImg);
        }
    });

          let i = 8;

          let svg= chartContainer
          .append("svg")
          .attr("width", `${widthImg}px`)
          .attr("height", `${heightImg}px`);

          const rect = svg.selectAll("g")
           .data(Drs)
           .enter()
           .append("g");


           rect.append("rect")
            .attr("x", (d: any) => d.x - (d.width/2))
            .attr("y", (d: any) => d.y - (d.height/2))
            .attr("width", (d: any) => d.width)
            .attr("height",(d: any) => d.height)
            .attr("stroke", (d: any)=> d.valid == "true"?"green": "red")
            .attr("fill", 'none');

          rect.append("text")
            .attr("x", (d: any) =>d.x - (d.width/2) + 15)
            .attr("y", (d: any) =>  d.y - (d.height/2) - 5 + (i-=8))
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("fill", (d: any)=> d.valid == "true"? "green": "red")
            .text((d:any)=>CATEGORIES[d.class]);

    }
}

changeBackgroundColor() {

  if(this.flagAlter){
    this.heatmapBackgroundColor = this.heatmapColorAlter[0];
    this.flagAlter = !this.flagAlter;
  }
  else{
    this.heatmapBackgroundColor = this.heatmapColorAlter[1];
    this.flagAlter = !this.flagAlter;
  }
}

heatMap():void{

    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = this.heatmapInf.nativeElement.clientWidth - margin.left - margin.right,
    height = this.heatmapInf.nativeElement.clientHeight - margin.top - margin.bottom;

    var svg = d3.select("#heatmap")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

        const color = d3.scaleSequential(d3.interpolateBlues)
        .domain([-0.1, 0.75]);

          let dados: any = this.state.dados.filter((d:any) => d.person_id == this.state.id);
          dados.forEach((d:any)=>{

            let result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2,this.heatmapInf.nativeElement.clientWidth, this.heatmapInf.nativeElement.clientHeight);
            if(result){
              let object = {x: result[0], y:result[1]};
              this.dadosHeatMap.push(object);
            }
        });

            var x = d3.scaleLinear()
          .domain([0, 300]).nice()
          .range([ margin.left, width - margin.right ]);

          var y = d3.scaleLinear()
          .domain([0, 300]).nice()
          .range([ height - margin.bottom, margin.top ]);

          var densityData = contourDensity()
          .x((d:any) => x(d.x))
          .y((d:any) => y(d.y))
          .size([400, 320])
          .bandwidth(20)
          .thresholds(30)
          (this.dadosHeatMap);


          svg.selectAll("path")
          .data(densityData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("fill", "none")
          .attr("stroke", "#84c0e9");


          svg.insert("g", "g")
          .selectAll("path")
          .data(densityData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("fill", function(d) { return color(d.value ); })
}

atualizaParagrafo():void{
  let rst = this.state.dados.filter((d:any)=>{
    return (d.person_id == this.state.id) && (d.frame_id <= this.sliderValue);
  })


  let rstClass:any = [];
  rstClass = [... new Set(rst.map((item:any)=>item.class))];

  this.paragrafos = rstClass;

}

public ChartLine(){

  this.chartOptions = {
    interactivityEnabled: true,
    width: this.chartLine.nativeElement.clientWidth,
    height:this.chartLine.nativeElement.clientHeight * 1.3,
		animationEnabled: true,
		theme: "light2",
    axisY:{
      gridThickness: 0
    },
    options: {
      legend: {
         display: false
      },
    },
		axisX: {
			title: "Ações por Frame",
      gridThickness: 0,

		},
		data: [{
			type: "rangeBar",
			showInLegend: true,
			legendText: "Frames(s)",
			color: "white",
			dataPoints: this.dataSet
		}]
	}

}


  togglePlay() {

    this.isPlaying = !this.isPlaying;

    if (!this.isPlaying) {

      clearInterval(this.intervalId);
    } else {

      this.intervalId = setInterval(() => {
        if (this.sliderValue < this.maxValue) {
          this.sliderValue += this.stepValue;
          this.atualizarImagem();
          //this.plotRec();
        } else {
          this.sliderValue = this.minValue;
          this.atualizarImagem();
           //this.plotRec();
        }
      }, 600);
    }
  }

}

