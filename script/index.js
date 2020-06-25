const DATASET_URL="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
d3.json(DATASET_URL).then((data)=>{
  const w=900;
  const h=600;
  const titleHeight=60;
  const padding=40;

  const dataset=data;
  const dataXYZ=dataset.map(item=>[item["Year"], item["Seconds"], item["Doping"]?true:false]);
  const dataX=dataXYZ.map(item=>item[0]);
  const dataY=dataXYZ.map(item=>item[1]);
  
  const xScale=d3.scaleLinear()
                  .domain([d3.min(dataX)-1, d3.max(dataX)+1])
                  .range([padding, w-padding]);
  const yScale=d3.scaleLinear()
                  .domain([d3.max(dataY)+1, d3.min(dataY)-1])
                  .range([h-padding, padding]);

  const svg=d3.select("#svg-container")
                .append("svg")
                .attr("width", w)
                .attr("height", h+titleHeight);

  const tips=d3.select("#svg-container").append("div").attr("id", "tips").style("left", "-10000px");
  
  svg.selectAll("circle")
      .data(dataXYZ)
      .enter()
      .append("circle")
      .attr("cx", d=>xScale(d[0]))
      .attr("cy", d=>titleHeight+yScale(d[1]))
      .attr("r", 5)
      .attr("fill", d=>d[2]?"midnightblue":"orange")
      .on("mouseover", (d,i)=>{
        tips.style("left", `${d3.event.pageX+10}px`);
        tips.style("top", `${d3.event.pageY-20}px`);
        tips.html(`${dataset[i]["Name"]}: ${dataset[i]["Nationality"]}<br/>
                   Year: ${dataset[i]["Year"]},Time: ${dataset[i]["Time"]}
                   ${d[2]?`<br/>${dataset[i]["Doping"]}`:''}`);
      })
      .on("mouseout", ()=>{
        tips.style("left", "-10000px");
      })

  const xAxis=d3.axisBottom(xScale);
  xAxis.tickFormat(d3.format(".0d"));
  svg.append("g")
      .attr("transform", `translate(0, ${h+titleHeight-padding})`)
      .call(xAxis);

  const yAxis=d3.axisLeft(yScale);
  yAxis.tickFormat(d=>{
    const minuteStr=Math.floor(d/60).toString();
    const secondStr=(d%60).toString();
    return `${minuteStr.length>1?minuteStr:'0'+minuteStr}:${secondStr.length>1?secondStr:'0'+secondStr}`;
  });
  svg.append("g")
      .attr("transform", `translate(${padding}, ${titleHeight})`)
      .call(yAxis);

  svg.append("text")
      .text("Doping in Professional Bicycle Racing")
      .style("font-size", "2.5rem")
      .attr("x", w/2)
      .attr("y", padding)
      .attr("text-anchor", "middle");
  svg.append("text")
      .text("35 Fastest times up Alpe d'Huez")
      .style("font-size", "1.5rem")
      .attr("x", w/2)
      .attr("y", padding*1.8)
      .attr("text-anchor", "middle");

  const labels = svg.append("g");
  const dopingLabel=labels.append("g");
  const noDopingLabel=labels.append("g");
  dopingLabel.append("text")
      .text("Riders with doping allegations")
      .style("font-size", "0.7rem")
      .attr("x", w-padding-20)
      .attr("y", padding+titleHeight+30)
      .attr("text-anchor", "end");
  dopingLabel.append("circle")
      .attr("cx", w-padding-10)
      .attr("cy", padding+titleHeight+26.5)
      .attr("r", 5)
      .attr("fill", "midnightblue");

  noDopingLabel.append("text")
      .text("No doping allegations")
      .style("font-size", "0.7rem")
      .attr("x", w-padding-20)
      .attr("y", padding+titleHeight+50)
      .attr("text-anchor", "end");
  noDopingLabel.append("circle")
      .attr("cx", w-padding-10)
      .attr("cy", padding+titleHeight+46.5)
      .attr("r", 5)
      .attr("fill", "orange");

  svg.append("text")
      .text("Time in Minutes")
      .attr("transform", "rotate(-90)")
      .attr("x", -300)
      .attr("y", 55)
      .style("font-size", "0.8rem");
});