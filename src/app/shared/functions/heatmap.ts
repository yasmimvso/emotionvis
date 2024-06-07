
import { contourDensity } from "d3-contour";
import { Data}  from '../../shared/functions/interface'
import { calcPoint } from '../../shared/functions/alphavis.points';
import * as d3 from 'd3';

export function heatMap(dados: Data[], widthW:number, heightH:number):void{

  let dadosHeatMap: any = [];

  var margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = widthW - margin.left - margin.right,
  height = heightH - margin.top - margin.bottom;

  var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const color = d3.scaleSequential(d3.interpolateBlues)
    .domain([-0.1, 0.75]);

    console.log("DADOS HEATMAP:", dados.length);
    dados.forEach((d:any)=>{

      let result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2,widthW, heightH);
      if(result){
        let object = {x: result[0], y:result[1]};
        dadosHeatMap.push(object);
      }
    });

      var x = d3.scaleLinear()
      .domain([0, widthW]).nice()
      .range([0,widthW]);

      var y = d3.scaleLinear()
      .domain([0,  heightH]).nice()
      .range([0,  heightH]);

      var densityData = contourDensity()
      .x((d:any) => x(d.x))
      .y((d:any) => y(d.y))
      .size([800, 90])
      .bandwidth(20)
      .thresholds(30)
      (dadosHeatMap);

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
