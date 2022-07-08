var piechart = {
  "width"  : 200,
  "height" : 200,
  "space" : 10,
  "legendWidth" : 250,
  "legendRectSize" : 13,
  "legendSpacing" : 4
}

piechart.draw = function(id, data, data2, onclick) {
  var innderRadius = 0;
  var outerRadius = piechart.width / 2;
  var tooltipId = id + "-tooltip";

  var keys = function(d) {
    return d.data.label;
  };

  // ToolTip用タグを追加
  var tooltip = d3.select("#" + id)
                  .selectAll("#" + tooltipId)
                  .data([1])
                  .enter()
                  .append("div")
                  .attr("id", tooltipId)
                  .classed("hidden", true)
                  .classed("tooltip", true);

  tooltip.selectAll(".label")
         .data([1])
         .enter()
         .append("p")
         .append("strong")
         .append("span")
         .classed("label", true);

  tooltip.selectAll(".value")
         .data([1])
         .enter()
         .append("p")
         .append("span")
         .classed("value", true);

  // 円グラフの角度生成用関数の初期化
  var pie = d3.layout.pie()
                     .value(function(d){
                        return d.value;
                      })
                     .sort(function(){
                        return 0;
                      });

  // 描画用データの作成
  var dataset = pie(data);
  var dataset2 = pie(data2);
  
  // path要素の座標生成用関数の初期化
  var arc = d3.svg.arc()
                  .innerRadius(innderRadius)
                  .outerRadius(outerRadius);

  // svgタグの初期化
  d3.select("#" + id)
    .selectAll("svg")
    .remove();

  var svg = d3.select("#" + id)
              .append("svg")
              .attr("id", id + "-piechart")
              .attr("width", piechart.width + piechart.space + piechart.legendWidth)
              .attr("height", piechart.height);

  // 円弧描画用g要素を追加
  var arcs = svg.selectAll("g.arc")
                .data(dataset, keys)
                .enter()
                .append("g")
                .attr("class", "arc")
                .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

  // 円弧の描画
  arcs.append("path")
      .attr("fill", function(d, i){
         return d.data.color;
       })
      .attr("stroke", "gray")
      .attr("stroke-width", "0.5px")
      .attr("d", arc)
      .on("click", onclick)
      .on("mouseover", function(d){
         var tooltipId = "#" + id + "-tooltip";

         // ToolTipのテキストを設定
         d3.select(tooltipId + " .label").text(d.data.label);
         d3.select(tooltipId + " .value").text(d.data.value);

         // ToolTipを表示
         var centroid = arc.centroid(d);
         var left = centroid[0] + outerRadius;
         var top = centroid[1] + outerRadius;

         d3.select(tooltipId)
           .style("left", left + "px")
           .style("top", top + "px")
           .classed("hidden", false);
       })
      .on("mouseout", function(d){
         // ToolTipを非表示
         var tooltipId = "#" + id + "-tooltip";
         d3.select(tooltipId)
           .classed("hidden", true);
       });

  // 各要素の値を表示
  arcs.append("text")
      .attr("transform", function(d){
         return "translate(" + arc.centroid(d) + ")";
       })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("stroke-width", "1")
     // .text(function(d){
     //    return d.data.value;
     //  });

  // 凡例描画用g要素を追加
  var legend = svg.selectAll(".legend")
                  .data(dataset2, keys)
                  .enter()
                  .append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i){
                     var height = piechart.legendRectSize + piechart.legendSpacing;
                     var offset = piechart.space;
                     var horz = piechart.width + piechart.space;
                     var vert = i * height + offset;
                     return "translate(" + horz + "," + vert + ")";
                   });

  // 色サンプルを表示するrect要素を追加
  legend.append("rect")
        .attr("width", piechart.legendRectSize)
        .attr("height", piechart.legendRectSize)
        .style("fill", function(d, i){
           return d.data.color;
         })
        //.style("stroke", function(d, i){
        //   return d.data.color;
        // });
				.style("stroke-width","0.5px")
				.style("stroke","gray")

  // 色の説明用text要素を追加
  legend.append("text")
        .attr("x", piechart.legendRectSize + piechart.legendSpacing)
        .attr("y", piechart.legendRectSize - piechart.legendSpacing)
        .text(function(d, i) {
           return d.data.label;
         });
}
