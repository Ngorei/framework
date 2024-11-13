import { morris } from './morris.js';
import { flot } from './flot.js';
import { doughnut } from './doughnut.js';
import { line } from './line.js';
import { series } from './series.js';
export function charts() {
  return {
    morris: function(argument) {
      return morris(argument)
    },
    flot: function(argument) {
      return flot(argument)
    },
    doughnut: function(argument) {
      return doughnut(argument)
    },
    line: function(argument) {
      return line(argument)
    },
    series: function(argument) {
      return series(argument)
    },

  }
}