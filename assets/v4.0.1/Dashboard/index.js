import { avatar,avatarID } from './avatar.js';
import { Checkbox } from "./Checkbox.js";
export const Dsb = function () {
  return {
    Avatar: function(red) {
       return avatar(red)
    },
    avatarID: function(red) {
       return avatarID(red)
    },
    Checkbox: function(red) {
       return Checkbox(red)
    }

  };
}