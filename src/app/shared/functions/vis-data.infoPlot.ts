import { calcPoint } from './alphavis.points';
import { CATEGORIES } from './alphavis.categories';
import { Data } from './interface';
import * as d3 from 'd3';

export function infoCard(dados: any, frame: any) {

  let rs = dados.filter((d: any) => { return d.frame_id == frame && d.valid == false });

  let infoCard = [... new Set(rs.map((item: any) => CATEGORIES[item.class]))];

  return infoCard
}

function calcSize(val1: any, val2: any) {
  return Math.abs(val2 - val1);
}

export function plotInfo(width: any, height: any, frame: any, dados: any) {

  let Drs = dados.filter((d: any) => { return d.frame_id == frame && d.valid == false });

  let result: number[] = [];

  let chartContainer: any = d3.select("#chart-container");
  chartContainer.selectAll("*").remove();

  if (Drs.length > 0) {

    Drs.forEach((d: any) => {

      result = calcPoint(d.bb_x1, d.bb_y1, d.bb_x2, d.bb_y2, width, height);
      if (result) {

        d.x = result[0];
        d.y = result[1];
        d.width = calcSize(d.bb_x1 * width, d.bb_x2 * width);
        d.height = calcSize(d.bb_y1 * height, d.bb_y2 * height);
      }
    });

    function uniqueActions(d: any): string[] {
      let categories: string[] = Drs.filter((item: any) => item.person_id == d.person_id && (!item.valid)).map((item: any) => CATEGORIES[item.class]);
      return [...new Set(categories)];

    }

    function singlePersonInfo(Drs: Data[]): Data[] {
      let data: any = {};

      for (let i = 0; i < Drs.length; i++) {
        if (!data[Drs[i].person_id]) {
          data[Drs[i].person_id] = { ...Drs[i] };
          data[Drs[i].person_id].class = uniqueActions(Drs[i]);

          // console.log(data[Drs[i].person_id]);
        }
      }

      return Object.values(data);
    }

    let svg = chartContainer
      .append("svg")
      .attr("width", `${width}px`)
      .attr("height", `${height}px`);

    const rect = svg.selectAll("g")
      .data(singlePersonInfo(Drs))
      .enter()
      .append("g");

    rect.append("rect")
      .attr("x", (d: any) => d.x - (d.width / 2))
      .attr("y", (d: any) => d.y - (d.height / 2))
      .attr("width", (d: any) => d.width)
      .attr("height", (d: any) => d.height)
      .attr("stroke", "red")
      .attr("fill", 'none');

    rect.append("text")
      .attr("x", (d: any) => d.x - (d.width / 2))
      .attr("y", (d: any, i: number) => d.y - (d.height / 2) )
      .attr("text-anchor", "start")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .attr("font-size", "1.4rem")
      .attr("stroke", "red")
      .attr("stroke-width", 0.4)
      .attr("font-size", "1.4rem")
      .text((d: any) => d.class.join(","));
  }
}

