import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router} from '@angular/router';
import { Location } from '@angular/common';
import { calcPoint } from '../../shared/functions/alphavis.points';
import { CATEGORIES } from '../../shared/functions/alphavis.categories';
import { Data, Interval } from '../../shared/functions/interface'
import { HeaderService } from 'src/app/services/header.service';
import * as d3 from 'd3';
import { heatMap } from 'src/app/shared/functions/heatmap';


@Component({
  selector: 'app-alphavis-id',
  templateUrl: './alphavis-id.component.html',
  styleUrls: ['./alphavis-id.component.css']
})
export class AlphavisIdComponent {

  @ViewChild('chartLine', { static: true }) private chartLine!: ElementRef;
  @ViewChild('imgView', { static: false }) private imgView!: ElementRef;
  @ViewChild('barCharts', { static: true }) private barCharts!: ElementRef;
  @ViewChild('heatmap', { static: true }) private heatmapInf!: ElementRef;

  filter: any = [
    { label: "All", selected: false, disabled: false }
  ];


  sliderValue: number = 0;
  minValue: number = 32;
  maxValue: number = 1800; // esse valor foi dado diante da quantidade de frames que foi cortado
  stepValue: number = 5;
  isPlaying: boolean = false;
  xhttp: number = 0;
  opacityRange: number = 0.43;
  sunnydisplay: boolean = false;

  dataSet: Interval[] = [];

  state: any;
  idP: any;
  context: any;
  intervalId: any;
  imagemUrl: any;
  rota: any;

  chartOptions: any = {};
  chartInfo: any = {}

  paragrafos: any = [];
  filterSelect: any = [];
  dadosHeatMap: any = [];


  constructor(private router: Router, private location: Location, private headService : HeaderService) {

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
    this.minValue = this.state.dados[0].frame_id;
    // this.maxValue =  this.state.dados[ this.state.dados.length-1].frame_id;
    this.filterSelect = CATEGORIES[this.state.classId];

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

    let dadosById = this.state.dados.filter((item: any) => {
      return (item.person_id == this.state.id) && (item.frame_id <= 1800);
    })

    let valoresDistintos = [...new Set(dadosById.map((item: any) => CATEGORIES[item.class]))];

    valoresDistintos.forEach((d) => {
      if (d == CATEGORIES[this.state.classId]) res = { label: d, selected: true, disabled: false }
      else res = { label: d, selected: false, disabled: false }

      this.filter.push(res);
    })

    let dados: any = this.state.dados.filter((d: any) => d.person_id == this.state.id && d.valid == false);
    let width = this.heatmapInf.nativeElement.clientWidth;
    let height = this.heatmapInf.nativeElement.clientHeight;

    this.plotRec();
    this.atualizaParagrafo();
    this.PlotdataSet(dadosById);
    this.ChartLine();
    this.percInf(dadosById);
    heatMap(dados, width, height);
  }


  changeByFilter(event: any) {

    let resultado = Array();

    if (event.target.name == 'All') {
      this.filter[0].selected = !this.filter[0].selected;
      this.filter[0].disabled = true;

      if (event.target.checked) {

        this.filter.forEach((item: any) => {
          if (item.label != 'All') {
            resultado.push(item.label);
            if (item.selected) {
              item.selected = !item.selected;
            }

          }

        });
      }
    } else {
      if (!event.target.checked) {

        this.filter.forEach((item: any) => {
          if (item.label == event.target.name) {
            item.selected = false;
          }
        })

      } else {
        if (this.filter[0].selected) this.filter[0].selected = !this.filter[0].selected;
        this.filter.forEach((item: any) => {
          if (item.label == event.target.name) {
            item.selected = true;
          }
        });

      }

    }

    if (!this.filter[0].selected) {
      resultado = this.filter.filter((item: any) => {
        return item.selected == true;
      });
      resultado = [... new Set(resultado.map((item: any) => item.label))];
    }
    this.filterSelect = resultado;
    this.plotRec();
  }


  public percInf(result: Data[]) {
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
    const width = (this.barCharts.nativeElement.clientWidth - margin.left - margin.right) / 1.3;
    const height = (this.barCharts.nativeElement.clientHeight - margin.top - margin.bottom) / 1.3;


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
      .attr('y', (d: any) => y(d.data['label'])!)
      .attr('height', y.bandwidth())
      .attr('width', d => x(d[1]) - x(d[0]));
  }

  PlotdataSet(id: Data[]) {

    let aux = new Array();
    let validAnt: any = '';

    let act = [... new Set(id.map((item: any) => item.class))];

    act.forEach((action) => {

      validAnt = '';
      aux.length = 0;
      let rs = id.filter((d: any) => {
        return d.class == action;
      })
      rs.forEach((item: any) => {

        if (validAnt == '') validAnt = item.valid;

        if (validAnt == item.valid) {

          if ((item.frame_id - 1) != aux[aux.length - 1]) {
            let n: any = action;
            let objeto = { init:aux[0], end: aux[aux.length - 1], label: CATEGORIES[n], color: validAnt === true ? "green" : "red" };

            if(objeto.init != undefined) this.dataSet.push(objeto);
            aux.length = 0;

          }
          else if ((aux.length + 1 == rs.length) && (item.frame_id - 1) == aux[aux.length - 1]) {
            let n: any = action;
            let objeto = {  init:aux[0], end: aux[aux.length - 1], label: CATEGORIES[n], color: validAnt === true ? "green" : "red" };
            if(objeto.init != undefined) this.dataSet.push(objeto);
            aux.length = 0;
          }

        }
        else if (aux.length == 1 && item.frame_id - 1 != aux[aux.length - 1]) {
          let n: any = action;
          let objeto = { init:aux[0], end: aux[0] + 1, label: CATEGORIES[n], color: validAnt === true ? "green" : "red" };
          if(objeto.init != undefined) this.dataSet.push(objeto);
          aux.length = 0;
        }
        else {

          let n: any = action;
          let objeto = {  init:aux[0], end: aux[aux.length - 1], label: CATEGORIES[n], color: validAnt === true ? "green" : "red" };
          if(objeto.init != undefined) this.dataSet.push(objeto);
          aux.length = 0;
          validAnt = item.valid;

        }
        aux.push(item.frame_id);

      })

    })
  }

  calcSize(val1: any, val2: any) {
    return Math.abs(val2 - val1);
  }


  verifyHeight(person:any, frame: any): Data[]{ // verificar a quantidade de ações para aquele frame e id analisado
    return this.state.dados.filter((data:any)=> data.person_id == person && data.frame_id == frame);
  }

  plotRec(): void {


    let widthImg = this.imgView.nativeElement.clientWidth;
    let heightImg = this.imgView.nativeElement.clientHeight;

    let Drs: Data[] = [];


    Drs = this.state.dados.filter((d: any) => d.frame_id === this.sliderValue && d.person_id == this.state.id
      && this.filterSelect.includes(CATEGORIES[d.class]));

    let result: number[] = [];


    let chartContainer: any = d3.select("#chart-container")
    chartContainer.selectAll("*").remove();

    if (Drs.length > 0) {

      Drs.forEach(d => {

        result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2, widthImg, heightImg);
        if (result) {

          d.x = result[0];
          d.y = result[1];
          d.width = this.calcSize(d.bb_x1 * widthImg, d.bb_x2 * widthImg);
          d.height = this.calcSize(d.bb_y1 * heightImg, d.bb_y2 * heightImg);
        }
      });

    let i = 8;

    let svg = chartContainer
      .append("svg")
      .attr("width", `${widthImg}px`)
      .attr("height", `${heightImg}px`);

    const rect = svg.selectAll("g")
      .data(Drs)
      .enter()
      .append("g");

    // bounding box
    rect.append("rect")
      .attr("x", (d:any) => d.x - (d.width / 2))
      .attr("y", (d:any) => d.y - (d.height / 2))
      .attr("width", (d:any) => d.width)
      .attr("height", (d:any) => d.height)
      .attr("stroke", "white")
      .attr("fill", 'none');

    // box over bounding box for information
    rect.append("rect")
      .attr("x", (d:any) => d.x - d.width / 2)
      .attr("y", (d:any) => {
        if (d.height * 2.5 >= heightImg) return d.y - d.height / 1.2;
        else return d.y - d.height / 1.1;
      })
      .attr("width", (d:any) => d.width / 0.7)
      .attr("height", (d:any) => {
        if (d.height * 2.5 >= heightImg) {
          return (d.height / 2.8) * this.verifyHeight(this.state.id, this.sliderValue).length * 0.9 + 5;
        }
        else return (d.height / 2.8) * this.verifyHeight(this.state.id, this.sliderValue).length * 0.9 + 10;
      })
      .attr("stroke", "white")
      .attr("fill", "white")
      .attr("position", "relative");


      // rect.append("text")
      // .attr("x", (d:any) => d.x - d.width / 2 + 5) // adjust the x position to add padding
      // .attr("y", (d:any) => {
      //   if (d.height * 3 >= heightImg) return d.y -  (i -= 8) - d.height / 1.2 + 15;
      //   else return d.y -  (i -= 8) - d.height / 1.1 + 15;
      // }) // adjust the y position to add padding
      // .attr("text-anchor", "start") // adjust the text alignment
      // .attr("dominant-baseline", "hanging")
      // .attr("fill", "black")
      // .attr("font-weight", "bold")
      // .attr("position", "absolute")
      // .attr("font-size", "1.4rem")
      // .selectAll("tspan")
      // .data((d:any) => CATEGORIES[d.class].split('\n')) // assuming CATEGORIES[d.class] contains newline-separated information
      // .enter()
      // .append("tspan")
      // // .attr("x", (d:any) => d.x - d.width / 2 + 5)
      // .attr("dy", (d:any, i:any) => i === 0 ? 0 : "1.2em") // line spacing
      // .text((d:any) => d);

      rect.append("text")
        .attr("x", (d: any) => d.x - d.width/3)
        .attr("y", (d: any) => d.y - (d.height / 2) - 5 + (i -= 8))
        .attr("text-anchor", "start") // adjust the text alignment
        .attr("dominant-baseline", "hanging")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("font-size", "1.4rem")
        .attr("stroke", (d: any) => d.valid == true ? "green" : "red")
        .attr("stroke-width", 0.5)
        .attr("font-size", "1.4rem")
        .text((d: any) => CATEGORIES[d.class]);
    }
  }
  // verifyHeight(person:any, frame: any){ // verificar a quantidade de ações para aquele frame e id analisado
  //   return this.dataSet.filter((data:any)=> data.person_id == person && data.frame_id == frame)
  // }
  changeVisibility(): void {

    let result = this.heatmapInf.nativeElement

    if (!this.sunnydisplay) {
      result.setAttribute('style', 'visibility: visible');
      this.sunnydisplay = !this.sunnydisplay;
    }
    else {
      result.setAttribute('style', 'visibility: hidden');
      this.sunnydisplay = !this.sunnydisplay;

    }

  }

  atualizaParagrafo(): void {


    this.paragrafos.length = 0;
    let rst = this.state.dados.filter((d: Data) => {
      return (d.person_id == this.state.id) && (d.frame_id <= this.sliderValue);
    })

    let rstClassQtd = rst.map((item: Data) => CATEGORIES[item.class]);


    let rstClass: any = [... new Set(rst.map((item: any) => item.class))];
    var objectClass = { img: 0, categorie: "string", quantideCat: 0 };

    rstClass.forEach((classId: number) => {
      objectClass = {
        img: classId, categorie: CATEGORIES[classId],
        quantideCat: rstClassQtd.filter((item: string) => item == CATEGORIES[classId]).length
      };

      this.paragrafos.push(objectClass);
    })

  }

  public ChartLine() {

    const margin = { top: 20, right: 10, bottom: 20, left: 100};
    const width = (this.barCharts.nativeElement.clientWidth - margin.left - margin.right) / 1.3;
    const height = (this.barCharts.nativeElement.clientHeight - margin.top - margin.bottom)/ 1.3;

    let result = this.headService.getInvertColor();
    let chartContainer: any = d3.select("#chartLine")
    chartContainer.selectAll("*").remove();

    let svg = chartContainer
    .append("svg")
    .attr('width', (width + margin.left + margin.right))
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
    .domain([0, 1800])
    .range([0, width]);

    const y = d3.scaleBand()
    .domain(this.dataSet.map(d => d.label))
    .range([0, height])
    .padding(0.25);

    const xAxis = d3.axisBottom(x).ticks(6, '~s');
    const yAxis = d3.axisLeft(y);

    svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis)
    .call((g:any) => g.select('.domain').remove());

    svg.append("g")
      .call(yAxis)
      .call((g:any) => g.select('.domain').remove());

    var tooltip = d3.select("#chartLine")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .attr("id", "tooltip")
    .style("z-index", "10")
    .style("background-color", "white")
    .style("width","10%")
    .style("height","5%")
    .style("border" , "2%")
    .style("font-size", "1.5rem");

  // Add y-axis label
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -margin.left + 10)
    .attr("font-size", "1.2rem")
    .attr("font-family", "Quicksand")
    .attr("fill", function(){
      return result? "white" : "black";
    })
    .text('Intervalos de predições');

    tooltip.selectAll("*").remove();

    svg.selectAll('.bar')
      .data(this.dataSet)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', (d:any) => x(d.init))
      .attr('y', (d:any) => y(d.label))
      .attr('width', (d:any) => x(d.end) - x(d.init))
      .attr('height', y.bandwidth())
      .attr('fill', (d:any) => d.color)
      .on("mouseover", (i:any, d:any) => {
        tooltip.transition()
          .duration(200)
          .style("visibility", "visible")
          .style("opacity", 0.9)
          .style("cursor", "default");
        tooltip.html(`${d.label} : [${d.init} ,${d.end}]`)
          .style("left", (i.pageX) + "px")
          .style("top", (i.pageY) + "px")
          .style("color", d.color);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });

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

