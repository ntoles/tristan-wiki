// D3JS stuff

const MPL_COLOR_1 = "#1f77b4";
const MPL_COLOR_2 = "#ff7f0e";
const MPL_COLOR_3 = "#2ca02c";
const MPL_COLOR_4 = "#d62728";

var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); };

var sciTickFrmt = function(d, scinotation) {
  let pow = Math.round(Math.log(d) / Math.LN10)
  var num = d / 10**pow;
  if (num != 0) {
    if (pow == 0)
      return num.toString();
    else {
      if (num != 1) {
        return num + '×10' + formatPower(pow);
      } else {
        return '10' + formatPower(pow);
      }
    }
  } else {
    if (pow == 0)
      return '1';
    else
      return '10' + formatPower(pow);
  }
}
