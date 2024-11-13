import { recognition } from './recognition.js';
export const AI = function () {
  return {
    recognition: function(red) {
      return recognition(red)
    }
  };
}