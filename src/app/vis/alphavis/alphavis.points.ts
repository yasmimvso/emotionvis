
export function calcPoint(x1: any, y1:any, x2:any, y2: any, width: any, height:any){

  console.log(x1, y1, x2, y2, width, height);
  const calcCPX = ((x1 * width) + (x2 * width))/2
  const calcCPY = ((y1 * height) + (y2 * height))/2

  return [calcCPX, calcCPY];
}
