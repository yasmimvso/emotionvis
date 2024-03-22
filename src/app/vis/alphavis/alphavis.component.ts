
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FrameService } from '../../services/alphaframe.service'
import { GroundingService } from '../../services/grounding.service'
import { CATEGORIES } from '../../shared/functions/alphavis.categories';
import { iou } from '../../shared/functions/alphavis.iou';
import { calcPoint } from '../../shared/functions/alphavis.points';
import { Router,  NavigationExtras } from '@angular/router';
import { SlideValueService  } from '../../services/slide-value.service'
import { Data }  from '../../shared/functions/interface'
import * as d3 from 'd3';

@Component({
  selector: 'app-alphavis',
  templateUrl: './alphavis.component.html',
  styleUrls: ['./alphavis.component.css']
})

export class AlphavisComponent {

   @ViewChild('chartLine', { static: true }) private chartLine!: ElementRef;
   @ViewChild('imgView', {static:true }) private imgView! : ElementRef;
   @ViewChild('dataPlot',{static: true}) private dataPlot! : ElementRef;

   filter = [
    {label: 'all', selected: false}
   ];

  heightLinePlot: number = 0;
  opacityRange: number = 0.46;
  sliderValue: number = 0;
  minValue: number = 0;
  maxValue: number = 1800;
  stepValue: number = 5;
  rock: number = 0;

  isPlaying: boolean = false;

  widthImg: any;
  heightImg:any;
  intervalId: any;
  teste: any;


  imagemUrl: any = 'https://oraculo.cin.ufpe.br/api/alphaction/frames0';

  dadosRs: Data[] = [];
  dadosGt: Data[] = [];
  data: Data[] = [];


  constructor(private uploadRs: FrameService, private uploadGt: GroundingService,private slidVal: SlideValueService , private router: Router){


    const navigation = this.router.getCurrentNavigation();
    console.log("navigation", navigation);
  }

  atualizarImagem() {
    let result: any = this.slidVal.getSliderValue();

    if(result[0] && !this.sliderValue) this.sliderValue = result[0];

    this.imagemUrl = `https://oraculo.cin.ufpe.br/api/alphaction/frames${this.sliderValue}`;
  }

  changeByFilter(event:any){
        if(event.target.name == 'all'){
          if(event.target.checked){
            this.filter[0].selected = !this.filter[0].selected;
            this.filter.forEach(item =>{
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
            this.filter.forEach(item =>{
              if(item.label == event.target.name){
                item.selected = false;
              }
            })

          }else {
            if(this.filter[0].selected) this.filter[0].selected = !this.filter[0].selected;
            this.filter.forEach(item =>{
              if(item.label == event.target.name){
                item.selected = true;
              }
            });
          }

      }

      this.plotCircle(this.data);
      this.plotChartLine(this.dadosRs);
  }

  ngOnInit(): void{

    window.addEventListener('load', function () {
      console.log("reload")
      localStorage.setItem("sliderValue", JSON.stringify(0));
    });

    this.sliderValue = 0;

    this.atualizarImagem();

    this.uploadRs.getDataRs().subscribe((dadosRs) => {
      this.dadosRs = dadosRs;
      this.callIou();
      this.selecItems(dadosRs);
    });

    this.uploadGt.getDataGt().subscribe((dadosGt) => {
      this.dadosGt = dadosGt;
      this.callIou();
    })
  }

  ngAfterViewInit(): void {
  this.widthImg = this.imgView.nativeElement.clientWidth;
  this.heightImg = this.imgView.nativeElement.clientHeight;

  }

  selecItems(dadosRs:any){

      if(this.data){

         this.filter.length = 0;

        let valoresDistintos = [...new Set(dadosRs.map((item:any) => CATEGORIES[item.class]))];
        this.filter.push({label: 'all', selected: false});

        valoresDistintos.forEach((d:any)=>{
          let res = {label: d, selected: false}
          this.filter.push(res);
        })
      }

  }

  callIou(): void {

    let iouRst: Data[];
    if (this.dadosRs && this.dadosGt) {
      //console.log("ENTREI AQUI, TESTE");
      //console.log(this.dadosGt)
      iouRst = iou(this.dadosRs, this.dadosGt);
      this.data = iouRst;
      this.chartQtd(this.dadosRs); // aqui quantificamos a quantidade de pessoasidentificada pelo algorítimo
      this.plotChartLine(this.data); // aqui analisamos os erros como um todo
    }
    this.plotCircle(this.data);
  }

  plotCircle(data: any):void{

    this.widthImg = this.imgView.nativeElement.clientWidth;
    this.heightImg = this.imgView.nativeElement.clientHeight;

    let Drs: Data[] = [];

    let slc = 0;

    let selected:any;
    selected = [... new Set(this.filter.map((item)=>item.selected))];

    if(selected.indexOf(true)>0){
      slc=1;
    }

    if(!slc || this.filter[0].selected) {
      Drs = data.filter((dados:any) => dados.frame_id === this.sliderValue);
    }else{
      Drs = data.filter((dados:any) => dados.frame_id === this.sliderValue
      && this.filter.some((item) => item.selected && item.label === CATEGORIES[dados.class])
      );
    }
      let result:number[] = [];

        if(Drs.length>0){

          Drs.forEach(d=>{
              result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2, this.widthImg, this.heightImg);
              if(result){
                 d.x = result[0];
                 d.y = result[1];
              }

          });

          //console.log("AQUII", Drs);

         // console.log("DRS PLOT CIRCLE", Drs);

          let chartContainer: any = d3.select("#chart-container");
          chartContainer.selectAll("*").remove();

          let limpar = d3.selectAll("#tooltip");
          limpar.selectAll("*").remove();

                let svg= chartContainer
                .append("svg")
                .attr("width", `${this.widthImg}px`)
                .attr("height", `${this.heightImg}px`);

                const circles = svg.selectAll("g")
                 .data(Drs)
                 .enter()
                 .append("g");

                 circles.append("circle")
                  .attr("cx", (d: any) => d.x)
                  .attr("cy", (d: any) => d.y)
                  .attr("r", "7")
                  .attr("stroke", "black")
                  .style("fill", (d: any) => {
                    if(d.person_id === undefined) return "#ccc";
                    else if(d.valid === true) return "green";
                    else return "red";
                  });

                  var tooltip = d3.select("body")
                  .append("div")
                  .style("position", "absolute")
                  .attr("id", "tooltip")
                  .style("z-index", "10")
                  .style("visibility", "hidden");

                  tooltip.selectAll("*").remove();

                  let lastMousePosition = { x: 0, y: 0 };
                  let tooltipTimer:any;

                  circles
                  .on("mousemove", function (event: any, d: any) {
                      const currentMousePosition = { x: event.pageX, y: event.pageY };
                      if (distance(lastMousePosition, currentMousePosition) > 2) {
                          lastMousePosition = currentMousePosition;
                          showTooltip(event, d);
                          clearTimeout(tooltipTimer);
                          tooltipTimer = setTimeout(() => hideTooltip(), 900);
                      }
                  })
                  .on("mouseleave", function () {
                      hideTooltip();
                  });

              function showTooltip(event: any, d: any) {

                let textInf : string ;

                if(d.person_id === undefined) textInf = 'Pessoa não identificada';
                else textInf = `Id: ${d.person_id? d.person_id: "S/I"}   |  Ação: ${CATEGORIES[d.class]}`;

                  tooltip.style("visibility", "visible")
                      .style("opacity", 1)
                      .text(textInf)
                      .style('background-color', 'floralwhite')
                      .style('border-radius', '5px')
                      .style('padding', '10px')
                      .style("top", (event.pageY + 10) + "px")
                      .style("left", (event.pageX + 10) + "px");
              }

              function hideTooltip() {
                  tooltip.style("visibility", "hidden")
                      .style("opacity", 0);
              }

              function distance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
                  const dx = point1.x - point2.x;
                  const dy = point1.y - point2.y;
                  return Math.sqrt(dx * dx + dy * dy);
              }
              circles.on("click", (event: any, d:any) => {

                  if(d.person_id){

                      this.slidVal.setSliderValue(this.sliderValue);

                      const navigationExtras: NavigationExtras = {
                        state: {
                          frame: this.sliderValue,
                          id: d.person_id,
                          classId: d.class,
                          dados: this.dadosRs
                        }
                      };

                        this.router.navigateByUrl('/alphavis', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['alphavisId'], navigationExtras);
                      });
                  }
              });
        }

  }

  chartQtd(data: any): void {

    const margin = { top: 10, right: 5, bottom: 5, left: 5 };
    const width = this.dataPlot.nativeElement.clientWidth/1.15 - margin.left - margin.right;
    const height = this.dataPlot.nativeElement.clientHeight/1.25  - margin.top - margin.bottom;

    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([height, 0]).padding(0.1);


    let svg: any = d3.select("#dataPlot");

    svg.selectAll("*").remove();

      svg = d3
        .select("#dataPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", `translate(${margin.left},${margin.top})`);

    let classCounts: Record< number, { count: number; image: string }> = {};

    data.forEach((item: any) => {

      const className = item.class;
     // console.log(CATEGORIES[className]);

      if (!classCounts[className]) {
        if([10,13,11,79,16].indexOf(className)>=0)classCounts[className] = {count: 1, image: `../../../assets/img/img${className}.png`};
        else classCounts[className] = {count: 1, image: '../../../assets/img/img14.png'};
      } else {
        classCounts[className].count++;
      }
    });

    //console.log("PLOT INFO ACTION", classCounts)
    const finalData = Object.entries(classCounts).map(([className, { count, image }]) => ({
      class: CATEGORIES[parseInt(className)],
      count: count,
      image: image,
    }));

    x.domain([0, d3.max(finalData, (d:any) => d.count)]);
    y.domain(finalData.map((d: any) => d.class));

    const tooltip = d3.select("#dataPlot")
      .append("div")
      .attr("class", "tooltip")
      .style("background-color", " rgba(240, 235, 235, 0.807)")
      .style("width","7%")
      .style("height","6%")
      .style("border" , "1")
      .style("position", "absolute")
      .style("z-index", "1")
      .style("opacity", 0);

    svg
      .selectAll(".bar")
      .data(finalData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("height", y.bandwidth() * 0.8)
      .attr("width", (d:any) => x(d.count) * 0.8)
      .attr("x", 0)
      .attr("y", (d:any) => y(d.class)!)
      .attr("fill", "#3498db")

      .on("mouseover", function (event: any, d:any) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Ação: ${d.class}<br/>Total: ${d.count}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    svg.selectAll("text")
      .data(finalData)
      .enter()
      .append("text")
      .text((d:any)=>d.count)
      .attr("class", "text")
      .attr("x", 3)
      .attr("fill", "white")
      .attr("y", (d:any) => y(d.class)! + height * 0.1)

    svg
    .selectAll(".class-image")
    .data(finalData)
    .enter()
    .append("image")
    .attr("class", "class-image")
    .attr("xlink:href", (d:any) => d.image)
    .attr("x", (d:any) => x(d.count) * 0.8 + 5)
    .attr("y", (d:any) => y(d.class)!)
    .attr("width", 20)
    .attr("height", y.bandwidth());

    svg.select(".domain").remove();
    svg.selectAll(".tick line").remove();
    svg.selectAll(".tick text").remove();
  }

plotChartLine(data: Data[]): void{

  const margin = { top: 20, right: 15, bottom: 50, left: 30 };
  let widthY = this.chartLine.nativeElement.clientWidth;
  let heightY = this.chartLine.nativeElement.clientHeight;


    let width = widthY - margin.left - margin.right;
    let height = heightY - margin.bottom;

  let svgY = d3.select("#plotLine");

  if (svgY.empty()) {

    svgY
      .append('svg')
      .attr("width", widthY)
      .attr("height",  heightY)
      .attr("class", "graph-svg-component")
      .append("g")
      .attr("transform", `translate(+ ${margin.left} +, + ${margin.top} +)`);
  }
  else{
     svgY.selectAll("*").remove();
  }
  const frameGroups = new Map<number, Data[]>();

  data.forEach((item) => {

    const frame = item.frame_id;
    this.rock= 0;

    if (frame !== undefined) {

      if (!frameGroups.has(frame)) frameGroups.set(frame, []);

      const isValid = item.hasOwnProperty('valid') && item.valid === false;


      if (isValid) {
        if (frameGroups.has(frame)) {
          this.filter.forEach(item=>{
              if(item.selected)  this.rock = 1;
          });

          if(!this.filter[0].selected && this.rock){
            this.rock = 0;
              this.filter.forEach(filter=>{
                if((CATEGORIES[item.class] == filter.label) && filter.selected){
                  frameGroups.get(frame)!.push(item);
                  this.rock=1;
                }
              })
          }
          else{
            frameGroups.get(frame)!.push(item);
          }
        }
      }
    }
  });

  const finalData: { frame: number; qtd: number }[] = [];

  frameGroups.forEach((info, i) => {
    let content = { frame: i, qtd: info.length };
    finalData.push(content);
  });

      var x = d3.scaleLinear()
        .domain([d3.min(finalData, (d:any) => d.frame), d3.max(finalData, (d:any)=>d.frame)])
        .range([0, width]);

      var y = d3.scaleLinear()
        .domain([0, d3.max(finalData, (d:any) => d.qtd + 0.5)])
        .nice()
        .range([height + 1, 0]);

      var line = d3
        .line<{ frame: number; qtd: number }>()
        .x((d:any) => x(d.frame))
        .y((d:any) =>y(d.qtd))
        .curve(d3.curveMonotoneX);

      svgY
        .append("path")
        .datum(finalData)
        .attr("fill", "none")
        .attr("stroke", "#3498db")
        .attr("fill", "#3498db")
        .attr("fill-opacity", 0.4)
        .attr("stroke-width", 2)
        .attr("d", line);


        svgY.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

       svgY.append('g')
        .attr('class', 'y-axis')
        .attr("transform", `translate(${width}, 0)`)
        .call(d3.axisRight(y));
}


  togglePlay() {

    this.isPlaying = !this.isPlaying;

    if (!this.isPlaying) {

      clearInterval(this.intervalId);
    } else {

      this.intervalId = setInterval(() => {
        if (this.sliderValue < this.maxValue) {
          this.sliderValue += this.stepValue;
          //this.slidVal.setSliderValue(this.stepValue);
          this.atualizarImagem();
          this.plotCircle(this.data)
        } else {
          this.sliderValue = this.minValue;
          //this.slidVal.setSliderValue(this.sliderValue);
          this.atualizarImagem();
          this.plotCircle(this.data);
        }
      }, 600);
    }
  }

}
