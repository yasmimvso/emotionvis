import { Component,  OnInit, ViewChild, ElementRef} from '@angular/core';
import { Router,  NavigationExtras} from '@angular/router';
import { Location } from '@angular/common';
import { calcPoint } from '../../shared/functions/alphavis.points';
import { CATEGORIES } from '../../shared/functions/alphavis.categories';
import { Data, Canva}  from '../../shared/functions/interface'
import * as d3 from 'd3';
import { heatMap } from 'src/app/shared/functions/heatmap';

@Component({
  selector: 'app-alphavis-id',
  templateUrl: './alphavis-id.component.html',
  styleUrls: ['./alphavis-id.component.css']
})
export class AlphavisIdComponent {

  @ViewChild('chartLine', { static: true }) private chartLine!: ElementRef;
  @ViewChild('imgView', {static:true }) private imgView! : ElementRef;
  @ViewChild('barCharts', {static: true}) private barCharts! : ElementRef;
  @ViewChild('heatmap', {static: true}) private heatmapInf! : ElementRef;

  filter: any =[
    {label: "All", selected: false, disabled: false}
  ];


  sliderValue: number = 0;
  minValue: number = 32;
  maxValue: number = 1800; // esse valor foi dado diante da quantidade de frames que foi cortado
  stepValue: number = 5;
  isPlaying: boolean = false;
  xhttp: number = 0;
  opacityRange: number = 0.43;
  sunnydisplay : boolean = false;

  dataSet: Canva[] = [];

  state: any;
  idP : any;
  context: any;
  intervalId: any;
  imagemUrl: any;
  rota: any;

  chartOptions: any = {};
  chartInfo: any = {}

  paragrafos: any = [];
  filterSelect : any = [];
  dadosHeatMap: any = [];


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
    this.sliderValue = this.state.frame;
    this. minValue = this.state.dados[0].frame_id;
    // this.maxValue =  this.state.dados[ this.state.dados.length-1].frame_id;
    this.filterSelect =  CATEGORIES[this.state.classId];

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

atualizarImagem() {

  this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${this.sliderValue}`;
  this.plotRec();
  this.atualizaParagrafo();

}

ngAfterViewInit() {

  this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${this.state.frame}`;

  let res = {};

  let dadosById = this.state.dados.filter((item:any)=>{
    return (item.person_id == this.state.id) && (item.frame_id <=1800);
  })

  let valoresDistintos = [...new Set(dadosById.map((item:any) => CATEGORIES[item.class]))];

    valoresDistintos.forEach((d)=>{
      if(d == CATEGORIES[this.state.classId])  res = {label: d, selected: true, disabled: false}
      else res = {label: d, selected: false, disabled: false}

      this.filter.push(res);
    })

    let dados: any = this.state.dados.filter((d:any) => d.person_id == this.state.id && d.valid == false);
    let width = this.heatmapInf.nativeElement.clientWidth;
    let height = this.heatmapInf.nativeElement.clientHeight;

   this.plotRec();
   this.atualizaParagrafo();
   this.PlotdataSet(dadosById);
   this.ChartLine();
   this.percInf(dadosById);
   heatMap(dados, width, height);
}


changeByFilter(event:any){

  let resultado = Array();

      if(event.target.name == 'All'){
        this.filter[0].selected = !this.filter[0].selected;
        this.filter[0].disabled = true;

        if(event.target.checked){

          this.filter.forEach((item:any)=>{
              if(item.label != 'All'){
                resultado.push(item.label);
                if(item.selected) {
                  item.selected = !item.selected;
                }

              }

          });
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

    if(!this.filter[0].selected){
      resultado = this.filter.filter((item:any)=>{
        return item.selected == true;
      });
      resultado = [... new Set(resultado.map((item:any)=>item.label))];
    }
    this.filterSelect = resultado;
    this.plotRec();
}


public percInf(result: Data[]){
  let action = [...new Set(result.map((item) => item.class))];

  let data = Array();
  let i = 0;

  // função para calcular quantidades de erros e acertos por ação
  action.forEach((act) => {
      let valid = result.filter((d) => (d.class === act) && d.valid === true);
      let invalid = result.filter((d) => (d.class === act) && d.valid === false);

      i++;
      let soma = valid.length + invalid.length;

      let value = {
          label: CATEGORIES[act],
          acerto: valid.length / soma,
          erro: invalid.length / soma
      };
      data.push(value);
  });

  const margin = { top: 30, right: 10, bottom: 20, left: 100 };
  const width = (this.barCharts.nativeElement.clientWidth - margin.left - margin.right)/1.3 ;
  const height = (this.barCharts.nativeElement.clientHeight - margin.top - margin.bottom)/1.3 ;

  const svg = d3.select('#barchart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const tipo = Object.keys(data[0]).filter(d => d != "label");
  const actions = data.map(d => d.label);

  const stackedData = d3.stack()
      .keys(tipo)(data);

  const x = d3.scaleLinear()
      .domain([0, 1]).nice()
      .range([0, width]);

  const y = d3.scaleBand()
      .domain(actions)
      .range([0, height])
      .padding(0.25);

  const xAxis = d3.axisBottom(x).ticks(5, '~s');
  const yAxis = d3.axisLeft(y);

  svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove());

  svg.append("g")
      .call(yAxis)
      .call(g => g.select('.domain').remove());

  const layers = svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => d.key === "erro" ? "red" : "green");

  layers.selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(d[0]))
      .attr('y', (d:any) => y(d.data['label'])!)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d[1]) - x(d[0]));
}

PlotdataSet(id:Data[]){

  let aux = new Array();
  let validAnt:any = '';

  let act = [... new Set(id.map((item:any)=>item.class))];

    act.forEach((action)=>{

      validAnt = '';
      aux.length = 0;
      let rs = id.filter((d:any)=>{
          return d.class == action;
      })
      rs.forEach((item:any)=>{

        if(validAnt == '') validAnt = item.valid;

        if(validAnt == item.valid){

            if((item.frame_id - 1) != aux[aux.length-1]){
                  let n:any = action;
                  let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt === true ? "#3db5e7":"rgb(190, 186, 186)"};
                  this.dataSet.push(objeto);
                  aux.length = 0;

            }
            else if((aux.length + 1 == rs.length) && (item.frame_id - 1) == aux[aux.length-1]){
              let n:any = action;
              let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt === true ? "#3db5e7":"rgb(190, 186, 186)"};
              this.dataSet.push(objeto);
              aux.length = 0;
            }

        }
        else if(aux.length == 1 && item.frame_id - 1 != aux[aux.length-1]){
              let n:any = action;
              let objeto = {x: act.indexOf(action),y: [aux[0],aux[0]+1], label: CATEGORIES[n], color: validAnt === true? "#3db5e7":"rgb(190, 186, 186)"};
              this.dataSet.push(objeto);
              aux.length = 0;
        }
        else{

            let n:any = action;
            let objeto = {x: act.indexOf(action),y: [aux[0],aux[aux.length-1]], label: CATEGORIES[n], color: validAnt === true ? "#3db5e7":"rgb(190, 186, 186)"};
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
            .attr("stroke", (d: any)=> "white")
            .attr("fill", 'none');
           
          // se d.height * 2 >= height = colocar menor a largura
          // caso contrário, coloca maior a altura
           rect.append("rect")
            .attr("x", (d: any) => d.x - d.width/1.5)
            .attr("y", (d: any) => {
              if(d.height * 2.5 >= heightImg) return d.y - d.height/1.2;
              else return d.y - d.height/1.1;
            })
            .attr("width", (d: any) => d.width/0.75)
            .attr("height",(d: any) => {
              if(d.height * 2.5 >= heightImg) return d.height / 3;
              else return d.height / 2;
            })
            .attr("stroke", (d: any)=> "white")
            .attr("fill", "white");

          rect.append("text")
            .attr("x", (d: any) =>d.x * 1.1)
            .attr("y", (d: any) =>  d.y - (d.height/2) - 5 + (i-=8))
            .attr("text-anchor", "end")
            .attr("dominant-baseline", "middle")
            .attr("fill", "black")
            .attr("font-weight", "bold")
            .attr("font-size", "1.4rem")
            .attr("stroke",  (d: any)=> d.valid == true ? "green": "red")
            .attr("stroke-width", 0.5)
            .attr("font-size", "1.4rem")
            .text((d:any)=>CATEGORIES[d.class]);

    }
}
toAlpha(){

    const navigationExtras: NavigationExtras = {
      state: {
        frame: this.state.frame,
      }
    };

   this.router.navigate(['/alphavis'],  {state: {frame: this.state.frame}});
}

changeVisibility():void{

  let result = this.heatmapInf.nativeElement

  if(!this.sunnydisplay){
    result.setAttribute('style', 'visibility: visible');
    this.sunnydisplay = !this.sunnydisplay;
  }
  else {
    result.setAttribute('style', 'visibility: hidden');
    this.sunnydisplay = !this.sunnydisplay;
  }

}

atualizaParagrafo():void{


  this.paragrafos.length = 0;
  let rst = this.state.dados.filter((d:Data)=>{
    return (d.person_id == this.state.id) && (d.frame_id <= this.sliderValue);
  })

  let rstClassQtd = rst.map((item:Data)=>CATEGORIES[item.class]);

  // console.log("map class rts walk:::\n", rstClassQtd.filter((item:string)=> item == "walk").length);

  let rstClass:any =  [... new Set(rst.map((item:any)=>item.class))];
  var objectClass = {img: 0, categorie: "string", quantideCat: 0}; // setando tipificação

  rstClass.forEach((classId:number)=>{
    objectClass = {img: classId, categorie : CATEGORIES[classId],
    quantideCat:rstClassQtd.filter((item:string)=> item == CATEGORIES[classId]).length };

    this.paragrafos.push(objectClass);
  })

}

public ChartLine(){

  this.chartOptions = {
    interactivityEnabled: true,
    width: this.chartLine.nativeElement.clientWidth,
    height:this.chartLine.nativeElement.clientHeight ,
		animationEnabled: true,
		theme: "light2",
    axisY:{
      gridThickness: 0
    },
    options: {
      legend: {
         display: true
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
        } else {
          this.sliderValue = this.minValue;
          this.atualizarImagem();
        }
      }, 600);
    }
  }

}

