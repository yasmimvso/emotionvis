import { calcPoint } from '../alphavis/alphavis.points';
import { CATEGORIES } from '../alphavis/alphavis.categories';

import * as d3 from 'd3';

export function infoCard(dados:any, frame:any){

  let rs = dados.filter((d:any) => {return d.frame_id == frame});

  let infoCard = [... new Set(rs.map((item:any)=> CATEGORIES[item.class]))];

  return infoCard
}

function calcSize(val1: any, val2: any){
  return Math.abs(val2 - val1);
}

export function plotInfo(width:any, height:any, frame:any, dados:any){

let Drs = dados.filter((d:any) => {return d.frame_id == frame});

let result:number[] = [];


let chartContainer: any = d3.select("#chart-container");
chartContainer.selectAll("*").remove();


if(Drs.length>0){

  Drs.forEach((d:any)=>{

      result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2, width, height);
      if(result){

         d.x = result[0];
         d.y = result[1];
         d.width =  calcSize(d.bb_x1 * width, d.bb_x2 * width);
         d.height = calcSize(d.bb_y1 * height, d.bb_y2 * height);
      }
  });

        let i = -8;

        let svg= chartContainer
        .append("svg")
        .attr("width", `${width}px`)
        .attr("height", `${height}px`);

        const rect = svg.selectAll("g")
         .data(Drs)
         .enter()
         .append("g");

         rect.append("rect")
          .attr("x", (d: any) => d.x - (d.width/2))
          .attr("y", (d: any) => d.y - (d.height/2))
          .attr("width", (d: any) => d.width)
          .attr("height",(d: any) => d.height)
          .attr("stroke", (d: any)=>d.valid == false? "red": "green")
          .attr("fill", 'none');

        rect.append("text")
          .attr("x", (d: any) =>d.x - (d.width/2) + 20)
          .attr("y", (d: any) =>  d.y - (d.height/2) - 20 + (i+=5))
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle")
          .attr("fill",(d: any)=> d.valid == false ? "red": "green")
          .text((d:any)=>CATEGORIES[d.class]);
  }
}

