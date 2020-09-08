// https://observablehq.com/@amoncadag/visualizacion-de-los-giros-del-sistema-general-de-regalias@343
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Visualización de los giros del Sistema General de Regalías`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Contexto`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Las regalías son los recursos económicos que se entregan al departamento y a los municipios por la extracción de hidrocarburos y/o minerales en su territorio o si tienen puertos marítimos o fluviales por donde transiten los recurso extraídos o sus productos derivados. 

Una vez se liquida el valor correspondiente para el período se hace el giro al municipio o departamento. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Framework de Tamara`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### What ¿Qué datos se van a representar?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`El Dataset a analizar es recopilado por el Portal de Transparencia Económica para los meses transcurridos del 2020. En cuanto a los atributos que conforman la tabla, en donde se tiene 9 atributos, los cuales se especifican a continuación: 

Atributo|Tipo
---|---|---
**CodigoDepartamento**|Categórico
**NombreDepartamento**|Categórico
**FechaGiro**|Cuantitativo Secuencial
**NumeroGiro**|Categórico
**IdentificacionEntidad**|Categórico
**NombreEntidad**|Categórico
**Rubro**|Categórico
**ValorNetoGiroSGR**|Cuantitativo
**ValorPagadoGiroSGR**|Cuantitativo
`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### Why ¿Por qué se va a visualizar?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Principal: identificar los extremos de los departamentos a los cuales se le han girado la mayor y la menor cantidad de dinero en giros por regalías. Verbo: identificar, Sustantivo: extremos 

Secundaria: identificar los extremos de los departamentos a los cuales se le han girado la mayor y la menor cantidad de giros por regalías. Verbo: identificar, Sustantivo: extremos 

A bajo nivel es comparar el valor total de los giros por departamento. `
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### How: ¿Cómo se va a visualizar?`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### Marcas`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Líneas: En un diagrama de barras, para representar el valor girado al departamento.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `### Canales`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `

**Posición horizontal:** para representar el atributo cuantitativo, correspondiente al valor girado al departamento por concepto de regalías. En el modismo dos el atributo cuantitativo corresponde al número de giros por departamento.  

**Posición vertical:** para representar el atributo categórico, que corresponde al nombre del departamento. 

`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `## Insights`
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Como resultado de la visualización se pueden tener las siguientes conclusiones o insights: 

* El departamento al cual se ha girado la mayor cantidad de dinero por concepto de regalías durante el transcurso del año 2020 es Bolívar.

* El departamento al cual se ha girado la menor cantidad de dinero por concepto de regalias durante transcurso del año 2020 es Guanía.

* Se evidencia que hay un valor significante de dinero por distribuir y liquidar a los departamentos por concepto de regalías en el año 2020. Lo cual tambien se ve reflejando en el número total de regalías o giros pendientes de liquidar. 

* El Valle es el departamento con mayor número giro de regalías durante el 2020.`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`## Desarrollo`
)});
  main.variable(observer()).define(["md"], function(md){return(
md`Se usa la fuente publicada en http://www.pte.gov.co/WebsitePTE/SGRDetalleDepartamento, la cual contiene los giros realizados a los municipios y departamento para el año 2020. Y es un archivo formato csv separado por coma`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Se hace la lectura y cargue de los datos ubicados en el repositorio creado para almacenar los fuentes de las tareas de Visual Analytics:`
)});
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.csv("https://raw.githubusercontent.com/amoncadag/VA20202/master/V1/datosGiros.csv")
)});
  main.variable(observer()).define(["md"], function(md){return(
md `Se hace la suma del atributo ValorPagadoGiroSGR y el conteo de regalías por departamento`
)});
  main.variable(observer("departamentoRegalias")).define("departamentoRegalias", ["d3","data"], function(d3,data)
{    
  return d3.nest()
      .key(d => d.NombreDepartamento)
      .rollup( leaves => ({
        leaves, 
        valorTotalGiros:d3.sum(leaves, d=>d.ValorPagadoGiroSGR),
        numLeaves: leaves.length,
      }) )
      .entries(data)
      .sort( (a,b) => d3.ascending(a.value.valorTotalGiros, b.value.valorTotalGiros)); 
}
);
  main.variable(observer()).define(["html","d3","departamentoRegalias"], function(html,d3,departamentoRegalias)
{
  const target = html`
<style>
.chart {
  font-family: sans-serif;}
.chart-footer {
  font-style: italic;
  font-size:8pt;
  color: #aaa;
}
</style>

<div class="chart">
  <h2>Giro de regalías a departamentos en 2020</h2>
  <div>Valor total de los giros realizado a los departamentos en 2020</div>
  <div id="chart"></div>
  <div class="chart-footer"><a href="https://observablehq.com/d/6b0ab5ef1cde2452">Refencia @johnguerra https://observablehq.com/d/6b0ab5ef1cde2452</a>.
    <br>
  </div>
</div>`;
  const 
    width = 900,
    height = 900,
    svg = d3.select(target).select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
  const margin = ({top: 20, right: 0, bottom: 30, left: 155}),
        iwidth = width - margin.left - margin.right,
        iheight = height - margin.top - margin.bottom;
  
  const gBase = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  gBase.append("text")
    .attr("class", "tooltip")
    .attr("x", -20)
    .style("fill", "black") 
    .style("font-size", "14px")
    .text("")
  
  const x = d3.scaleLinear()
    .domain([0, d3.max(departamentoRegalias, d => d.value.valorTotalGiros) ]).nice()
    .range([0 , iwidth]).nice();
   
  const y = d3.scaleBand()
    .domain(d3.set(departamentoRegalias.map(d => d.key)).values())
    .range([iheight, 0])
    .padding(0.3);

   
  gBase.append("g")
    .call(d3.axisBottom(x).tickFormat(d3.format("$.3s")))
    .attr("transform", `translate(0, ${iheight})`);

  gBase.append("g")
    .call(d3.axisLeft(y)
         );

  function onMouseOver(d) {
    d3.select(this)
      .style("fill", "yellow");
    
    gBase.select(".tooltip")
      .attr("x", d3.mouse(this)[0])
      .attr("y", d3.mouse(this)[1]+20)
      .text("Giros: " + d.value.valorTotalGiros);
  }  
  
  function onMouseOut(d) {
    d3.select(this)
      .style("fill", "steelblue");
      gBase.select(".tooltip")
      .attr("x", -100)
      .text("");
  }  
  
  gBase.selectAll(".item")
    .data(departamentoRegalias)
    .join("rect")
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)  
      .attr("class", "item")
      .attr("x", 0 )
      .attr("y", d => y(d.key) )
      .attr("width", d => x(d.value.valorTotalGiros) )
      .attr("height", y.bandwidth() )
      .style("opacity", 0.7)
      .style("fill", "steelblue");
  return target;
   
}
);
  main.variable(observer()).define(["html","d3","departamentoRegalias"], function(html,d3,departamentoRegalias)
{
  const target = html`
<style>
.chart {
  font-family: sans-serif;}
.chart-footer {
  font-style: italic;
  font-size:8pt;
  color: #aaa;
}
</style>

<div class="chart">
  <h2>Giro de regalías a departamentos en 2020</h2>
  <div>Total de giros realizados a departamentos en 2020</div>
  <div id="chart"></div>
  <div class="chart-footer"><a href="https://observablehq.com/d/6b0ab5ef1cde2452">Refencia @johnguerra https://observablehq.com/d/6b0ab5ef1cde2452</a>.
    <br>
  </div>
</div>`;
  const 
    width = 900,
    height = 900,
    svg = d3.select(target).select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  
  const margin = ({top: 20, right: 0, bottom: 30, left: 155}),
        iwidth = width - margin.left - margin.right,
        iheight = height - margin.top - margin.bottom;
  
  const gBase = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  gBase.append("text")
    .attr("class", "tooltip")
    .attr("x", -20)
    .style("fill", "black") 
    .style("font-size", "14px")
    .text("")
  

  const x = d3.scaleLinear()
    .domain([0, d3.max(departamentoRegalias, d => d.value.numLeaves) ]).nice()
    .range([0 , iwidth]).nice();
 
  const y = d3.scaleBand()
    .domain(d3.set(departamentoRegalias.map(d => d.key)).values())
    .range([iheight, 0])
    .padding(0.3);
  
  gBase.append("g")
      .call(d3.axisBottom(x).ticks(10))
      .attr("transform", `translate(0, ${iheight})`);

 
  gBase.append("g")
    .call(d3.axisLeft(y)
         );
   
  function onMouseOver(d) {
    d3.select(this)
      .style("fill", "yellow");   
    gBase.select(".tooltip")
      .attr("x", d3.mouse(this)[0])
      .attr("y", d3.mouse(this)[1]+20)
      .text("Número Regalías: " + d.value.numLeaves);
  }  
  
  function onMouseOut(d) {
    d3.select(this)
      .style("fill", "steelblue");
      gBase.select(".tooltip")
      .attr("x", -100)
      .text("");
  }  
  
  gBase.selectAll(".item")
    .data(departamentoRegalias)
    .join("rect")
      .on("mouseover", onMouseOver)
      .on("mouseout", onMouseOut)  
      .attr("class", "item")
      .attr("x", 0 )
      .attr("y", d => y(d.key) )
      .attr("width", d => x(d.value.numLeaves) )
      .attr("height", y.bandwidth() )
      .style("opacity", 0.7)
      .style("fill", "red");
  return target;
   
  
}
);
  return main;
}
