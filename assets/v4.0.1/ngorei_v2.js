const app = {
  app: "Ngorei",
  version: "v1.0.4",
  copyright: "2013-2024",
  url: "https://tatiye.net",
};
export default app;
export const Utilities = async function (UtilName) {
  let UtilModule;
  try {
    // Impor modul secara dinamis berdasarkan UtilName
    UtilModule = await import(`./${UtilName}/index.js`);
  } catch (error) {
    console.error(`Error importing module ${UtilName}:`, error);
    return;
  }

  // Pastikan modul yang diimpor memiliki metode sesuai dengan yang diharapkan
  if (UtilModule && typeof UtilModule[UtilName] === "function") {
    return {
      [UtilName]: function () {
        return UtilModule[UtilName]();
      },
    };
  } else {
    console.error(`Module ${UtilName} does not export the expected function`);
  }
};
export function Encode(argument) {
  var decodedStringBtoA = argument;
  var encodedStringBtoA = btoa(decodedStringBtoA);
  var resheader = encodedStringBtoA.replace(/[^A-Za-z0-9]/g, "");
  return resheader;
}

export function Decode(argument) {
  var encodedStringAtoB = argument;
  var decodedStringAtoB = atob(encodedStringAtoB);
  return decodedStringAtoB;
}

export function newToken(myData) {
  var varjs = JSON.stringify(myData, null, 10);
  var myToken = Encode(varjs);
  return myToken;
}
export function ngetToken(myData) {
  if (myData) {
    var addset = JSON.parse(Decode(myData));
    return addset;
  }
}
export function setToken(myData) {
  let nToken = newToken(myData);
  return nToken;
}

export function sortAscById(data) {
  return data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
}

// Fungsi untuk mengurutkan data secara descending berdasarkan id
export function sortDescById(data) {
  return data.sort((a, b) => parseInt(b.id) - parseInt(a.id));
}

export function getToken(myData) {
  return ngetToken(myData);
}
export function md5(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = lX & 0x80000000;
    lY8 = lY & 0x80000000;
    lX4 = lX & 0x40000000;
    lY4 = lY & 0x40000000;
    lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function F(x, y, z) {
    return (x & y) | (~x & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function H(x, y, z) {
    return x ^ y ^ z;
  }
  function I(x, y, z) {
    return y ^ (x | ~z);
  }

  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  }

  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] =
        lWordArray[lWordCount] |
        (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "",
      lByte,
      lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue =
        WordToHexValue +
        WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }

    return utftext;
  }

  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  string = Utf8Encode(string);

  x = ConvertToWordArray(string);

  a = 0x67452301;
  b = 0xefcdab89;
  c = 0x98badcfe;
  d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10], S22, 0x02441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
    a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x04881d05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
    a = AddUnsigned(a, AA);
    d = AddUnsigned(d, DD);
    c = AddUnsigned(c, CC);
    b = AddUnsigned(b, BB);
  }
  var temp = WordToHex(a) + WordToHex(d) + WordToHex(c) + WordToHex(b);
  return temp.toUpperCase();
}

export function md5Str(input) {
  const hash = md5(input); // Mendapatkan nilai hash MD5 dari input
  const codes = []; // Inisialisasi array untuk menyimpan substring
  // Mengambil empat substring lima karakter pertama dari nilai hash
  for (let i = 0; i < 5; i++) {
    codes.push(hash.substr(i * 5, 6));
  }
  return (
    codes[0] + "-" + codes[1] + "-" + codes[2] + "-" + codes[3] + "-" + codes[4]
  ); // Mengembalikan array codes
}

export function supportsLocalStorage() {
  try {
    return "localStorage" in window && window["localStorage"] !== null;
  } catch (e) {
    return false;
  }
}
export function supportsIndexedDB() {
  try {
    return "indexedDB" in window && window["indexedDB"] !== null;
  } catch (e) {
    return false;
  }
}
export function base64ToArrayBuffer() {
  var binaryString =
    "eyJpZCI6MSwidWlkIjoxLCJsb2dnZWRJbiI6dHJ1ZSwiYmFzZV91bHIiOiJodHRwOlwvXC8xOTIuMTY4LjEuMTEyXC9TZXJ2ZXJcL1wvIiwiYmFzZV9hcGkiOiJodHRwOlwvXC8xOTIuMTY4LjEuMTEyXC9TZXJ2ZXJcL2FwaSIsInN1Yl9kb21haW4iOiJhZG1pbnBvc2RpcCIsInV0aG9yaXphdGlvbiI6IlpEazFZMlkzWmpkaVl6RXhaR0V6Wm1aa1ltRmxNemhrTjJKbU5UVmtZVEZrTVdGbU5EUTVOMlpsWm1WbU9EVmhNVGN5TVRnMU5URTNOUT09IiwiZXhwaXJ5IjoiMjAyNC0wOC0wMSAwNTowNjoxNSIsInVzZXJfaWQiOiIxIiwibmFtYSI6IkFkbWluIFBvc2RpcCIsIm5hbWUiOiJBZG1pbiIsImZ1bGxuYW1lIjoiQWRtaW4gUG9zZGlwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Njc4IiwidGVsZXBvbiI6IjA4MTM0MDg5MDI1NSIsImFsYW1hdCI6Ikdvcm9udGFsbywgUG9odXdhdG8sIE1hcmlzYSxUZXJhdGFpIiwiYXZhdGFyIjoiaHR0cDpcL1wvMTkyLjE2OC4xLjExMlwvU2VydmVyXC9pbWFnZXNcLzIwMjRcLzA2XC8xXC9sZm90LnBuZyIsInRodW1ibmFpbCI6Imh0dHA6XC9cLzE5Mi4xNjguMS4xMTJcL1NlcnZlclwvaW1hZ2VzXC8yMDI0XC8wNlwvMVwvbGZvdC5wbmciLCJtYXBJZCI6IlswLjQ3MDczNzgsMTIxLjk0NzAzNjhdIiwibGF0aXR1ZGUiOiIwLjQ3MDczNzgiLCJsb25naXR1ZGUiOiIxMjEuOTQ3MDM2OCIsIm1vZGUiOiJsaWdodCIsImNvdmVyIjoiaHR0cDpcL1wvMTkyLjE2OC4xLjExMlwvU2VydmVyXC9pbWFnZXNcL3Bvc2RpcFwvc29wZC0yNC5wbmciLCJ2YWx1ZSI6MCwibG9rYXNpIjoiR29yb250YWxvLFBvaHV3YXRvLE1hcmlzYSxUZXJhdGFpIiwiZGF0ZSI6IjIwMjRcLzA3XC8yNSIsInRpbWUiOiIwNDowNzoyM2FtIiwiY29sb3IiOiIjMDE2OGZhIiwiY2lyY2xlIjoiIzAxNjhmYSIsImJhY2tncm91bmQiOiIjZThlY2Y0Iiwic2ltY2FydCI6IlNpbXBhdGkiLCJha3VuU3RhdHVzIjoiQWt0aWYiLCJ1c2VyU3RhdHVzIjoib2ZmbGluZSIsImxvZ2luIjpudWxsLCJoaXN0b3J5IjpudWxsLCJwYWNrYWdlIjpudWxsLCJ0aW1lQWdvIjoiMSBKYW0ifQ";
  return getToken(binaryString);
}

(function (global, factory) {
  // CommonJS
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = factory();
  }
  // AMD
  else if (typeof define === "function" && define.amd) {
    define(factory);
  }
  // Global
  else {
    global = global || self;
    global.Dom = factory();
  }
})(this, function () {
  "use strict";
  var Dom = {};
  Dom.Storage = function () {
    const Tds = new Dom.Components();
    const basisData = window.Ngorei;
    const logData = window.location.hash;
    const red = decryptObject(basisData.tokenize, "manifestStorage");
    const dbstorage = new Rtdb().localStorage();
    return {
      jsonView: function (econsole, id) {
        const slicedData = econsole.data.row.slice(0, 1);
        $("#" + id).json_viewer({
          key: econsole.key,
          expair: econsole.expair,
          total: econsole.data.row.length,
          data: slicedData,
        });
      },
      Red: function (row) {
        $.ajax({
          url: red.endpoint + "api/v1/inside/delete/" + row.cradensial,
          headers: {
            Authorization: red.cradensial,
            "Content-Type": "application/json",
          },
          method: "POST",
          dataType: "json",
          data: JSON.stringify(setToken(row)),
          async: false,
          success: function (data) {
            // console.log(data)
          },
        });
      },
      large: function (row) {
        const now = new Date().getTime();
        let renderData = [];
        const additionalText = setToken(row);
        var iniToken = md5(row.endpoint + row.expire + logData);
        var newToken = {
          credensial: red.cradensial,
          expair: new Date().toISOString(),
          token: additionalText,
        };
        const localData =
          supportsLocalStorage() && localStorage.getItem(iniToken);
        let dataBaru = true;
        if (localData) {
          const dataTerproses = JSON.parse(localData);
          var add = JSON.stringify(dataTerproses, null, 10);
          renderData = JSON.parse(add);
          const lastFetch = new Date(dataTerproses.expair).getTime();
          const satuJam = Number(row.expire) * 60 * 1000; // Satu jam dalam milidetik
          if (now - lastFetch < satuJam) {
            dataBaru = false;
          }
        }
        function addStorage(iniToken) {
          $.ajax({
            url: red.endpoint + "api/v4/" + row.endpoint,
            headers: {
              Authorization: red.cradensial,
              "Content-Type": "application/json",
            },
            method: "POST",
            dataType: "json",
            data: JSON.stringify(setToken(row)),
            async: false,
            success: function (data) {
              var setTerproses = {
                expair: newToken.expair,
                endpoint: row.endpoint,
                credensial: iniToken,
                storage: data,
              };
              var add = JSON.stringify(setTerproses, null, 10);
              renderData = JSON.parse(add);
              if (supportsLocalStorage()) {
                localStorage.setItem(iniToken, JSON.stringify(setTerproses));
              }
            },
          });
        }

        if (row.action) {
          addStorage(iniToken);
        }

        if (!row.action) {
          if (dataBaru) {
            addStorage(iniToken);
          }
        }
        var decrypted = renderData.storage;
        return {
          key: iniToken,
          expair: newToken.expair,
          total: decrypted.row.length,
          data: {
            [row.data.content]: decrypted.row,
          },
        };
      },
      Content: function (row) {
        const now = new Date().getTime();
        let renderData = [];
        const additionalText = setToken(row);
        var iniToken = md5(row.endpoint + row.expire + logData);
        var newToken = {
          credensial: red.cradensial,
          expair: new Date().toISOString(),
          token: additionalText,
        };
        const localData =
          supportsLocalStorage() && localStorage.getItem(iniToken);
        let dataBaru = true;
        if (localData) {
          const dataTerproses = JSON.parse(localData);
          var add = JSON.stringify(dataTerproses, null, 10);
          renderData = JSON.parse(add);
          const lastFetch = new Date(dataTerproses.expair).getTime();
          const satuJam = Number(row.expire) * 60 * 1000; // Satu jam dalam milidetik
          if (now - lastFetch < satuJam) {
            dataBaru = false;
          }
        }
        function addStorage(iniToken) {
          $.ajax({
            url: red.endpoint + "api/v1/inside/tabel/" + row.endpoint,
            headers: {
              Authorization: red.cradensial,
              "Content-Type": "application/json",
            },
            method: "POST",
            dataType: "json",
            data: JSON.stringify(setToken(row)),
            async: false,
            success: function (data) {
              var setTerproses = {
                expair: newToken.expair,
                endpoint: row.endpoint,
                credensial: iniToken,
                storage: data,
              };
              var add = JSON.stringify(setTerproses, null, 10);
              renderData = JSON.parse(add);
              // if (!row.action) {
              if (supportsLocalStorage()) {
                localStorage.setItem(iniToken, JSON.stringify(setTerproses));
              }
              // }
            },
          });
        }

        if (row.action) {
          addStorage(iniToken);
        }

        if (!row.action) {
          if (dataBaru) {
            addStorage(iniToken);
          }
        }
        var decrypted = renderData.storage;

        return {
          key: iniToken,
          expair: newToken.expair,
          total: decrypted.row.length,
          data: {
            [row.data.content]: decrypted.row,
            //[row.data.content]: sortAscById(decrypted.row)
          },
        };
      },

      Oauth: function (row) {
        console.log(red);
        const element = new Dom.Components();
        fetch(red.endpoint + "sdk/" + row.endpoint, {
          method: "POST",
          headers: {
            Authorization: red.cradensial,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(setToken(row)),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "success") {
              console.log(result);

              if (row.status === "signup") {
                if (result.response.thread === 2) {
                  var alert = "alert-success";
                  // Kosongkan input, select, dan textarea
                  $(
                    'input[type="file"], input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], input[type="tel"], input[type="date"], select, textarea'
                  ).val("");
                  // Hapus tanda cek dari radio dan checkbox
                  $('input[type="radio"], input[type="checkbox"]').prop(
                    "checked",
                    false
                  );
                } else if (result.response.thread === 3) {
                  var alert = "alert-danger";
                } else {
                  var alert = "alert-primary";
                }
                element.alert({
                  elementById: row.idInfo,
                  icon: "picons-thin-icon-thin-0699_user_profile_avatar_man_male fs-30px pt-5px",
                  class: "alert alert-outline d-flex align-items-top " + alert,
                  headline: result.response.message,
                });
                setTimeout(() => {
                  $("#" + row.idInfo).html("");
                  //if (result.response.thread===2) {
                  //  dbstorage.setItem('oauth', result.response.token);
                  //  // window.location.assign(basisData.baseURL+row.config.callback);
                  //}
                }, 4000); // Menghapus elemen alert setelah 5 detik
              } else if (row.status === "signin") {
                if (result.response.thread === 2) {
                  var alert = "alert-success";
                } else if (result.response.thread === 3) {
                  var alert = "alert-danger";
                } else {
                  var alert = "alert-primary";
                }

                element.alert({
                  elementById: row.idInfo,
                  elementById: row.idInfo,
                  icon: "picons-thin-icon-thin-0699_user_profile_avatar_man_male fs-30px pt-5px",
                  class: "alert alert-outline d-flex align-items-top " + alert,
                  headline: result.response.message,
                });
                setTimeout(() => {
                  $("#" + row.idInfo).html("");
                  if (result.response.thread === 2) {
                    dbstorage.setItem("oauth", result.response.token);
                    window.location.assign(
                      basisData.baseURL + row.config.callback
                    );
                  }
                }, 4000); // Menghapus elemen alert setelah 5 detik
              }
              localStorage.removeItem(row.tabel);
            } else {
              console.error(result);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            // Opsional, coba lagi nanti
          });
      },
      Drive: function (row) {
        let econsole = [];
        $.ajax({
          url: red.endpoint + "sdk/" + row.endpoint,
          headers: {
            Authorization: red.cradensial,
            "Content-Type": "application/json",
          },
          method: "POST",
          data: JSON.stringify(setToken(row)),
          dataType: "json",
          async: false,
          success: function (data) {
            var add = JSON.stringify(data, null, 10);
            econsole = JSON.parse(add);
          },
        });
        if (econsole.status === "success") {
          Tds.closeModal();
          console.log(econsole.status);
          onReload();
          return econsole;
        } else {
          return false;
        }
      },
      From: function (row) {
        // console.log(row)
        const quillID = row.config.quill ? row.config.quill : "";

        fetch(red.endpoint + "sdk/" + row.endpoint, {
          method: "POST",
          headers: {
            Authorization: red.cradensial,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row),
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "success") {
              if (quillID) {
                $("#area" + quillID.elementById + " .ql-editor").html(" ");
              }
              $(
                'input[type="file"], input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="url"], input[type="tel"], input[type="date"], select, textarea'
              ).val("");
              // Hapus tanda cek dari radio dan checkbox
              $('input[type="radio"], input[type="checkbox"]').prop(
                "checked",
                false
              );
              localStorage.removeItem(row.tabel);
              // console.log(result)
            } else {
              console.error(result);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            // Opsional, coba lagi nanti
          });
      },
      XHR: function (row) {
        const now = new Date().getTime();
        let renderData = [];
        const additionalText = setToken(row);
        var iniToken = md5(row.endpoint + row.expire + logData);
        var newToken = {
          credensial: red.cradensial,
          expair: new Date().toISOString(),
          token: additionalText,
        };
        const localData =
          supportsLocalStorage() && localStorage.getItem(iniToken);
        let dataBaru = true;
        if (localData) {
          const dataTerproses = JSON.parse(localData);
          var add = JSON.stringify(dataTerproses, null, 10);
          renderData = JSON.parse(add);
          const lastFetch = new Date(dataTerproses.expair).getTime();
          const satuJam = Number(row.expire) * 60 * 1000; // Satu jam dalam milidetik
          if (now - lastFetch < satuJam) {
            dataBaru = false;
          }
        }
        if (dataBaru) {
          var settings = {
            url: row.endpoint,
            method: "GET",
            timeout: 0,
            datatype: "json",
            async: false,
          };
          $.ajax(settings).done(function (data) {
            const encrypted = encryptObject(data, row.endpoint);
            var setTerproses = {
              expair: newToken.expair,
              endpoint: row.endpoint,
              credensial: iniToken,
              encrypt: encrypted,
            };
            var add = JSON.stringify(setTerproses, null, 10);
            renderData = JSON.parse(add);
            if (supportsLocalStorage()) {
              localStorage.setItem(iniToken, JSON.stringify(setTerproses));
            }
          });
        }
        const decrypted = decryptObject(renderData.encrypt, row.endpoint);
        return {
          key: iniToken,
          expair: newToken.expair,
          total: decrypted.length,
          data: {
            [row.data.content]: decrypted,
          },
        };
      },
      Credensial: function (row) {
        let renderData = [];
        $.ajax({
          url: red.endpoint + "api/v1/inside/cradensial/" + red.cradensial,
          headers: {
            Authorization: red.cradensial,
            "Content-Type": "application/json",
          },
          method: "POST",
          dataType: "json",
          data: JSON.stringify(setToken(row)),
          async: false,
          success: function (data) {
            var add = JSON.stringify(data, null, 10);
            renderData = JSON.parse(add);
          },
        });
        return renderData;
      },
      localStorage: function (e) {
        const dbstorage = new Rtdb().localStorage();
        return {
          get: function () {
              return dbstorage.getItem(e.key);
          },
        }
       
      },
      dsds4: function () {},
    };
  };

  Dom.Components = function () {
    const ents = window;
    const basisData = window.Ngorei;
    const logData = window.location.hash;
    const red = decryptObject(basisData.tokenize, "manifestStorage");
    //console.log(red)
    const dbstorage = new Rtdb().localStorage();
    var el = dbstorage.getItem("frontend");
    //console.log(el)
    return {
      form: function (config) {
        (async () => {
          const dbstorage = new Rtdb().localStorage(); //addItem
          dbstorage.addItem("From", {
            id: config.elementById,
            type: "form",
            config,
          });
          // console.log(config.elementById)
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Form(config);
          const assets = Dom.Components();
          function findAndDisplaySelectData(data) {
            // Iterasi melalui setiap properti dalam objek
            for (const key in data) {
              // Periksa jika properti adalah objek array
              if (Array.isArray(data[key])) {
                // Ambil elemen pertama dari array untuk memeriksa tipe
                const type = data[key][0];
                // Jika tipe adalah 'select', tampilkan data
                if (type === "search") {
                  assets.Search({
                    getElementById: "suggestions_" + key,
                    textInput: "search" + key,
                    suggestions: config.suggestions,
                    data: data[key][6],
                    sendCallback: function (formData) {
                      // console.log(formData);
                    },
                  });
                }
                if (type === "datepicker") {
                  $('input[name="' + key + '"]').datepicker({
                    dateFormat: data[key][3],
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                  });
                }
                if (type === "select") {
                  assets.Select({
                    elementById: "selectID_" + key,
                    placeholder: data[key][2],
                    attrName: key,
                    options: data[key][6],
                  });
                }
              }
            }
          }
          findAndDisplaySelectData(config.action);
          const editorItem = config.quill ? config.quill : "";
          if (editorItem) {
            if (editorItem.type === "inline") {
              var quill = new Quill("#area" + editorItem.elementById, {
                modules: {
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ header: 1 }, { header: 2 }, "blockquote"],
                    ["link", "image", "code-block"],
                  ],
                },
                bounds: "#area" + editorItem.elementById,
                scrollingContainer: "#scrolling-container",
                placeholder: editorItem.placeholder,
                theme: "bubble",
              });
            } else {
              var quill = new Quill("#area" + editorItem.elementById, {
                modules: {
                  toolbar: [
                    ["bold", "italic"],
                    ["link", "blockquote", "code-block", "image"],
                    [{ list: "ordered" }, { list: "bullet" }],
                  ],
                },
                placeholder: editorItem.placeholder,
                theme: "snow",
              });
            }
            quill.on("text-change", function () {
              var editorContent = quill.root.innerHTML;
              document.getElementById(
                "inputId" + editorItem.elementById
              ).value = editorContent;
            });
          }
        })();

        // console.log(config)
      },
      Oauth: function (config) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Oauth(config);
        })();
      },

      jsonView: function (econsole, id) {
        $("#" + id).json_viewer(econsole);
      },
      storageKey: function (token, key) {
        let mydata = [];
        $.ajax({
          url: red.endpoint + "api/v1/inside/storageKey/" + token,
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          method: "POST",
          dataType: "json",
          data: JSON.stringify(
            setToken({
              key: key,
              cradensial: token,
            })
          ),
          async: false,
          success: function (data) {
            var add = JSON.stringify(data, null, 10);
            mydata = JSON.parse(add);
          },
        });
        return mydata;
      },
      Qrcode: function (main) {
        var qr = (window.qr = new QRious({
          element: document.getElementById(main.element),
          size: main.size,
          background: main.background,
          foreground: main.foreground,
          value: main.value,
        }));
      },

      Dopdown: function (data) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Dopdown(data);
        })();
      },
      Collapse: function (options) {
         (async () => {
           const utilObj = await Utilities(el.frontend);
           const util = utilObj[el.frontend]();
           util.Collapse(options);
         })();
      },
      alert: function (info) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Alert(info);
        })();
      },
      Carousel: function (info) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Carousel(info);
        })();
      },
      Scrollbar: function (info) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Scrollbar(info);
        })();
      },
      Tab: function (info) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Tab(info);
        })();
      },
      Accordion: function (info) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Accordion(info);
        })();
      },
      Wizard: function (config) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Wizard(config);
          const assets = Dom.Components();
          function findAndDisplaySelectData(data) {
            // Iterasi melalui setiap properti dalam objek
            for (const key in data) {
              // Periksa jika properti adalah objek array
              if (Array.isArray(data[key])) {
                // Ambil elemen pertama dari array untuk memeriksa tipe
                const type = data[key][0];
                // Jika tipe adalah 'select', tampilkan data
                if (type === "search") {
                  assets.Search({
                    getElementById: "suggestions_" + key,
                    textInput: "search" + key,
                    suggestions: config.suggestions,
                    data: data[key][6],
                    sendCallback: function (formData) {
                      // console.log(formData);
                    },
                  });
                }
                if (type === "datepicker") {
                  $('input[name="' + key + '"]').datepicker({
                    dateFormat: data[key][3],
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                  });
                }
                if (type === "select") {
                  assets.Select({
                    elementById: "selectID_" + key,
                    placeholder: data[key][2],
                    attrName: key,
                    options: data[key][6],
                  });
                }
              }
            }
          }
          findAndDisplaySelectData(config.action);
        })();
      },
      Select: function (options, callback) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Select(options, callback);
        })();
      },

      Search: function (options) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.Search(options);
        })();
      },
      closeModal: function () {
        return closeModal();
      },

      Drive: function (config) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          util.drive(config);
          const assets = Dom.Components();
          function findAndDisplaySelectData(data) {
            // Iterasi melalui setiap properti dalam objek
            for (const key in data) {
              // Periksa jika properti adalah objek array
              if (Array.isArray(data[key])) {
                // Ambil elemen pertama dari array untuk memeriksa tipe
                const type = data[key][0];
                // Jika tipe adalah 'select', tampilkan data
                if (type === "search") {
                  assets.Search({
                    getElementById: "suggestions_" + key,
                    textInput: "search" + key,
                    suggestions: config.suggestions,
                    data: data[key][6],
                    sendCallback: function (formData) {
                      // console.log(formData);
                    },
                  });
                }
                if (type === "datepicker") {
                  $('input[name="' + key + '"]').datepicker({
                    dateFormat: data[key][3],
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                  });
                }
                if (type === "select") {
                  assets.Select({
                    elementById: "selectID_" + key,
                    placeholder: data[key][2],
                    attrName: key,
                    options: data[key][6],
                  });
                }
              }
            }
          }
          findAndDisplaySelectData(config.action);
          const editorItem = config.quill ? config.quill : "";
          if (editorItem) {
            if (editorItem.type === "inline") {
              var quill = new Quill("#area" + editorItem.elementById, {
                modules: {
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ header: 1 }, { header: 2 }, "blockquote"],
                    ["link", "image", "code-block"],
                  ],
                },
                bounds: "#quillInline",
                scrollingContainer: "#scrolling-container",
                placeholder: "Write something...",
                theme: "bubble",
              });
            } else {
              var quill = new Quill("#area" + editorItem.elementById, {
                modules: {
                  toolbar: [
                    ["bold", "italic"],
                    ["link", "blockquote", "code-block", "image"],
                    [{ list: "ordered" }, { list: "bullet" }],
                  ],
                },
                placeholder: "Text Editor...",
                theme: "snow",
              });
            }
            quill.on("text-change", function () {
              var editorContent = quill.root.innerHTML;
              document.getElementById(
                "inputId" + editorItem.elementById
              ).value = editorContent;
            });
          }
        })();
      },
      createModal: function (modalId, title, red, entri) {
        var row = red.modal;
        const elID = row.elID;
        const dls = new Dom.Storage();
        const modal = document.createElement("div");
        modal.className = "modal fade";
        modal.id = modalId;
        modal.tabIndex = -1;
        modal.role = "dialog";
        modal.setAttribute("aria-labelledby", "exampleModalLabel");
        modal.setAttribute("aria-hidden", "true");
        // Membuat elemen dialog modal
        const modalDialog = document.createElement("div");
        modalDialog.className = "modal-dialog";
        modalDialog.role = "document";
        modalDialog.id = "content" + modalId;

        // Membuat elemen konten modal
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";
        modalContent.id = "modalcontent" + modalId;
        // Membuat elemen header modal
        const modalHeader = document.createElement("div");
        modalHeader.className = "modal-header";
        // Membuat elemen judul modal
        const modalTitle = document.createElement("h5");
        modalTitle.className = "modal-title";
        modalTitle.id = "exampleModalLabel";

        modalTitle.innerText = title;
        // Membuat tombol tutup (close button) di header modal
        const closeButton = document.createElement("a");
        closeButton.className = "close";
        closeButton.id = "modal_close";
        closeButton.setAttribute("aria-label", "Close");

        // Membuat elemen span untuk ikon '×' pada tombol tutup
        const closeSpan = document.createElement("span");
        closeSpan.innerHTML = "&times;";
        // Merangkai elemen header modal
        closeButton.appendChild(closeSpan);
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        // Membuat elemen body modal
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";

        // Membuat paragraf di body modal
        const modalParagraph = document.createElement("div");
        modalParagraph.className = "mg-b-0";
        // modalParagraph.innerHTML = "bodyContent";

        if (
          row.model == "form" ||
          row.model == "Oauth" ||
          row.model == "Drive"
        ) {
          if (entri[3] === "delete" || entri[3] === "recycle") {
            modalParagraph.innerHTML = "";
          } else {
            modalParagraph.innerHTML =
              '<div id="' + elID + 'From">' + elID + "From</div>";
            $(modalBody).css({
              "padding-bottom": "0.1rem",
              "padding-top": "0.1rem",
            });
          }
        } else if (row.model == "Route") {
          modalParagraph.innerHTML =
            '<div id="Router' + elID + '">Router' + elID + "</div>";
        } else {
          modalParagraph.innerHTML = row.body;
        }

        // Merangkai elemen body modal
        modalBody.appendChild(modalParagraph);
        // Merangkai elemen modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);

        if (entri[3] === "delete" || entri[3] === "recycle") {
          const modalFooter = document.createElement("div");
          if (entri[3] === "delete") {
            var btn = "btn-danger  btn-xs";
            var btnText = "Hapus";
            modalTitle.innerText = "Hapus Permanen";
            modalParagraph.innerHTML =
              "Anda yakin ingin meghapus item <b>" +
              title +
              "</b> secara permanen dari database";
          } else if (entri[3] === "recycle") {
            var btnText = "Pindah";
            var btn = "btn-primary  btn-xs";
            modalTitle.innerText = "Pindahkan ke sampah?";
            modalParagraph.innerHTML =
              "<b>" +
              title +
              "</b> akan pindah ke item di sampah akan otomatis dihapus setelah 30 hari. Anda bisa menghapusnya lebih awal dari sampah dengan membuka log aktivitas recycle.";
          }
          //
          modalFooter.className = "modal-footer";
          modalDialog.className = "modal-dialog modal-dialog-top modal-sm";
          //
          const closeBtn = document.createElement("button");
          closeBtn.type = "button";
          closeBtn.className = "btn bold btn-outline-light btn-xs";
          closeBtn.setAttribute("data-dismiss", "modal");
          closeBtn.innerText = "Batalkan";

          // Membuat tombol 'Save changes' di footer modal
          const saveChangesBtn = document.createElement("button");
          saveChangesBtn.type = "button";
          saveChangesBtn.className = "btn bold " + btn;
          saveChangesBtn.innerText = btnText;
          saveChangesBtn.onclick = function () {
            dls.Red({
              key: entri[2],
              action: entri[3], // delete|recycle
              cradensial: red.key,
            });
            closeModal();
            onReload();
          };
          // Merangkai elemen footer modal
          modalFooter.appendChild(closeBtn);
          modalFooter.appendChild(saveChangesBtn);
          modalContent.appendChild(modalFooter);
          $(modalFooter).css({
            "padding-bottom": "0.5rem",
            "padding-top": "0.5rem",
          });
        }
        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);
        document.body.appendChild(modal);


  // Fungsi untuk memeriksa tinggi konten
  function checkContentHeight() {
    if (modalBody.scrollHeight > 500) {

      // modalBody.classList.add('scrollable');
    } else {
      // modalBody.classList.remove('scrollable');
    }
      console.log(modalBody.scrollHeight)
  }

  // Panggil fungsi setelah konten dimuat
  setTimeout(checkContentHeight, 0);

  // Tambahkan event listener untuk window resize
  window.addEventListener('resize', checkContentHeight);





        return modal;
      },
      makeModalDraggable: function (modalId) {
        const modalElement = $("#" + modalId + " .modal-dialog");
        if (modalElement.length) {
          modalElement.draggable({
            handle: ".modal-header",
            scroll: false,
          });
        }
      },
      Modal: function (row) {
        (async () => {
          const utilObj = await Utilities(el.frontend);
          const util = utilObj[el.frontend]();
          function createButton(
            modalId,
            backdropOption,
            backdropColor = "rgba(0, 0, 0, 0.5)"
          ) {
            // Membuat elemen tombol
            const button = document.getElementById(row.elementById);
            if (button) {
              button.style.cursor = "pointer";
              // Menambahkan event untuk membuka modal saat tombol diklik
              button.onclick = function () {
                $("#" + modalId).modal({ backdrop: backdropOption });
                $(".modal-backdrop").css("background-color", backdropColor);

                if (row.model == "Route") {
                  // console.log(basisData.baseURL)
                  $.ajax({
                    type: "POST",
                    url: basisData.baseURL + "thread",
                    data: "package=" + basisData.baseURL + "" + row.body.public,
                    beforeSend: function () {
                      // $("#Router"+elID).html(util.spinner(e.element.spinner.thread));
                    },
                    success: function (response) {
                      $("#Router" + elID).html(response);
                    },
                  });
                }
              };

              if (
                row.model == "form" ||
                row.model == "Oauth" ||
                row.model == "Drive"
              ) {
                const Fls = new Dom.Components();
                const formInstance = row.body;
                formInstance.elementById = elID + "From";
                formInstance.modalId = elID;
                Fls[row.model](formInstance);

                $(".modal-body").css({
                  "padding-bottom": "0.1rem",
                  "padding-top": "0.1rem",
                });
              }
            }
          }

          function makeModalDraggable(modalId) {
            $("#" + modalId + " .modal-dialog").draggable({
              handle: ".modal-header",
              scroll: false,
            });
          }
          const elID = Math.random().toString(36).substring(2, 15);
          if (
            row.model == "form" ||
            row.model == "Oauth" ||
            row.model == "Drive"
          ) {
            var content = '<div id="' + elID + 'From">' + elID + "From</div>";
          } else if (row.model == "Route") {
            var content = '<div id="Router' + elID + '">' + elID + "From</div>";
          } else {
            var content = row.body;
          }

          // Membuat modal dengan ID dan konten yang ditentukan
          util.Modal(elID, row.title, content);
          // Membuat tombol untuk membuka modal dengan backdrop 'static'
          createButton(elID, row.backdrop, row.backdropColor);
          if (row.element) {
            var containsPxOrPercent =
              row.element.sizes.includes("px") ||
              row.element.sizes.includes("%");
            if (containsPxOrPercent) {
              $("#content" + elID).css({
                "max-width": row.element.sizes,
              });
              //$("#modalcontent"+elID).addClass('modal-dialog-centered');
            } else {
              $("#content" + elID).addClass(row.element.sizes);
            }
            $("#" + elID).addClass(row.element.animation);
          }
          makeModalDraggable(elID);
        })();
        // return new ES1(row);
      },
    };
  };
  Dom.html = function () {
    return {
      ES1: function (row) {
        return new ES1(row);
      },
      ES2: function (row) {
        return new ES2(row);
      },
      ES3: function (row) {
        return new ES3(row);
      },
      Tabel: function (row) {
        return {
          advanced: function () {
            //const tabelDinamis = new TabelAdvanced();
            //return tabelDinamis.init(row);
          },
          Array: function () {
            return {
              ES1: function () {
                return new ES4(row);
              },
              ES2: function () {
                return new ES5(row);
              },
              ES3: function () {
                return new ES6(row);
              },
            };
          },
          Content: function () {
            const STG = new Dom.Storage();
            const red = STG.Content({
              endpoint: row.endpoint,
              expire: Number(row.expire),
              action: row.action,
              data: {
                where: "",
                limit: row.data.limit ? row.data.limit : "",
                order: row.data.order ? row.data.order : "",
                content: row.data.content,
              },
            });
            return {
              ES1: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };
                return new ES4(newrow);
              },
              ES2: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  search: row.search,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };
                return new ES5(newrow);
              },
              ES3: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  search: row.search,
                  pagination: row.pagination,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };

                return new ES6(newrow);
              },
            };
          },
          Large: function () {
            const STG = new Dom.Storage();
            const red = STG.large({
              endpoint: row.endpoint,
              expire: Number(row.expire),
              action: row.action,
              data: {
                where: "",
                limit: row.data.limit ? row.data.limit : "",
                order: row.data.order ? row.data.order : "",
                content: row.data.content,
              },
            });
            return {
              ES1: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };
                return new ES4(newrow);
              },
              ES2: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  search: row.search,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };
                return new ES5(newrow);
              },
              ES3: function () {
                var newrow = {
                  elementById: row.elementById,
                  content: row.content,
                  search: row.search,
                  pagination: row.pagination,
                  order: Number(row.order) ? Number(row.order) : 5,
                  data: red.data,
                };
                return new ES6(newrow);
              },
            };
          },
        };
        // return new ES4(row);
      },
      Large: function (row) {
        const STG = new Dom.Storage();
        const red = STG.large({
          endpoint: row.endpoint,
          expire: Number(row.expire),
          action: row.action,
          data: {
            where: "",
            limit: row.data.limit ? row.data.limit : "",
            order: row.data.order ? row.data.order : "",
            content: row.data.content,
          },
        });

        return {
          ES1: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            return new ES1(newrow);
          },
          ES2: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              search: row.search,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            return new ES2(newrow);
          },
          ES3: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              search: row.search,
              pagination: row.pagination,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            return new ES3(newrow);
          },
        };
      },
      Content: function (row) {
        const STG = new Dom.Storage();
        const red = STG.Content({
          endpoint: row.endpoint,
          action: row.action,
          expire: Number(row.expire),
          data: {
            where: "",
            limit: row.data.limit ? row.data.limit : "",
            order: row.data.order ? row.data.order : "",
            content: row.data.content,
          },
        });
        return {
          ES1: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            new ES1(newrow);
            return red;
          },
          ES2: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              search: row.search,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            new ES2(newrow);
            return red;
          },
          ES3: function () {
            var newrow = {
              elementById: row.elementById,
              content: row.content,
              search: row.search,
              pagination: row.pagination,
              order: Number(row.order) ? Number(row.order) : 5,
              data: red.data,
            };
            new ES3(newrow);
            return red;
          },
        };
      },

      XHR: function () {},
    };
  };
  // Return objek Dom sebagai hasil dari factory
  return Dom;
});

export function assetsData(baseURL) {
  fetch(baseURL + "app/helpers/package", {
    method: "GET",
  })
    .then((response) => {
      // Periksa apakah respons berhasil
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      // Coba untuk mengonversi respons ke JSON
      return response.json();
    })
    .then((data) => {
      // Periksa apakah data yang diterima adalah objek
      if (typeof data !== "object") {
        throw new Error("Invalid JSON format");
      }
      // console.log("Success:", data);
    })
    .catch((error) => {
      // console.error('Error:', error);
    });
}

export function fetchAndStoreFileList(key) {
  const filePath = window.Ngorei.baseURL + "package/package.json";
  let mydata = [];
  $.ajax({
    url: filePath,
    method: "POST",
    datatype: "json",
    async: false,
    success: function (data) {
      var add = JSON.stringify(data, null, 10);
      mydata = JSON.parse(add);
      localStorage.setItem("package", JSON.stringify(data));
    },
  });
  return mydata[key];
}

// Fungsi untuk mengambil data dari localStorage berdasarkan nama key
export function packageKey(key, development) {
  // console.log(development)
  if (development) {
    return fetchAndStoreFileList(key);
  } else {
    // Mengambil data dari localStorage
    const fileListData = localStorage.getItem("package");
    if (fileListData) {
      // Mengonversi data JSON dari localStorage ke objek JavaScript
      const data = JSON.parse(fileListData);
      // Mencari data berdasarkan nama key
      if (key && data[key]) {
        return data[key];
      } else {
        return fetchAndStoreFileList(key);
      }
    } else {
      return fetchAndStoreFileList(key);
    }
  }
}

export function ES1(row) {
  this.data = row;
  const self = this;
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  // rowPerPage = rowPerPage > pageLimit ? pageLimit : row.order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / rowPerPage);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var es2newElement = document.createElement("div");
  var es2Template = document.getElementById(row.elementById);
  es2newElement.innerHTML = oldElement.innerHTML;

  let template = oldElement.innerHTML;

  let rowContent = template
    .substring(template.indexOf(sID), template.indexOf(eID) + eID.length)
    .trim();

  var hasilTemplate = document.getElementById(row.elementById);
  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + elID;
  var newElement = document.createElement("div");
  newElement.id = indexID;
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = "") {
    var startIndex = (page - 1) * 1;
    var slicedData = originalData[rowID].slice(
      startIndex,
      startIndex + pageLimit
    );
    // console.log(slicedData)
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);

    document.getElementById(indexID).innerHTML = rendered;
    const rootElement = document.getElementById(indexID);
    nodeElement(rootElement);

    if (rootElement.attributes.slider) {
      let currentSlide = 0;
      const sliderTrack = document.getElementById(elID);
      const itemsPerSlide = Number(rootElement.attributes.slider.value);
      const columns = parseInt(rootElement.getAttribute("slider"));
      const sliderItems = document.querySelectorAll(".slider-item");
      console.log(sliderItems);
      if (columns && sliderItems.length) {
        const width = 100 / columns;
        sliderItems.forEach((item) => {
          item.style.flex = `1 0 ${width}%`;
        });
      }
      const totalSlides = Math.ceil(
        sliderTrack.children.length / itemsPerSlide
      );
      const slides = document.querySelectorAll(
        "#" + rootElement.children[0].id
      );
      let isDragging = false;
      let startPosX = 0;
      let currentPosX = 0;
      let prevTranslate = 0;
      let animationID;
      const totalItems = sliderItems.length;
      const columnsSlide = columns;
      sliderTrack.addEventListener("mousedown", (event) => {
        isDragging = true;
        startPosX = event.clientX - sliderTrack.offsetLeft;
        cancelAnimationFrame(animationID);
        sliderTrack.style.transition = "none";
      });

      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          const endPosX = currentPosX - startPosX;
          const moveThreshold = sliderTrack.offsetWidth / (2 * itemsPerSlide); // Adjust move threshold
          if (Math.abs(endPosX) > moveThreshold) {
            moveSlide(endPosX > 0 ? -1 : 1);
          } else {
            moveSlide(0);
          }
        }
      });

      document.addEventListener("mousemove", (event) => {
        if (isDragging) {
          currentPosX = event.clientX - sliderTrack.offsetLeft;
          const translateX =
            prevTranslate +
            (currentPosX - startPosX) * (100 / sliderTrack.offsetWidth);
          sliderTrack.style.transform = `translateX(${translateX}%)`;
        }
      });

      function moveSlide(direction) {
        currentSlide += columnsSlide;
        if (currentSlide < 0) {
          currentSlide = totalSlides - 1;
        } else if (currentSlide >= totalItems) {
          currentSlide = 0;
        }
        prevTranslate = -currentSlide * (100 / totalItems);
        animateSlide();
      }

      function animateSlide() {
        sliderTrack.style.transition = "transform 0.3s ease";
        sliderTrack.style.transform = `translateX(${prevTranslate}%)`;
        animationID = requestAnimationFrame(() => {
          sliderTrack.style.transition = "";
        });
      }

      // Fungsi untuk menggeser slider setiap 5 detik
      function autoSlide() {
        moveSlide(1);
      }
      setInterval(autoSlide, 5000);

      window.onSlide = function (key) {
        moveSlide(key);
      };
    }
  }

  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }

  renderData(curPage(1));
}

ES1.prototype.Element = function (callback) {
  const self = this; // Simpan referensi this untuk digunakan di dalam fungsi event listener
  let filteredData = [...self.data.data.row]; // Salin data.row agar tidak mengubah data asli
  callback(self.data.data.row);
};

export function ES2(row) {
  this.data = row;
  const self = this;
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  rowPerPage = rowPerPage > pageLimit ? pageLimit : order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / pageLimit);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var es2newElement = document.createElement("div");
  var es2Template = document.getElementById(row.elementById);
  es2newElement.innerHTML = oldElement.innerHTML;

  let template = oldElement.innerHTML;

  let rowContent = template
    .substring(template.indexOf(sID), template.indexOf(eID) + eID.length)
    .trim();

  var hasilTemplate = document.getElementById(row.elementById);
  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + elID;
  var newElement = document.createElement("div");
  newElement.id = indexID;
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = "") {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    document.getElementById(indexID).innerHTML = rendered;
    const rootElement = document.getElementById(indexID);
    nodeElement(rootElement);
  }

  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }
  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    const setfilteredData = originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(keyword)
      )
    );
    return setfilteredData;
  }
  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData }; // Kembalikan data ke data asli jika pencarian kosong
      } else {
        var filteredData = filterData(keyword);
        data[rowID] = filteredData;
      }
      renderData(curPage(1));
    });
  }
  renderData(curPage(1));
}

ES2.prototype.Element = function (callback) {
  const self = this; // Simpan referensi this untuk digunakan di dalam fungsi event listener
  let filteredData = [...self.data.data.row]; // Salin data.row agar tidak mengubah data asli

  // Event listener untuk input pencarian
  document
    .getElementById(self.data.search)
    .addEventListener("input", function (event) {
      const keyword = event.target.value.trim().toLowerCase(); // Ambil kata kunci pencarian
      if (keyword !== "") {
        filteredData = self.data.data.row.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" && value.toLowerCase().includes(keyword)
          )
        );
      } else {
        filteredData = [...self.data.data.row]; // Kembalikan ke data asli jika pencarian kosong
      }
      // Panggil callback dengan panjang data yang sudah difilter
      callback(filteredData);
    });
  callback(self.data.data.row);
};

export function ES3(row) {
  this.data = row;
  const self = this;
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  rowPerPage = rowPerPage > pageLimit ? pageLimit : pageLimit; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / rowPerPage);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var es2newElement = document.createElement("div");
  var es2Template = document.getElementById(row.elementById);
  es2newElement.innerHTML = oldElement.innerHTML;

  let template = oldElement.innerHTML;

  let rowContent = template
    .substring(template.indexOf(sID), template.indexOf(eID) + eID.length)
    .trim();

  var hasilTemplate = document.getElementById(row.elementById);
  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + elID;
  var newElement = document.createElement("div");
  newElement.id = indexID;
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = "") {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    document.getElementById(indexID).innerHTML = rendered;
    const rootElement = document.getElementById(indexID);
    nodeElement(rootElement);
  }

  function paginateData(page) {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function updatePaginationUI() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.classList.add("pagination");
        paginationList.innerHTML = "";

        // Previous Button
        var itemprevButton = document.createElement("li");
        itemprevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          itemprevButton.classList.add("disabled");
        }
        itemprevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Previous">Previous</button>';
        paginationList.appendChild(itemprevButton);

        // Previous Button (short)
        var prevButton = document.createElement("li");
        prevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          prevButton.classList.add("disabled");
        }
        prevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Prev">Prev</button>';
        paginationList.appendChild(prevButton);

        // Calculate the range of pages to display
        var startPage = Math.max(currentPage - 2, 1);
        var endPage = Math.min(startPage + 4, totalPages);
        if (endPage - startPage < 4) {
          startPage = Math.max(endPage - 4, 1);
        }

        // Numbered page buttons
        for (var i = startPage; i <= endPage; i++) {
          var pageButton = document.createElement("li");
          pageButton.classList.add("page-item");
          if (i === currentPage) {
            pageButton.classList.add("active");
          }
          pageButton.innerHTML =
            '<button class="page-link" val="' +
            i +
            '" id="page-' +
            i +
            '">' +
            i +
            "</button>";
          paginationList.appendChild(pageButton);
        }

        // Next Button
        var nextButton = document.createElement("li");
        nextButton.classList.add("page-item", "next");
        if (currentPage === totalPages || totalPages === 0) {
          nextButton.classList.add("disabled");
        }
        nextButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage + 1) +
          '" id="Next">Next</button>';
        paginationList.appendChild(nextButton);

        // Last Button
        var lastButton = document.createElement("li");
        lastButton.classList.add("page-item", "last");
        if (currentPage === totalPages || totalPages === 0) {
          lastButton.classList.add("disabled");
        }
        lastButton.innerHTML =
          '<button class="page-link" val="' +
          totalPages +
          '" id="Last">Last</button>';
        paginationList.appendChild(lastButton);
      }
    } else {
      return false;
    }
  }

  function setupPaginationListeners() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.addEventListener("click", function (event) {
          var targetButton = event.target;

          // Handle click on Previous button
          if (targetButton.id === "Previous" || targetButton.id === "Prev") {
            currentPage = 1; // Reset to page 1

            // Handle click on Next button
          } else if (targetButton.id === "Next") {
            if (currentPage < totalPages) currentPage++;

            // Handle click on Last button
          } else if (targetButton.id === "Last") {
            currentPage = totalPages;

            // Handle click on numbered page buttons
          } else if (targetButton.id.startsWith("page-")) {
            currentPage = parseInt(targetButton.id.split("-")[1]);
          }

          renderData(paginateData(currentPage));
          updatePaginationUI();
        });
        window.orderGrid = function (token, page) {
          // var valueId = event.target.attributes.grid.value
          var statePage = Number(page);
          var storage = localStorage.getItem(token);
          var dbStorage = JSON.parse(storage);
          const decrypted = decryptObject(
            dbStorage.encrypt,
            dbStorage.endpoint
          );
          var red = decrypted.content;
          var startIndex = (1 - 1) * statePage;
          var slicedData = decrypted[red].slice(
            startIndex,
            startIndex + statePage
          );
          var dt = { [red]: slicedData };
          renderData(dt);
          paginateData(1);
          updatePaginationUI();
        };
      }
    } else {
      return false;
    }
  }

  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }
  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    const setfilteredData = originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(keyword)
      )
    );
    return setfilteredData;
  }
  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData }; // Kembalikan data ke data asli jika pencarian kosong
      } else {
        var filteredData = filterData(keyword);
        data[rowID] = filteredData;
      }
      renderData(paginateData(1));
      updatePaginationUI();
    });
  }
  renderData(paginateData(currentPage));
  updatePaginationUI();
  setupPaginationListeners();
}
ES3.prototype.Element = function (callback) {
  const self = this; // Simpan referensi this untuk digunakan di dalam fungsi event listener
  let filteredData = [...self.data.data.row]; // Salin data.row agar tidak mengubah data asli
  console.log(self.data.order);
  // Event listener untuk input pencarian
  document
    .getElementById(self.data.search)
    .addEventListener("input", function (event) {
      const keyword = event.target.value.trim().toLowerCase(); // Ambil kata kunci pencarian
      if (keyword !== "") {
        filteredData = self.data.data.row.filter((item) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" && value.toLowerCase().includes(keyword)
          )
        );
      } else {
        filteredData = [...self.data.data.row]; // Kembalikan ke data asli jika pencarian kosong
      }
      // Panggil callback dengan panjang data yang sudah difilter
      callback(filteredData);
    });

  document
    .querySelector("#" + self.data.pagination)
    .addEventListener("click", function (event) {
      if (event.target.attributes.val) {
        var page = Number(event.target.attributes.val.value);
        var startIndex = (page - 1) * self.data.order;
        var slicedData = filteredData.slice(
          startIndex,
          startIndex + self.data.order
        );
        filteredData = [...self.data.data.row]; // Kembalikan ke data asli jika pencarian kosong
        callback(slicedData);
      }
      // console.log(page1.target.attributes.val.value)
      // var page = Number(event.target.innerHTML);
    });
  callback(self.data.data.row);
};
export function ES4(row) {
  //    this.data = row;
  // const self = this;
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  // rowPerPage = rowPerPage > pageLimit ? pageLimit : row.order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / rowPerPage);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);
  newElement.setAttribute("ngorei", "v4.0.1");

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // console.log(oldElement.innerHTML)
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var template = oldElement.innerHTML;
  var hasilTemplate = document.getElementById(row.elementById);

  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + firstKey;
  var tabelID = "#" + row.elementById + "_" + firstKey;
  var newElement = document.createElement("table");
  newElement.id = indexID;
  // console.log(hasilTemplate)
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = "") {
    var startIndex = (page - 1) * 1;
    var slicedData = originalData[rowID].slice(
      startIndex,
      startIndex + pageLimit
    );
    // console.log(slicedData)
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    var tableElement = document.getElementById(indexID);
    tableElement.innerHTML = rendered;

    var tbodyElement = document.getElementById(firstKey);
    if (tbodyElement && tbodyElement.rows.length > 0) {
      var firstRow = tbodyElement.rows[0];
      var cells = firstRow.cells;

      // Hapus thead yang mungkin sudah ada
      var existingThead = tableElement.querySelector("thead");
      if (existingThead) {
        existingThead.remove();
      }

      var theadElement = document.createElement("thead");
      var headerRow = document.createElement("tr");

      for (var i = 0; i < cells.length; i++) {
        var headerText = cells[i].getAttribute("th") || "";
        var th = document.createElement("th");
        th.textContent =
          headerText.charAt(0).toUpperCase() + headerText.slice(1);
        headerRow.appendChild(th);
      }

      theadElement.appendChild(headerRow);
      tableElement.insertBefore(theadElement, tbodyElement);
    }
  }
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }
  renderData(curPage(1));
}
export function ES5(row) {
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  // rowPerPage = rowPerPage > pageLimit ? pageLimit : row.order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / rowPerPage);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);
  newElement.setAttribute("ngorei", "v4.0.1");

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // console.log(oldElement.innerHTML)
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var template = oldElement.innerHTML;
  var hasilTemplate = document.getElementById(row.elementById);

  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + firstKey;
  var tabelID = "#" + row.elementById + "_" + firstKey;
  var newElement = document.createElement("table");
  newElement.id = indexID;
  // console.log(hasilTemplate)
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = 1) {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    var tableElement = document.getElementById(indexID);
    tableElement.innerHTML = rendered;

    var tbodyElement = document.getElementById(firstKey);
    if (tbodyElement && tbodyElement.rows.length > 0) {
      var firstRow = tbodyElement.rows[0];
      var cells = firstRow.cells;

      // Hapus thead yang mungkin sudah ada
      var existingThead = tableElement.querySelector("thead");
      if (existingThead) {
        existingThead.remove();
      }

      var theadElement = document.createElement("thead");
      var headerRow = document.createElement("tr");

      for (var i = 0; i < cells.length; i++) {
        var headerText = cells[i].getAttribute("th") || "";
        var th = document.createElement("th");
        th.textContent =
          headerText.charAt(0).toUpperCase() + headerText.slice(1);
        headerRow.appendChild(th);
      }

      theadElement.appendChild(headerRow);
      tableElement.insertBefore(theadElement, tbodyElement);
    }
  }
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }

  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    return originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchText)
      )
    );
  }

  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData };
      } else {
        data[rowID] = filterData(keyword);
      }
      renderData(curPage(1));
    });
  }

  renderData(curPage(1));
}

export function ES6(row) {
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  rowPerPage = rowPerPage > pageLimit ? pageLimit : order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / pageLimit);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);
  newElement.setAttribute("ngorei", "v4.0.1");

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }
  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // console.log(oldElement.innerHTML)
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var template = oldElement.innerHTML;
  var hasilTemplate = document.getElementById(row.elementById);

  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + firstKey;
  var tabelID = "#" + row.elementById + "_" + firstKey;
  var newElement = document.createElement("table");
  newElement.id = indexID;
  // console.log(hasilTemplate)
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = 1) {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    var rendered = DOM.render(template, data, oldElement);
    var tableElement = document.getElementById(indexID);
    tableElement.innerHTML = rendered;

    var tbodyElement = document.getElementById(firstKey);
    if (tbodyElement && tbodyElement.rows.length > 0) {
      var firstRow = tbodyElement.rows[0];
      var cells = firstRow.cells;

      // Hapus thead yang mungkin sudah ada
      var existingThead = tableElement.querySelector("thead");
      if (existingThead) {
        existingThead.remove();
      }

      var theadElement = document.createElement("thead");
      var headerRow = document.createElement("tr");

      for (var i = 0; i < cells.length; i++) {
        var headerText = cells[i].getAttribute("th") || "";
        var th = document.createElement("th");
        th.textContent =
          headerText.charAt(0).toUpperCase() + headerText.slice(1);
        headerRow.appendChild(th);
      }

      theadElement.appendChild(headerRow);
      tableElement.insertBefore(theadElement, tbodyElement);
    }
  }
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }

  function paginateData(page) {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function updatePaginationUI() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.classList.add("pagination");
        paginationList.innerHTML = "";

        // Previous Button
        var itemprevButton = document.createElement("li");
        itemprevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          itemprevButton.classList.add("disabled");
        }
        itemprevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Previous">Previous</button>';
        paginationList.appendChild(itemprevButton);

        // Previous Button (short)
        var prevButton = document.createElement("li");
        prevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          prevButton.classList.add("disabled");
        }
        prevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Prev">Prev</button>';
        paginationList.appendChild(prevButton);

        // Calculate the range of pages to display
        var startPage = Math.max(currentPage - 2, 1);
        var endPage = Math.min(startPage + 4, totalPages);
        if (endPage - startPage < 4) {
          startPage = Math.max(endPage - 4, 1);
        }

        // Numbered page buttons
        for (var i = startPage; i <= endPage; i++) {
          var pageButton = document.createElement("li");
          pageButton.classList.add("page-item");
          if (i === currentPage) {
            pageButton.classList.add("active");
          }
          pageButton.innerHTML =
            '<button class="page-link" val="' +
            i +
            '" id="page-' +
            i +
            '">' +
            i +
            "</button>";
          paginationList.appendChild(pageButton);
        }

        // Next Button
        var nextButton = document.createElement("li");
        nextButton.classList.add("page-item", "next");
        if (currentPage === totalPages || totalPages === 0) {
          nextButton.classList.add("disabled");
        }
        nextButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage + 1) +
          '" id="Next">Next</button>';
        paginationList.appendChild(nextButton);

        // Last Button
        var lastButton = document.createElement("li");
        lastButton.classList.add("page-item", "last");
        if (currentPage === totalPages || totalPages === 0) {
          lastButton.classList.add("disabled");
        }
        lastButton.innerHTML =
          '<button class="page-link" val="' +
          totalPages +
          '" id="Last">Last</button>';
        paginationList.appendChild(lastButton);
      }
    } else {
      return false;
    }
  }

  function setupPaginationListeners() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.addEventListener("click", function (event) {
          var targetButton = event.target;

          // Handle click on Previous button
          if (targetButton.id === "Previous" || targetButton.id === "Prev") {
            currentPage = 1; // Reset to page 1

            // Handle click on Next button
          } else if (targetButton.id === "Next") {
            if (currentPage < totalPages) currentPage++;

            // Handle click on Last button
          } else if (targetButton.id === "Last") {
            currentPage = totalPages;

            // Handle click on numbered page buttons
          } else if (targetButton.id.startsWith("page-")) {
            currentPage = parseInt(targetButton.id.split("-")[1]);
          }

          renderData(paginateData(currentPage));
          updatePaginationUI();
        });
        window.orderGrid = function (token, page) {
          // var valueId = event.target.attributes.grid.value
          var statePage = Number(page);
          var storage = localStorage.getItem(token);
          var dbStorage = JSON.parse(storage);
          const decrypted = decryptObject(
            dbStorage.encrypt,
            dbStorage.endpoint
          );
          var red = decrypted.content;
          var startIndex = (1 - 1) * statePage;
          var slicedData = decrypted[red].slice(
            startIndex,
            startIndex + statePage
          );
          var dt = { [red]: slicedData };
          renderData(dt);
          paginateData(1);
          updatePaginationUI();
        };
      }
    } else {
      return false;
    }
  }

  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    const setfilteredData = originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(keyword)
      )
    );
    return setfilteredData;
  }
  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData }; // Kembalikan data ke data asli jika pencarian kosong
      } else {
        var filteredData = filterData(keyword);
        data[rowID] = filteredData;
      }
      renderData(curPage(1));
    });
  }

  renderData(paginateData(currentPage));
  updatePaginationUI();
  setupPaginationListeners();
}
export function ES6XXXXXXXXXXXXXX(row) {
  var firstKey = Object.keys(row.data)[0];
  var iID = "#" + firstKey;
  var sID = "{@" + firstKey + "}";
  var eID = "{/" + firstKey + "}";
  var rowID = Object.keys(row.data)[0];
  var originalData = row.data;
  var data = { ...originalData };
  var currentPage = 1;

  var search = row.search;
  var pageLimit = row.order;
  var rowPerPage = data[rowID].length; // Jumlah item per halaman
  rowPerPage = rowPerPage > pageLimit ? pageLimit : order; // Batasi rowPerPage tidak lebih dari 5
  var totalPages = Math.ceil(data[rowID].length / pageLimit);
  var oldElement = document.getElementById(row.elementById);

  if (!oldElement) {
    console.error("Elemen dengan ID tersebut tidak ditemukan.");
    return;
  }
  // Membuat elemen baru <script> dengan atribut type="text/template"

  var newElement = document.createElement("script");
  newElement.setAttribute("type", "text/template");
  newElement.setAttribute("id", firstKey + "_" + row.elementById);
  newElement.setAttribute("ngorei", "v4.0.1");

  // Menyalin atribut dari elemen lama ke elemen baru
  for (var i = 0; i < oldElement.attributes.length; i++) {
    var attr = oldElement.attributes[i];
    newElement.setAttribute(attr.name, attr.value);
  }

  // Menyalin konten dari elemen lama ke elemen baru
  newElement.innerHTML = oldElement.innerHTML;
  // Mengganti elemen lama dengan elemen baru di dalam DOM
  oldElement.parentNode.replaceChild(newElement, oldElement);
  var el = oldElement.children[0];
  var elID = oldElement.children[0].id;
  el.id = firstKey;
  el.innerHTML = sID + el.innerHTML + eID;
  var es2newElement = document.createElement("div");
  var es2Template = document.getElementById(row.elementById);
  es2newElement.innerHTML = oldElement.innerHTML;

  let template = oldElement.innerHTML;

  var hasilTemplate = document.getElementById(row.elementById);
  var elx = hasilTemplate.children[0];
  var indexID = row.elementById + "_" + firstKey;
  var tabelID = "#" + row.elementById + "_" + firstKey;
  var newElement = document.createElement("tbody");
  newElement.id = indexID;
  hasilTemplate.parentNode.insertBefore(newElement, hasilTemplate);

  function curPage(page = "") {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function renderData(data) {
    console.log(data);
    var updatedTrTabel = updateTemplate(template, firstKey);
    // console.log(updatedTrTabel)
    var rendered = DOM.render(updatedTrTabel, data, oldElement);
    // console.log(rendered)
    document.getElementById(indexID).innerHTML = rendered;
    const rootElement = document.querySelectorAll(tabelID + " dr");

    let drElements = document.querySelectorAll(tabelID + " dr");
    // Iterasi melalui setiap elemen <dr>
    drElements.forEach((drElement) => {
      // Membuat elemen <span> baru
      let spanElement = document.createElement("tr");
      for (let i = 0; i < drElement.attributes.length; i++) {
        let attr = drElement.attributes[i];
        spanElement.setAttribute(attr.name, attr.value);
      }
      // Menyalin konten HTML dari <dr> ke <span>
      spanElement.innerHTML = drElement.innerHTML;
      drElement.parentNode.replaceChild(spanElement, drElement);
    });

    let dtElements = document.querySelectorAll(tabelID + " tr dt");
    dtElements.forEach((drElement) => {
      // Membuat elemen <span> baru
      let spanElement = document.createElement("td");
      for (let i = 0; i < drElement.attributes.length; i++) {
        let attr = drElement.attributes[i];
        spanElement.setAttribute(attr.name, attr.value);
      }
      // Menyalin konten HTML dari <dr> ke <span>
      spanElement.innerHTML = drElement.innerHTML;
      drElement.parentNode.replaceChild(spanElement, drElement);
    });
  }
  function updateTemplate(template, rowName) {
    // Define the patterns for the current and desired structures
    const currentPattern = new RegExp(
      `<tr id="${rowName}">\\{@${rowName}\\}([\\s\\S]*?)\\{\\/${rowName}\\}<\\/tr>`,
      "g"
    );
    const desiredPattern = `{@${rowName}}<tr id="${rowName}">$1</tr>{/${rowName}}`;

    // Replace the current pattern with the desired pattern
    let updatedTemplate = template.replace(currentPattern, desiredPattern);

    // Further replace <tr> with <dr> and <td> with <dt>
    updatedTemplate = updatedTemplate
      .replace(/<tr/g, "<dr")
      .replace(/<\/tr>/g, "</dr>");
    updatedTemplate = updatedTemplate
      .replace(/<td/g, "<dt")
      .replace(/<\/td>/g, "</dt>");
    return updatedTemplate;
  }

  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
    }
  }

  // Create an array to store attribute names to be removed
  const attributesToRemove = [];
  // Loop through the attributes of the script element
  for (let attr of hasilTemplate.attributes) {
    // Exclude the id and type attributes
    if (attr.name !== "id" && attr.name !== "type" && attr.name !== "ngorei") {
      // Set the attributes to the target element
      newElement.setAttribute(attr.name, attr.value);
      // Add the attribute name to the array for later removal
      attributesToRemove.push(attr.name);
    }
  }
  // Remove the attributes from the script element
  for (let attrName of attributesToRemove) {
    hasilTemplate.removeAttribute(attrName);
  }

  function paginateData(page) {
    var startIndex = (page - 1) * rowPerPage;
    var slicedData = data[rowID].slice(startIndex, startIndex + rowPerPage);
    return { [rowID]: slicedData };
  }

  function updatePaginationUI() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.classList.add("pagination");
        paginationList.innerHTML = "";

        // Previous Button
        var itemprevButton = document.createElement("li");
        itemprevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          itemprevButton.classList.add("disabled");
        }
        itemprevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Previous">Previous</button>';
        paginationList.appendChild(itemprevButton);

        // Previous Button (short)
        var prevButton = document.createElement("li");
        prevButton.classList.add("page-item", "prev");
        if (currentPage === 1) {
          prevButton.classList.add("disabled");
        }
        prevButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage - 1) +
          '" id="Prev">Prev</button>';
        paginationList.appendChild(prevButton);

        // Calculate the range of pages to display
        var startPage = Math.max(currentPage - 2, 1);
        var endPage = Math.min(startPage + 4, totalPages);
        if (endPage - startPage < 4) {
          startPage = Math.max(endPage - 4, 1);
        }

        // Numbered page buttons
        for (var i = startPage; i <= endPage; i++) {
          var pageButton = document.createElement("li");
          pageButton.classList.add("page-item");
          if (i === currentPage) {
            pageButton.classList.add("active");
          }
          pageButton.innerHTML =
            '<button class="page-link" val="' +
            i +
            '" id="page-' +
            i +
            '">' +
            i +
            "</button>";
          paginationList.appendChild(pageButton);
        }

        // Next Button
        var nextButton = document.createElement("li");
        nextButton.classList.add("page-item", "next");
        if (currentPage === totalPages || totalPages === 0) {
          nextButton.classList.add("disabled");
        }
        nextButton.innerHTML =
          '<button class="page-link" val="' +
          (currentPage + 1) +
          '" id="Next">Next</button>';
        paginationList.appendChild(nextButton);

        // Last Button
        var lastButton = document.createElement("li");
        lastButton.classList.add("page-item", "last");
        if (currentPage === totalPages || totalPages === 0) {
          lastButton.classList.add("disabled");
        }
        lastButton.innerHTML =
          '<button class="page-link" val="' +
          totalPages +
          '" id="Last">Last</button>';
        paginationList.appendChild(lastButton);
      }
    } else {
      return false;
    }
  }

  function setupPaginationListeners() {
    if (row.pagination) {
      var paginationList = document.querySelector("#" + row.pagination);
      if (paginationList) {
        paginationList.addEventListener("click", function (event) {
          var targetButton = event.target;

          // Handle click on Previous button
          if (targetButton.id === "Previous" || targetButton.id === "Prev") {
            currentPage = 1; // Reset to page 1

            // Handle click on Next button
          } else if (targetButton.id === "Next") {
            if (currentPage < totalPages) currentPage++;

            // Handle click on Last button
          } else if (targetButton.id === "Last") {
            currentPage = totalPages;

            // Handle click on numbered page buttons
          } else if (targetButton.id.startsWith("page-")) {
            currentPage = parseInt(targetButton.id.split("-")[1]);
          }

          renderData(paginateData(currentPage));
          updatePaginationUI();
        });
        window.orderGrid = function (token, page) {
          // var valueId = event.target.attributes.grid.value
          var statePage = Number(page);
          var storage = localStorage.getItem(token);
          var dbStorage = JSON.parse(storage);
          const decrypted = decryptObject(
            dbStorage.encrypt,
            dbStorage.endpoint
          );
          var red = decrypted.content;
          var startIndex = (1 - 1) * statePage;
          var slicedData = decrypted[red].slice(
            startIndex,
            startIndex + statePage
          );
          var dt = { [red]: slicedData };
          renderData(dt);
          paginateData(1);
          updatePaginationUI();
        };
      }
    } else {
      return false;
    }
  }

  function filterData(keyword) {
    const searchText = keyword.trim().toLowerCase();
    const setfilteredData = originalData[rowID].filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(keyword)
      )
    );
    return setfilteredData;
  }
  // Event listener untuk input pencarian
  if (search) {
    document.getElementById(search).addEventListener("input", function (event) {
      var keyword = event.target.value;
      if (keyword === "") {
        data = { ...originalData }; // Kembalikan data ke data asli jika pencarian kosong
      } else {
        var filteredData = filterData(keyword);
        data[rowID] = filteredData;
      }
      renderData(curPage(1));
    });
  }

  renderData(paginateData(currentPage));
  updatePaginationUI();
  setupPaginationListeners();
}

/**
 * Mengenkripsi objek yang diberikan dengan kunci rahasia menggunakan encoding base64.
 * @param {Object} obj - Objek yang akan dienkripsi.
 * @param {string} secretKey - Kunci rahasia yang akan digunakan untuk enkripsi.
 * @returns {string} - String yang telah dienkripsi.
 */
export function encryptObject(obj, secretKey) {
  try {
    const jsonStr = JSON.stringify(obj);
    const combinedStr = jsonStr + secretKey; // Gabungkan string JSON dengan kunci rahasia
    const encrypted = btoa(combinedStr); // Encode string gabungan ke base64
    return encrypted;
  } catch (error) {
    console.error("Enkripsi gagal:", error);
    return null;
  }
}

/**
 * Mendekripsi string base64 terenkripsi kembali menjadi objek menggunakan kunci rahasia.
 * @param {string} encryptedStr - String yang telah dienkripsi.
 * @param {string} secretKey - Kunci rahasia yang digunakan untuk enkripsi.
 * @returns {Object|null} - Objek yang telah didekripsi atau null jika dekripsi gagal.
 */
export function decryptObject(encryptedStr, secretKey) {
  try {
    const decodedStr = atob(encryptedStr); // Decode string base64
    const jsonStr = decodedStr.replace(secretKey, ""); // Hapus kunci rahasia dari string yang telah didekode
    const decryptedObj = JSON.parse(jsonStr); // Parse string JSON kembali menjadi objek
    decryptedObj[secretKey] = true; // Tambahkan properti untuk menandai objek telah didekripsi
    return decryptedObj;
  } catch (error) {
    // console.error('Dekripsi gagal:', error);
    return null;
  }
}

// Sample Usage
// const sampleObject = {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     age: 30
// };

// const secretKey = "mySecretKey123";

// // Encrypt the object
// const encrypted = encryptObject(sampleObject, secretKey);
// console.log("Encrypted String:", encrypted);

// // Decrypt the string
// if (encrypted) {
//     const decrypted = decryptObject(encrypted, secretKey);
//     console.log("Decrypted Object:", decrypted);
// }

export function enkripsiKey(teks, geser) {
  return teks
    .split("")
    .map((char) => {
      const kodeChar = char.charCodeAt(0);
      const kodeBaru = kodeChar + geser;
      return String.fromCharCode(kodeBaru);
    })
    .join("");
}

export function dekripsiKey(teks, geser) {
  return teks
    .split("")
    .map((char) => {
      const kodeChar = char.charCodeAt(0);
      const kodeBaru = kodeChar - geser;
      return String.fromCharCode(kodeBaru);
    })
    .join("");
}

export function enkripsiURI(teks) {
  return btoa(unescape(encodeURIComponent(teks)));
}

export function dekripsiURI(teks) {
  return decodeURIComponent(escape(atob(teks)));
}

export function transformText(inputText) {
  return inputText.toLowerCase().replace(/\s+/g, "_");
}

export async function loadModuleFromUrl(scriptUrl) {
  const urlWithCacheBuster = `${scriptUrl}?tn=${new Date().getTime()}`;
  try {
    const module = await import(urlWithCacheBuster);
    //console.log('Modul berhasil dimuat', module);
    return module;
  } catch (error) {
    throw error;
  }
}

// Fungsi untuk memuat CSS dari URL
export async function loadCssFromUrl(cssUrl) {
  const urlWithCacheBuster = `${cssUrl}?tn=${new Date().getTime()}`;
  try {
    // Mendapatkan CSS sebagai teks
    const response = await fetch(urlWithCacheBuster);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cssText = await response.text();

    // Membuat elemen <style>
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssText));
    // Menambahkan elemen <style> ke <head> dokumen
    document.head.appendChild(style);

    //console.log('CSS berhasil dimuat dan diterapkan');
  } catch (error) {
    console.error("Error saat memuat CSS:", error);
    throw error;
  }
}

// // Menambahkan event listener ke tombol
// document.getElementById('load-css-btn').addEventListener('click', () => {
//     // Memuat CSS ketika tombol diklik
//     loadCssFromUrl('styles.css');
// });

export const Rtdb = function () {
  let dbName = "ngorei";
  let dbVersion = 1; // Versi database

  function openDb(callback) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      // Buat object store jika belum ada
      if (!db.objectStoreNames.contains("data")) {
        db.createObjectStore("data", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      callback(event.target.result);
    };

    request.onerror = function (event) {
      console.error("Database error:", event.target.errorCode);
    };
  }

  return {
    localStorage: function () {
      return {
        setItem: function (tabel, data) {
          localStorage.setItem(tabel, JSON.stringify(data));
          return data;
        },
        addItem: function (tabel, data) {
          let existingData = JSON.parse(localStorage.getItem(tabel)) || [];
          let idExists = existingData.some((item) => item.id === data.id);
          if (!idExists) {
            existingData.push(data);
            localStorage.setItem(tabel, JSON.stringify(existingData));
          }
        },
        upItem: function (tabel, data) {
          let existingData = JSON.parse(localStorage.getItem(tabel)) || [];
          let index = existingData.findIndex((item) => item.id === data.id);
          if (index !== -1) {
            existingData[index] = { ...existingData[index], ...data };
            localStorage.setItem(tabel, JSON.stringify(existingData));
          } else {
            console.log("Data dengan id tersebut tidak ditemukan.");
          }
        },
        upAllItem: function (tabel, data, fields) {
          let existingData = JSON.parse(localStorage.getItem(tabel)) || [];
          existingData = existingData.map((item) => {
            if (item.id !== data.id) {
              return { ...item, ...fields };
            }
            return item;
          });
          localStorage.setItem(tabel, JSON.stringify(existingData));
        },
        getItem: function (tabel, eter = "") {
          var assets = localStorage.getItem(tabel);
          if (eter) {
            return assets ? JSON.parse(assets) : eter;
          } else {
            return assets ? JSON.parse(assets) : null;
          }
        },
        removeItem: function (tabel, id) {
          let existingData = JSON.parse(localStorage.getItem(tabel)) || [];
          existingData = existingData.filter((item) => item.id !== id);
          localStorage.setItem(tabel, JSON.stringify(existingData));
        },
      };
    },
    indexDB: function (tabel) {
      return {
        openTransaction: function (mode, callback) {
          openDb(function (db) {
            const transaction = db.transaction(tabel, mode);
            const store = transaction.objectStore(tabel);
            callback(store, transaction);
          });
        },
        addItem: function (data, onSuccess, onError) {
          this.openTransaction("readwrite", function (store, transaction) {
            const request = store.add(data);
            request.onsuccess = function () {
              if (onSuccess) onSuccess();
            };
            request.onerror = function () {
              if (onError) onError(request.error);
            };
          });
        },
        upItem: function (data, onSuccess, onError) {
          this.openTransaction("readwrite", function (store, transaction) {
            const request = store.put(data);
            request.onsuccess = function () {
              if (onSuccess) onSuccess();
            };
            request.onerror = function () {
              if (onError) onError(request.error);
            };
          });
        },
        upAllItem: function (data, fields, onSuccess, onError) {
          this.openTransaction("readwrite", function (store, transaction) {
            const request = store.openCursor();
            request.onsuccess = function (event) {
              const cursor = event.target.result;
              if (cursor) {
                if (cursor.value.id !== data.id) {
                  let updatedItem = { ...cursor.value, ...fields };
                  store.put(updatedItem);
                }
                cursor.continue();
              } else {
                if (onSuccess) onSuccess();
              }
            };
            request.onerror = function () {
              if (onError) onError(request.error);
            };
          });
        },
        getItem: function (key, callback) {
          this.openTransaction("readonly", function (store) {
            const request = store.get(key);
            request.onsuccess = function () {
              callback(request.result);
            };
            request.onerror = function () {
              console.error("Gagal mendapatkan data:", request.error);
              callback(null); // Callback dengan null pada error
            };
          });
        },
        removeItem: function (id, onSuccess, onError) {
          this.openTransaction("readwrite", function (store, transaction) {
            const request = store.delete(id);
            request.onsuccess = function () {
              if (onSuccess) onSuccess();
            };
            request.onerror = function () {
              if (onError) onError(request.error);
            };
          });
        },
      };
    },
  };
};
// buatkan cara kerja indexDB seperti localStorage dalam contoh kode
// const rtdb = new Rtdb();
// Data pengguna yang akan ditambahkan
// const newUser = {
//     id: 2,
//     name: 'John Doe',
//     email: 'john.doe@example.com'
// };
// rtdb.indexDB('data').removeItem(2,
//     function() {
//         console.log('Data berhasil dihapus.');
//     },
//     function(error) {
//         console.error('Gagal menghapus data:', error);
//     }
// );
// Tambahkan data pengguna ke IndexedDB
// rtdb.indexDB('data').addItem(newUser,
//     function() {
//         console.log('Data berhasil ditambahkan.');
//     },
//     function(error) {
//         console.error('Gagal menambahkan data:', error);
//     }
// );

// // Ambil data pengguna dari IndexedDB
// const userId = 1;
// rtdb.indexDB('data').getItem(userId, function(data) {
//     if (data) {
//         console.log('Data pengguna:', data);
//     } else {
//         console.log('Data tidak ditemukan.');
//     }
// });

export function components(hostName, navigasi, assets) {
  let mydata2 = [];
  // console.log(navigasi)
  $.ajax({
    url: hostName + "app/helpers/components",
    method: "POST",
    dataType: "json",
    data: JSON.stringify({
      navigasi: navigasi,
      assets: assets,
    }),
    async: false,
    success: function (data) {
      localStorage.setItem("components", JSON.stringify(data));
      var add = JSON.stringify(data, null, 10);
      mydata2 = JSON.parse(add);
    },
  });

  return mydata2;
}

export function manifestStorage(baseURL) {
  let mydata2 = [];
  $.ajax({
    url: baseURL + "app/helpers/manifest",
    method: "POST",
    dataType: "json",
    async: false,
    headers: {
      "Content-Type": "application/json",
    },
    success: function (data) {
      mydata2 = data;
      var encrypted = encryptObject(mydata2, "manifestStorage");
      localStorage.setItem("manifest", JSON.stringify(encrypted));
    },
  });

  return mydata2;
}
export function getHashSegments(url) {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) {
    return []; // Jika tidak ada hash, kembalikan array kosong
  }

  const hash = url.slice(hashIndex + 1);
  const segments = hash.split("/");

  return segments;
}
export function evaluatePasswordStrength(password) {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 1) {
    return "Lemah";
  } else if (strength <= 3) {
    return "Standar";
  } else {
    return "Kuat";
  }
}
export function createSegmentObjects(segments) {
  return segments.map((segment, index) => {
    return {
      id: `page${index}`,
      name: segment,
    };
  });
}
export function findSegmentById(segments, id) {
  return segments.find((segment) => segment.id === id);
}

export function routeSegmentById(url) {
  const segments = getHashSegments(url);
  const segmentObjects = createSegmentObjects(segments);
  return segmentObjects;
}

// const segmentObjects = createSegmentObjects(segments);
// console.log(segments)
// const page =routeSegmentById(url,'page3')
// console.log(page.name); // Output: { id: 'page1', name: "page" }
export const repEl = function (text, Item = "") {
  if (typeof text !== "string" || typeof Item !== "string") {
    // Jika 'text' atau 'Item' bukan string, kembalikan string kosong
    return "";
  }

  // Memeriksa apakah 'Item' ditemukan dalam 'text'
  if (text.includes(Item + ".")) {
    // Memecah string berdasarkan 'Item.'
    var obj = text.split(Item + ".")[1];
    if (obj) {
      // Menghapus karakter kurung kurawal dari 'text'
      var set = text.replace(/[{}]/g, "");
      // Mengembalikan bagian dari string setelah 'Item.'
      return set.split(Item + ".")[1];
    } else {
      return "";
    }
  } else {
    return "";
  }
};
export function replacePlaceholdersInTextNode(textNode, data) {
  var text = textNode.nodeValue;
  data.forEach((item) => {
    var regex = new RegExp(`{${item.id}}`, "g");
    text = text.replace(regex, item.name);
  });
  textNode.nodeValue = text;
}

export function replacePlaceholdersInElement(element, data) {
  //Ganti placeholder dalam teks node
  var walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  var node;
  while ((node = walker.nextNode())) {
    replacePlaceholdersInTextNode(node, data);
  }

  // Ganti placeholder dalam atribut
  var elements = element.querySelectorAll("*");
  elements.forEach((el) => {
    data.forEach((item) => {
      // Ganti placeholder dalam atribut
      Array.from(el.attributes).forEach((attr) => {
        if (attr.value.includes(`{${item.id}}`)) {
          var regex = new RegExp(`{${item.id}}`, "g");
          attr.value = attr.value.replace(regex, item.name);
        }
      });
    });
  });
}

export function createDatasetProxy(initialData, onUpdate) {
  return new Proxy(initialData, {
    set(target, property, value) {
      target[property] = value;
      onUpdate(target);
      return true;
    },
  });
}

export function metaTags(data) {
  // Update title
  // Update meta tags
  document
    .querySelector('meta[name="description"]')
    .setAttribute("content", data.description);
  document
    .querySelector('meta[name="keywords"]')
    .setAttribute("content", data.title);
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", data.title);
  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", data.description);
  document
    .querySelector('meta[property="og:url"]')
    .setAttribute("content", data.url);
  document
    .querySelector('meta[property="og:image"]')
    .setAttribute("content", data.images);
  document
    .querySelector('meta[property="og:site_name"]')
    .setAttribute("content", data.sitename);
  document
    .querySelector('link[rel="shortcut icon"]')
    .setAttribute("href", data.favicon);
  // setSessionCookie('og_title', data.title);
}

/*
     |--------------------------------------------------------------------------
     | Initializes Size Large 
     |--------------------------------------------------------------------------
     | Develover Tatiye.Net 2018
     | @Date 
     */
/**
 * @param array  options the display options .
 * @param mixed  Block to generate a customized inside  content.
 */
export function parseSize(data) {
  // Memecah string berdasarkan tanda 'x'
  var css = data.split("x");

  // Memeriksa apakah ada '%' dalam string
  if (data.includes("%")) {
    // Jika ada '%', hanya tambahkan 'px' pada height
    return {
      height: css[1] ? css[1] + "px" : "auto",
      width: css[0] ? css[0] : "auto",
    };
  } else {
    // Jika tidak ada '%', tambahkan 'px' pada keduanya
    return {
      height: css[1] ? css[1] + "px" : "auto",
      width: css[0] ? css[0] + "px" : "auto",
    };
  }
}
export function parseSizeBackground(attr, filename) {
  var size = parseSize(attr);
  return {
    height: size.height,
    width: size.width,
    display: "inline-block",
    "background-image": "url(" + filename + ")",
    "background-repeat": "no-repeat",
    "background-size": "100% 100%",
  };
}
export function text_shorten(str, length, ending = "") {
  if (length == null) {
    length = 10;
  }
  if (ending == null) {
    ending = "...";
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + "...";
  } else {
    return str;
  }
}

export function saveLinkData() {
  const links = document.querySelectorAll("a");
  const linkData = [];
  let idCounter = 1; // Pencacah untuk ID otomatis

  // Ambil data yang sudah ada di localStorage
  const storedData = localStorage.getItem("navigasi");
  if (storedData) {
    linkData.push(...JSON.parse(storedData));
  }

  links.forEach((link) => {
    // Buat ID otomatis jika elemen tidak memiliki ID
    if (!link.id || link.id.trim() === "") {
      link.id = `${idCounter++}`;
    }

    const id = link.id;
    const url = link.href;
    const title = link.textContent.trim(); // Ambil textContent dari elemen <a> dan trim spasi

    // Cek apakah id tidak kosong, title tidak kosong, dan url bukan hanya "#" atau "#anchor"
    if (
      title !== "" &&
      !(url.endsWith("#") || (url.includes("#") && !url.includes("/")))
    ) {
      // Periksa apakah data dengan id dan url yang sama sudah ada
      const existingData = linkData.find(
        (item) => item.id === id && item.url === url
      );
      if (!existingData) {
        // Jika data dengan id dan url yang sama belum ada, tambahkan ke array
        const newData = {
          id: id,
          title: title,
          url: url,
          target: id,
          timestamp: new Date().toLocaleString(),
        };
        linkData.push(newData);
      }
    }
  });

  localStorage.setItem("navigasi", JSON.stringify(linkData));
  // console.log(window.Ngorei.baseURL)
  $.ajax({
    url: window.Ngorei.baseURL + "app/helpers/sitemap",
    method: "POST", // Metode request (POST atau GET)
    contentType: "application/json",
    data: JSON.stringify(linkData),
    success: function (response) {
      // console.log(response)
      // console.log('Data klik disimpan di history.json:', clickData);
    },
    error: function (error) {
      // console.error('Gagal menyimpan data ke history.json:', error);
    },
  });
}

export function searchLinkData(urlToFind) {
  // Ambil data dari localStorage
  const storedData = localStorage.getItem("navigasi");

  if (storedData) {
    // Parse data dari JSON
    const linkData = JSON.parse(storedData);

    // Cari data dengan URL yang cocok
    const result = linkData.find((item) => item.url === urlToFind);

    // if (result) {
    //     console.log('Link ditemukan:', result);
    // } else {
    //     console.log('Link tidak ditemukan');
    // }

    return result;
  } else {
    console.log("Data tidak ditemukan di localStorage");
    return null;
  }
}

// Fungsi untuk menyimpan data ke localStorage jika id belum ada

export function readmore(text, str) {
  return text_shorten(text, str);
}

export function addcollectFiles(obj, types) {
  let result = [];
  let result2 = [];
  var URL = window.Ngorei.baseURL;
  console.log(window.Ngorei.baseURL);

  function traverse(obj, path = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (
          typeof value === "string" &&
          types.some((type) => value.endsWith(type))
        ) {
          // Modify path to remove specific directories (e.g., `js` or `css`)
          let modifiedPath = path + value;
          let namefied = value.split(".");

          modifiedPath = modifiedPath.replace(/\/(js|css)\//, "/");
          result2.push({
            name: value,
            type: namefied[namefied.length - 1],
            path: modifiedPath,
            url: URL + modifiedPath,
          });
          result.push(modifiedPath);
        } else if (typeof value === "object") {
          traverse(value, path + key + "/");
        }
      }
    }
  }

  traverse(obj);
  // console.log('result2',result2)
  return result;
}
//dbstorage.getItem('components')

export function redfindFile(files, searchTerm) {
  return files.find((file) => file.includes(searchTerm));
}

export function nodeElement(node) {
  const dbstorage = new Rtdb().localStorage();
  var uid = getToken(dbstorage.getItem("oauth"));
  // Skip nodes that have already been processed
  if (node.hasAttribute && node.hasAttribute("data-node")) {
    return;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    // console.log(node)
    // Periksa atribut
    Array.from(node.attributes).forEach(function (attr) {
      if (attr.name === "textmore") {
        node.innerText = readmore(node.innerText, attr.value);
      } else if (attr.name === "import") {
        var myType = attr.value.split(".");
        const dbstorage = new Rtdb().localStorage();
        var assetsComponents = dbstorage.getItem("components");
        const allFiles = addcollectFiles(assetsComponents, [".js", ".css"]);
        console.log(allFiles);

        var URL = window.Ngorei.baseURL;

        var foundFile = URL + redfindFile(allFiles, attr.value);
        // console.log(foundFile)
        if (myType[myType.length - 1] === "js") {
          loadModuleFromUrl(foundFile)
            .then((module) => {
              // Akses fungsi atau variabel dari modul
              if (typeof module.someFunction === "function") {
                module.someFunction();
              }
            })
            .catch((error) => {
              console.error("Gagal memuat modul:", error);
            });
        } else if (myType[myType.length - 1] === "css") {
          loadCssFromUrl(foundFile);
        }
      } else {
      }
    });
    node.childNodes.forEach(nodeElement);
  }
}

export function closeModal() {
  // Fade out and then remove the modal and backdrop
  $(".modal").fadeOut(250, function () {
    $(this).remove();
  });
  $(".modal-backdrop").fadeOut(250, function () {
    $(this).remove();
  });

  // Remove "modal-open" class from body
  $("body").removeClass("modal-open");

  // Set padding-right of body to 0
  $("body").css("padding-right", "0px");
}

// Contoh penggunaan:
// Ganti 'exampleModalID' dengan ID modal Anda

export function setSessionCookie(name, value) {
  // Membuat cookie dengan waktu kedaluwarsa sesi
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; path=/`;
}
export function globalManifest(el) {
  const hosthref = window.location.href;
  const currentProtocol = window.location.protocol;
  if (currentProtocol === "https:") {
    var hostName = hosthref.split("/").splice(0, 6).join("/");
  } else if (currentProtocol === "http:") {
    var hostName = hosthref.split("/").splice(0, 5).join("/");
  } else {
    console.log("Tidak ada protokol.");
  }
  var baseURL = hostName.split("#")[0];
  const dbstorage = new Rtdb().localStorage();
  var dataManifest = dbstorage.getItem("manifest");
  if (dataManifest) {
    var manifest = dataManifest;
  } else {
    var setData = manifestStorage(baseURL);
    var manifest = encryptObject(setData, "manifestStorage");
  }
  var frontend = dbstorage.getItem("frontend");
  return {
    frontend: frontend,
    baseURL: baseURL,
    tokenize: manifest,
  };
}

// export const Library='library';
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.Ngorei = factory()));
})(this, function () {
  "use strict";
  const Ngorei = globalManifest();
  Ngorei.App = function (e) {
    //console.log(e)
    const dbstorage = new Rtdb().localStorage();
    const hosthref = window.location.href;
    const currentProtocol = window.location.protocol;
    if (currentProtocol === "https:") {
      var hostName = hosthref.split("/").splice(0, 6).join("/");
    } else if (currentProtocol === "http:") {
      var hostName = hosthref.split("/").splice(0, 5).join("/");
    } else {
      console.log("Tidak ada protokol.");
    }
    var baseURL = hostName.split("#")[0];
    var baseURLRule = hostName.split("/#")[0] + "/" + e.rewriteRule;

    function filePath(baseURL) {
      let mydata2 = [];
      $.ajax({
        url: baseURL + "app/helpers/path",
        method: "POST",
        dataType: "json",
        data: JSON.stringify({
          filePath: e.filePath,
        }),
        async: false,
        success: function (data) {
          dbstorage.setItem("assets", data);
          // localStorage.setItem('assets', JSON.stringify(data))
          var add = JSON.stringify(data, null, 10);
          mydata2 = JSON.parse(add);
        },
      });
      dbstorage.setItem("frontend", {
        frontend: e.components,
      });

      $.ajax({
        url: baseURL + "app/controllers/sitemap.json", // URL endpoint atau file untuk menyimpan data
        method: "POST", // Metode request (POST atau GET)
        contentType: "application/json",
        dataType: "json",
        async: false,
        success: function (response) {
          dbstorage.setItem("sitemap", response);
          // localStorage.setItem('sitemap', JSON.stringify(response));
        },
      });
      assetsData(baseURL);
      return mydata2;
    }

    var uid = getToken(dbstorage.getItem("oauth"));
    //console.log(uid)
    var dataComponents = dbstorage.getItem("components");
    var dataAsset = dbstorage.getItem("assets");

    //var dataManifest      =dbstorage.getItem('manifest');
    if (dataAsset) {
      var assets = dataAsset;
      var assetsComponents = dataComponents;
      //var manifest=decryptObject(dataManifest,'manifestStorage');
      //console.log('lama')
    } else {
      var assets = filePath(baseURL);
    }

    // var assetsComponents=components(baseURL);
    var templateID = e.indexOn;
    var sitemapID = e.sitemap;
    var contenerID = e.container;
    var contenerNm = e.container.replace("#", "");
    var templateNm = e.indexOn.replace("#", "");
    var existingHostName = dbstorage.getItem("setHostName");
    var existingHostEvent = dbstorage.getItem("event");
    let hashFragment = dbstorage.getItem("sitemap");
    var existing = dbstorage.getItem("existing", e);
    var LinkData = dbstorage.getItem("navigasi");
    var util = dbstorage.getItem("utilities");

    function collectFiles(obj, types) {
      let result = [];
      let result2 = [];

      function traverse(obj, path = "") {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (
              typeof value === "string" &&
              types.some((type) => value.endsWith(type))
            ) {
              // Modify path to remove specific directories (e.g., `js` or `css`)
              let modifiedPath = path + value;
              let namefied = value.split(".");

              modifiedPath = modifiedPath.replace(/\/(js|css)\//, "/");
              result2.push({
                name: value,
                type: namefied[namefied.length - 1],
                path: modifiedPath,
                url: baseURL + modifiedPath,
              });
              result.push(modifiedPath);
            } else if (typeof value === "object") {
              traverse(value, path + key + "/");
            }
          }
        }
      }

      traverse(obj);
      // console.log('result2',result2)
      return result;
    }
    //dbstorage.getItem('components')
    const allFiles = collectFiles(assetsComponents, [".js", ".css"]);
    //console.log(allFiles);
    // Fungsi pencarian menggunakan find
    function findFile(files, searchTerm) {
      return files.find((file) => file.includes(searchTerm));
    }

    // Mencari file "ngorei.dom.js"

    var foundFile = findFile(allFiles, "ordinary.js");
    // console.log("Found file:", allFiles);
    //      console.log(assetsComponents)

    function componentsPath(path) {
      var obj = assetsComponents.public;
      var keys = path.split(".");
      var current = obj;
      var index = null;
      var foundPath = null;
      var relativePath = null;

      // Mencari jalur dan menyimpan nama objek utama
      for (var i = 0; i < keys.length; i++) {
        if (current[keys[i]] !== undefined) {
          if (i === 0) {
            index = keys[i]; // Menyimpan nama objek utama
          }
          current = current[keys[i]];
          if (i === keys.length - 1) {
            // Jika mencapai akhir jalur, buat jalur lengkap
            foundPath = path.split(".").join("/") + ".html";
            // Membuat jalur relatif dengan menghapus bagian awal
            relativePath = path.split(".").slice(1).join("/");
          }
        } else {
          return null; // Kunci tidak ditemukan
        }
      }

      // Membuat objek output
      return {
        index: index,
        name: relativePath,
        path: foundPath,
      };
    }

    // var hasil = componentsPath("fetch.array");
    if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
      // console.log('kedua')
    } else {
      var setHostName = {
        hostName: baseURL,
        protocol: window.location.protocol,
      };
      dbstorage.setItem("setHostName", setHostName);
      filePath(baseURL);
      manifestStorage(baseURL);

      // reloade()
    }

    // console.log(existingHostName)
    if (!existingHostName) {
      var hostName = hosthref;
      var host = hosthref;
    } else {
      var hostName = existingHostName.hostName;
      var host = existingHostName.hostName;
    }

    var slef = this;
    if (e.rewriteRule) {
      var ruleDir = e.rewriteRule + "/";
    } else {
      var ruleDir = "";
    }

    var file = [];
    $.each(assets, function (row, keyc) {
      $.each(keyc, function (rows, keycc) {
        $.each(keycc, function (rowsx, key) {
          var assetPath = {
            [key]: baseURL + "/" + rows + "/" + key,
          };

          file.push(assetPath);
        });
      });
    });

    // Function untuk mencari entri dengan URL tertentu
    function findLinkByURL(url) {
      for (var i = 0; i < hashFragment.length; i++) {
        if (hashFragment[i].url === url) {
          return hashFragment[i];
        }
      }
      return null; // Mengembalikan null jika tidak ditemukan
    }

    function findUrlByAssets(fileName) {
      for (var section in e.assets) {
        var files = e.assets[section];
        for (var i = 0; i < files.length; i++) {
          if (files[i].includes(fileName)) {
            // Tambahkan prefix './assets' jika file ditemukan dalam lib/
            if (files[i].startsWith("lib/")) {
              return baseURL + "assets/" + files[i];
            } else {
              return files[i];
            }
          }
        }
      }
      return "File not found";
    }

    function getFileUrl(filename) {
      var result = file.find((obj) => obj[filename]);
      return result ? result[filename] : "";
    }
    // console.log(getFileUrl('logo.png') )

    // Fungsi untuk mengambil nama folder atau file terakhir
    function getLastfilePath(path) {
      return path.split("/").filter(Boolean).pop();
    }

    // Fungsi untuk mengubah format dataset
    function transformFilePath(item, file = "") {
      var dataset = e.filePath;
      var dataset2 = {};

      for (var key in dataset) {
        if (dataset.hasOwnProperty(key)) {
          dataset[key].forEach((path) => {
            var lastSegment = getLastfilePath(path);
            dataset2[lastSegment] = host + path;
          });
        }
      }
      return dataset2[item] + "/" + file;
    }

    var url = baseURL; // Gantilah baseURL dengan URL dasar yang sesuai
    var loadedAssets = new Set();

    function createAssetElement(assetPath) {
      var fullUrl;
      if (assetPath.startsWith("lib/") || assetPath.startsWith("assets/")) {
        fullUrl = url + assetPath;
      } else {
        fullUrl = assetPath;
      }

      var element;
      if (fullUrl.endsWith(".css")) {
        element = document.createElement("link");
        element.setAttribute("rel", "stylesheet");
        element.setAttribute("href", fullUrl);
      } else if (fullUrl.endsWith(".js")) {
        element = document.createElement("script");
        element.setAttribute("src", fullUrl);
      }
      return element;
    }

    function removeAssets(assets) {
      assets.forEach((assetUrl) => {
        document
          .querySelectorAll(
            `link[href="${assetUrl}"], script[src="${assetUrl}"]`
          )
          .forEach((el) => el.remove());
      });
    }

    function loadAssets() {
      // Aset yang akan dihapus dan dimuat ulang
      var assetsToRemove = e.refAssets;
      // Hapus aset tertentu
      removeAssets(assetsToRemove);
      // Helper function to load asset group
      function loadAssetGroup(assetGroup) {
        if (assetGroup && assetGroup.length > 0) {
          assetGroup.forEach(function (assetPath) {
            var element = createAssetElement(assetPath);
            var assetUrl = element
              ? element.getAttribute("href") || element.getAttribute("src")
              : null;

            if (element && assetUrl && !loadedAssets.has(assetUrl)) {
              if (element.tagName === "LINK") {
                document.head.appendChild(element);
              } else if (element.tagName === "SCRIPT") {
                document.body.appendChild(element);
              }
              loadedAssets.add(assetUrl);
            }
          });
        }
      }
      // Muat asset header dan footer
      if (e && e.assets) {
        loadAssetGroup(e.assets.header);
        loadAssetGroup(e.assets.footer);
      } else {
        console.warn("No assets found in the provided object");
      }

      // Muat ulang aset yang telah dihapus
      if (assetsToRemove) {
        assetsToRemove.forEach((assetPath) => {
          var elementToReload = createAssetElement(assetPath);
          if (elementToReload) {
            if (elementToReload.tagName === "LINK") {
              document.head.appendChild(elementToReload);
            } else if (elementToReload.tagName === "SCRIPT") {
              document.body.appendChild(elementToReload);
            }
            loadedAssets.add(
              elementToReload.getAttribute("href") ||
                elementToReload.getAttribute("src")
            );
          }
        });
      }
    }

    // let ents = []; // This will store registered users
    return {
      utilities: function (ents) {
        dbstorage.setItem("utilities", ents);
        return ents;
        // ents.push(ents); // Add the user to the users array
        // return ents;
      },
      Shortcut: function (e) {
        const ctr = new Shortcut({ enabled: e.enabled });
        const  addKey =[
            "ctrl+r",
            "ctrl+x",
            "ctrl+a",
            "alt+h",
            "ctrl+1",
            "ctrl+2"
            ]
         const newKeys = Object.values(e.component)
             .flat() // Menggabungkan semua array dalam object component menjadi satu array
             .filter(key => key.startsWith('ctrl')); // Memfilter hanya yang dimulai dengan 'ctrl'
         addKey.push(...newKeys);
            function cekKey(keyToFind) {
                for (let value of Object.values(e.component)) {
                    if (value.includes(keyToFind)) {
                        return value;
                    }
                }
                return false;
            }
        ctr.ctrl({
          key: addKey,
          sendCallback: (key) => {
            if (key==="a+ctrl") {
                onLink("#home")
            } else if (key==="alt+h") {
                onLink("#home")
            } else if (key==="1+ctrl") {
                history.back();
            } else if (key==="2+ctrl") {
                history.forward();
            } else if (key==="ctrl+x") {
               closeModal();
            } else if (key==="ctrl+r") {
               onReload()
            } else {
              let redKey=cekKey(key);
              if (redKey) {
                  if (redKey[1]==='modal') {
                      onModal(['Route',redKey[2],redKey[3]]);
                  } else if (redKey[1]==='route') {
                      onLink(redKey[2])
                  }
              } else {
                  // console.log(key);
              }
            }
          },
        });
      },
      Components: function (e) {
        return {
          form: function (el) {
            // console.log(el)
          },
        };
      },
      device: function () {
        var mobileRegex =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        // Menggunakan navigator.userAgent untuk mendapatkan informasi tentang user agent
        var userAgent = navigator.userAgent;
        // Memeriksa apakah userAgent cocok dengan regex perangkat mobile
        if (mobileRegex.test(userAgent)) {
          return "mobile";
        } else {
          return "desktop";
        }
      },
      navigasi: function (page) {
        (async () => {
          if (e.development) {
            components(baseURL, page, e);
            assetsData(baseURL);
            // fetchAndStoreFileList()
          }

          // console.log(e.element.spinner)
          // Style components
          const utilObj = await Utilities(e.components);
          const util = utilObj[e.components]();
          var firstKey = Object.keys(page)[0];
          var rowData = page[firstKey];
          var dataset = page;
          var container = e.container;

          function pageState(data, title, link) {
            //console.log(data)
            history.pushState({ data: data }, title, link);
            // console.log(history)
          }

          window.addEventListener("popstate", function (event) {
            if (event.state) {
              //console.log(event.state.data.ulr)
              workerRoute(event.state.data.ulr);
            }
            if (!event.state) {
              workerRoute(event.target.location.href);
            }
          });

          // Periksa apakah halaman di-reload menggunakan API modern
          if (performance.getEntriesByType("navigation")[0].type === "reload") {
            if (window.location.href.includes("#")) {
              var searchTerm = window.location.href;
              workerRoute(searchTerm);
            } else {
              workerRoute(baseURL + "#home");
            }
            // console.log("di-reload");
          } else {
            if (window.location.href.includes("#")) {
              var searchTerm = window.location.href;
              workerRoute(searchTerm);
            } else {
              workerRoute(baseURL + "#home");
            }
            fetchAndStoreFileList();
            console.log("Halaman ini tidak di-reload");
          }

          function metaDatasetProxy() {
            // Check if the URL contains a hash
            if (window.location.href.includes("#")) {
              var searchTerm = window.location.href;
              var result = findLinkByURL(searchTerm);
              // Check if result is not null and has a title
              if (result && result.title) {
                const DatasetProxy = createDatasetProxy(
                  {
                    sitename: e.sitename,
                    title: result.title,
                    description: e.description,
                    favicon: transformFilePath("logo", e.favicon),
                    images: transformFilePath("logo", e.images),
                    url: window.location.href,
                  },
                  metaTags
                );
                metaTags(DatasetProxy);
              } else {
                // console.error("No valid result found for the search term:", searchTerm);
              }
            } else {
              const DatasetProxy = createDatasetProxy(
                {
                  sitename: e.sitename,
                  title: e.title,
                  description: e.description,
                  favicon: transformFilePath("logo", e.favicon),
                  images: transformFilePath("logo", e.images),
                  url: window.location.href,
                },
                metaTags
              );
              metaTags(DatasetProxy);
            }
          }
 
          window.onhashchange = function () {
            if (window.location.hash === "#account") {
              window.location.reload();
            }
          };
          // thread 1
          function workerRoute(href) {
            // console.log(href)
            localStorage.setItem("event", JSON.stringify(href));
            $.ajax({
              type: "POST",
              url: baseURL + "worker",
              data: "package=" + href,
              beforeSend: function () {
                $(existing.container).html(util.spinner(e.element.spinner));
              },
              success: function (data) {
                // console.log(data)
                $(existing.container).html(data);
                var rootElement = document.querySelector(existing.container);
                routerIndex(rootElement);
                loadAssets();
                if (window.location.hash !== "#account") {
                  metaDatasetProxy();
                  var result = findLinkByURL(href);
                  if (result) {
                    setSessionCookie("og_description", e.description);
                    setSessionCookie("og_title", result.title);
                    setSessionCookie("og_url", href);
                  }
                }

                // render.renderIndex(main)
              },
            });
          }
   
          // thread 2
          function workerOnclick(data) {
            $.ajax({
              type: "POST",
              url: baseURL + "thread",
              data: "package=" + data.url,
              beforeSend: function () {
                $("#" + data.id).html(util.spinner(e.element.spinner.thread));
              },
              success: function (response) {
                $("#" + data.id).html(response);
                var rootElement = document.querySelector("#" + data.id);
                routerIndex(rootElement);
                loadAssets();
                saveLinkData();
              },
            });
          }
          // thread 3
          function workerStatic(data) {
            $.ajax({
              type: "POST",
              url: baseURL + "thread",
              data: "package=" + data.url,
              beforeSend: function () {
                $("#" + data.id).html(util.spinner(e.element.spinner.thread));
              },
              success: function (response) {
                $("#" + data.id).html(response);
                var rootElement = document.querySelector("#" + data.id);
                routerIndex(rootElement);
                loadAssets();
              },
            });
          }

          // thread 3
          function workerThread(href) {
            $.ajax({
              type: "POST",
              url: baseURL + "thread",
              data: "package=" + href,
              beforeSend: function () {
                // $(existing.container).html(util.spinner(e.element.spinner.thread));
              },
              success: function (response) {
                // console.log(data)
                $(existing.container).html(response);
                var rootElement = document.querySelector(existing.container);
                routerIndex(rootElement);
                loadAssets();
              },
            });
          }

          function threadID(main) {
            $.ajax({
              type: "POST",
              url: baseURL + "thread",
              data:
                "package=" +
                main.url +
                "&data=" +
                JSON.stringify(main.data, null, 10),
              beforeSend: function () {
                $("#" + main.id).html(util.spinner(e.element.spinner.thread));
              },
              success: function (response) {
                $("#" + main.id).html(response);
                // var rootElement = document.querySelector("#"+data.id);
                //  routerIndex(rootElement);
                loadAssets();
              },
            });
          }

          /*
      |--------------------------------------------------------------------------
      | Initializes dropdown 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2020
      | @Date 8/3/2024 2:19:30 AM
      */
          window.dropdown = function (button, position, entri) {
            let menuItems;
            if (entri) {
              const Fls = new Dom.Components();
              let data = packageKey(entri[0], e.development);
              menuItems = { action: data.dropdown.action };
            } else {
              menuItems = Pulldown.getMenuItems();
            }

            let dropdownContainer = button.closest(".drdown");
            if (!dropdownContainer) {
              dropdownContainer = document.createElement("div");
              dropdownContainer.className = "drdown";
              button.parentNode.insertBefore(dropdownContainer, button);
              dropdownContainer.appendChild(button);
            }

            let menu = dropdownContainer.querySelector(".drdown-menu");
            if (menu) {
              dropdownContainer.removeChild(menu);
            }
            menu = createDropdownMenu(menuItems, entri);
            dropdownContainer.appendChild(menu);

            toggleDropdown(button, menu, position);

            // Tambahkan event listener untuk mencegah event propagasi
            menu.addEventListener("click", function (event) {
              event.stopPropagation();
            });
          };

          function toggleDropdown(btn, menu, position) {
            const isExpanded = menu.classList.contains("show");
            btn.setAttribute("aria-expanded", !isExpanded);

            if (isExpanded) {
              menu.classList.remove("show");
            } else {
              document.querySelectorAll(".drdown-menu.show").forEach((m) => {
                m.classList.remove("show");
                const toggleBtn = m
                  .closest(".drdown")
                  .querySelector("[aria-expanded]");
                if (toggleBtn) {
                  toggleBtn.setAttribute("aria-expanded", "false");
                }
              });

              menu.classList.add("show");
              positionDropdown(btn, menu, position);

              // Tambahkan event listener untuk menutup dropdown saat mengklik di luar
              setTimeout(() => {
                document.addEventListener("click", closeDropdown);
              }, 0);
            }

            // Fungsi untuk menutup dropdown
            function closeDropdown(event) {
              if (!menu.contains(event.target) && event.target !== btn) {
                menu.classList.remove("show");
                btn.setAttribute("aria-expanded", "false");
                document.removeEventListener("click", closeDropdown);
              }
            }
          }

          function positionDropdown(btn, menu, position) {
            const btnRect = btn.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            menu.style.position = "absolute";
            menu.style.zIndex = "1000";

            // Reset posisi
            menu.style.top = "";
            menu.style.bottom = "";
            menu.style.left = "";
            menu.style.right = "";

            switch (position) {
              case "top":
                menu.style.bottom = "100%";
                menu.style.left = "0";
                break;
              case "bottom":
                menu.style.top = "100%";
                menu.style.left = "0";
                break;
              case "left":
                menu.style.top = "0";
                menu.style.right = "100%";
                break;
              case "right":
                menu.style.top = "0";
                menu.style.left = "100%";
                break;
              case "auto":
              default:
                menu.style.top = "100%";
                menu.style.left = "0";
                break;
            }
            // Periksa batas viewport dan sesuaikan jika perlu
            setTimeout(() => {
              const menuRect = menu.getBoundingClientRect();
              if (menuRect.right > viewportWidth) {
                menu.style.left = "auto";
                menu.style.right = "0";
              }
              if (menuRect.bottom > viewportHeight) {
                menu.style.top = "auto";
                menu.style.bottom = "100%";
              }
            }, 0);
          }

          function createDropdownMenu(items, row) {
            const menu = document.createElement("div");
            menu.className = "drdown-menu";
            menu.setAttribute("role", "menu");

            for (const category in items) {
              const categoryItems = items[category];
              for (const key in categoryItems) {
                const value = categoryItems[key];
                const menuItem = document.createElement("a");
                menuItem.className = "drdown-item";
                menuItem.href = value[2] === "link" ? value[3] : "#";
                menuItem.innerHTML = `<i class="${value[1]}" aria-hidden="true"></i><span>${value[0]}</span>`;
                menuItem.onclick = function (e) {
                  e.preventDefault();
                  if (value[2] === "modal") {
                    if (value[4]) {
                      onModal([value[3], row[2], row[1], value[4]]);
                    } else {
                      onModal([value[3], row[2], row[1]]);
                    }
                  } else if (value[2] === "outside") {
                    if (value[4]) {
                      onPress([value[3], row[1], value[4]]);
                    } else {
                      onPress([value[3], row[1]]);
                    }
                  } else if (value[2] === "link") {
                    onLink(value[3]);
                  } else {
                    console.log("false");
                  }
                  // Menutup dropdown setelah item diklik
                  const dropdownMenu = this.closest(".drdown-menu");
                  if (dropdownMenu) {
                    dropdownMenu.classList.remove("show");
                    const toggleButton = dropdownMenu
                      .closest(".drdown")
                      .querySelector("[aria-expanded]");
                    if (toggleButton) {
                      toggleButton.setAttribute("aria-expanded", "false");
                    }
                  }
                };

                menu.appendChild(menuItem);
              }
            }

            return menu;
          }

          /*
      |--------------------------------------------------------------------------
      | Initializes onModal 
      |--------------------------------------------------------------------------
      | Develover Tatiye.Net 2020
      | @Date 8/3/2024 2:19:30 AM
      */
          window.onModal = function (entri) {
            const elID = Math.random().toString(36).substring(2, 15);
            const Fls = new Dom.Components();
            let data = packageKey(entri[0], e.development);
            var row = data.modal;
            data.modal["elID"] = elID;
            var modalId = elID;
            var title = entri[1] ? entri[1] : row.title;

            if (!document.getElementById(modalId)) {
              const modal = Fls.createModal(
                modalId,
                readmore(title, 15),
                data,
                entri
              );
              Fls.makeModalDraggable(modalId);
            }

            // Periksa apakah jQuery dan modal plugin tersedia
            if (typeof $ === "function" && typeof $.fn.modal === "function") {
              $("#" + modalId).modal({ backdrop: row.backdrop });
            } else {
              console.error("jQuery atau plugin modal tidak tersedia");
              // Implementasi fallback jika modal tidak tersedia
              document.getElementById(modalId).style.display = "block";
            }

            // Gunakan vanilla JavaScript untuk event listener
            document
              .getElementById("modal_close")
              .addEventListener("click", function () {
                closeModal(elID + "From");
              });

            if (row.element) {
              var contentElement = document.getElementById("content" + modalId);
              if (contentElement) {
                var containsPxOrPercent =
                  row.element.sizes.includes("px") ||
                  row.element.sizes.includes("%");
                if (containsPxOrPercent) {
                  contentElement.style.maxWidth = row.element.sizes;
                } else {
                  contentElement.classList.add(row.element.sizes);
                }
                if (row.element.animation) {
                  document
                    .getElementById(modalId)
                    .classList.add(row.element.animation);
                }
              }
            }

            if (data.modal.model === "Route") {
              var page, retData;
              if (entri[2] && entri[2].includes("/")) {
                page = baseURL + "" + entri[2];
                retData = entri[3] ? Fls.storageKey(data.key, entri[3]) : false;
              } else {
                page = baseURL + "" + row.body.public;
                retData = Fls.storageKey(data.key, entri[2]);
              }

              threadID({
                id: "Router" + elID,
                data: retData,
                url: page,
              });
            }

            if (row.backdropColor) {
              var backdropElement = document.querySelector(".modal-backdrop");
              if (backdropElement) {
                backdropElement.style.backgroundColor =
                  "rgba(" + row.backdropColor + ")";
              }
            }

            if (["form", "Oauth", "Drive"].includes(row.model)) {
              data.modal.elementById = elID + "From";
              data.modal.body.elementById = elID + "From";
              if (entri.length !== 4) {
                if (entri.length === 3) {
                  data.modal.body.status = "update";
                  data.modal.body.key = entri[2];
                  data.modal.body.storage = data.key;
                } else {
                  data.modal.body.status = "insert";
                }
                const stgData = {
                  ...data.modal.body,
                  sendCallback: function (formData) {
                    // console.log(formData);
                    if (row.model !== "Drive") {
                      closeModal();
                      workerThread(window.location.href);
                    }
                  },
                };
                if (typeof Fls[data.modal.model] === "function") {
                  Fls[data.modal.model](stgData);
                } else {
                  console.error(
                    `Metode ${data.modal.model} tidak tersedia di objek Fls`
                  );
                }
              }
            }
          };
          /*
           |--------------------------------------------------------------------------
           | Initializes onPress 
           |--------------------------------------------------------------------------
           | Develover Tatiye.Net 2020
           | @Date 8/3/2024 2:19:30 AM
           */
          window.modalClose = function () {
             closeModal();
          };
          window.onReload = function () {
            workerThread(window.location.href);
          };
          window.onLink = function (data) {
            pageState(
              {
                title: data,
                ulr: baseURL + data,
              },
              data,
              baseURL + data
            );
            // console.log(baseURL+data)
            workerRoute(baseURL + data);
          };
          window.onPress = function (entri) {
            const Fls = new Dom.Components();
            let data = packageKey(entri[0]);
            if (entri.length === 1) {
              data.from.status = "insert";
              $("#" + entri[0]).show();
              const stgData = {
                ...data.from,
                sendCallback: function (formData) {
                  $("#" + entri[0]).hide();
                  // console.log(formData);
                  workerThread(window.location.href);
                },
              };

              Fls[data.from.type](stgData);
            }
            if (entri.length === 2) {
              $("#" + entri[0]).show();
              data.from.status = "update";
              data.from.key = entri[1];
              data.from.storage = data.key;

              const stgData = {
                ...data.from,
                sendCallback: function (formData) {
                  $("#" + entri[0]).hide();
                  workerThread(window.location.href);
                  // console.log(formData);
                },
              };
              Fls[data.from.type](stgData);
            }

            if (entri.length === 3) {
              const dls = new Dom.Storage();
              if (data.from.delete) {
                dls.Red({
                  key: entri[1],
                  action: entri[2], // delete|recycle
                  cradensial: data.from.delete,
                });
              }
              $("#" + entri[1]).remove();
              workerThread(window.location.href);
            }
          };

          function ObjectPage(argument = "") {
            var foundValues = [];
            Object.keys(dataset).forEach((section) => {
              Object.keys(dataset[section]).forEach((key) => {
                if (dataset[section][key][4]) {
                  var pramKey = dataset[section][key][4];
                } else {
                  var pramKey = dataset[section][key][1];
                }
                var dasplit = pramKey.split("/").length;
                var dts = {
                  name: key,
                  key: dasplit,
                  value: dataset[section][key],
                };
                // console.log(key)
                if (dataset[section][key][1] === argument) {
                  foundValues.push(dts);
                }
                if (!argument) {
                  foundValues.push(dts);
                }
              });
            });
            return foundValues;
          }
          //console.log(dataset)

          $("a").click(function (evt) {
            evt.preventDefault();
            if (!$(this).attr("onclick")) {
              pageState(
                {
                  title: $(this).text(),
                  ulr: evt.target.attributes.href.value,
                },
                $(this).text(),
                evt.target.attributes.href.value
              );
              workerRoute(evt.target.attributes.href.value);
            }
          });

          function routerIndex(node) {
            // Lewati node yang sudah diproses
            if (node.hasAttribute && node.hasAttribute("data-processed")) {
              return;
            }
            if (node.nodeType === Node.TEXT_NODE) {
              var text = node.nodeValue;
              var matches = text.match(/{(.*?)\.(.*?)}/g); // Cocokkan {kunci.properti}
              if (matches) {
                matches.forEach(function (match) {
                  var matchParts = match.match(/{(.*?)\.(.*?)}/); // Ekstrak kunci dan properti
                  var key = matchParts[1];
                  var property = matchParts[2];
                  if (key === "uid") {
                    if (uid) {
                      text = text.replace(match, uid[property]); // Ganti dengan nilai yang diinginkan
                    } else {
                      text = "";
                    }
                  } else {
                    if (
                      dataset.hasOwnProperty(key) &&
                      dataset[key].hasOwnProperty(property)
                    ) {
                      text = text.replace(match, dataset[key][property][0]); // Ganti dengan nilai yang diinginkan
                    }
                  }
                });
                node.nodeValue = text;
              }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Periksa atribut
              Array.from(node.attributes).forEach(function (attr) {
                if (attr.name === "href") {
                  // Kondisi khusus untuk atribut href
                  if (
                    node.hasAttribute("href") &&
                    node.getAttribute("href") !== ""
                  ) {
                    let href = node.getAttribute("href");
                    switch (href) {
                      case "#":
                      case "javascript:void(0);":
                      case "/":
                      case "false":
                      case "":
                        $(node).attr("onclick", "return false;");
                        break;
                      default:
                        break;
                    }
                  }
                } else if (attr.name === "fs") {
                  $(node).css({ "font-size": attr.value });
                } else if (attr.name === "width") {
                  $(node).css({ width: attr.value });
                } else if (attr.name === "mr") {
                  $(node).css({ "margin-right": attr.value });
                } else if (
                  attr.name === "data-feather" ||
                  attr.name === "feather"
                ) {
                  // console.log(attr.value)
                  $(node).addClass("icon-feather-" + attr.value);
                } else if (attr.name === "switch") {
                  var nmTabel = "switch_" + attr.value;
                  node.setAttribute("id", nmTabel);
                  var linkElement = document.querySelectorAll(
                    "#" + nmTabel + " a"
                  );
                  $.each(linkElement, function (row, key) {
                    $(this).attr("onclick", "return false;");
                    // console.log(key)
                  });
                } else if (attr.name === "page") {
                  var nmTabel = "page_" + attr.value;
                  node.setAttribute("id", nmTabel);
                  var thread = dbstorage.getItem(nmTabel);
                  var linkElement = document.querySelectorAll(
                    "#" + nmTabel + " a"
                  );

                  if (thread) {
                    workerStatic({
                      id: attr.value,
                      url: thread.url,
                    });
                  }
                  if (!thread) {
                    workerStatic({
                      id: attr.value,
                      url: linkElement[0].attributes.href.value,
                    });
                    // console.log(linkElement[0].attributes.href.value)
                  }
                  $.each(linkElement, function (row, key) {
                    $(this).attr("onclick", "return false;");
                    $(this).click(function (e) {
                      // console.log(e.target.attributes.href.value)
                      // const openKey = dekripsiKey(e.target.attributes.id.value,5);
                      // var urlLink=baseURLRule+'/'+openKey;
                      dbstorage.setItem(nmTabel, {
                        id: attr.value,
                        url: e.target.attributes.href.value,
                      });
                      //  saveLinkData();
                      workerOnclick({
                        id: attr.value,
                        url: e.target.attributes.href.value,
                      });
                    });
                  });
                } else if (node.tagName.toLowerCase() === "icon") {
                  if (attr.name === "icon") {
                    var matches = attr.value.match(/{(.*?)\.(.*?)}/g);
                    matches.forEach(function (match) {
                      var set = match.replace(/[{}]/g, "");
                      var filename = getFileUrl(set);
                      attr.value = filename;
                      var size = parseSizeBackground(
                        node.attributes.size.value,
                        filename
                      );
                      $(node).css(size);
                    });

                    // console.log(node.getAttribute('icon'))
                  }
                  if (attr.name === "class") {
                    // var hrefValue = node.getAttribute('class');
                    // var matches = hrefValue.match(/{(.*?)\.(.*?)}/g); // Cocokkan {kunci.properti}
                    // if (matches) {
                    //   matches.forEach(function(match) {
                    //       var matchParts = match.match(/{(.*?)\.(.*?)}/); // Ekstrak kunci dan properti
                    //       var key = matchParts[1];
                    //       var property = matchParts[2];
                    //       if (dataset.hasOwnProperty(key) && dataset[key].hasOwnProperty(property)) {
                    //          // attr.value = attr.value.replace(match, dataset[key][property][2]); // Ganti dengan nilai yang diinginkan
                    //       }
                    //   });
                    // }
                  }

                  // } else if (attr.name === 'dropdown') { // Kondisi khusus untuk components js
                  //  console.log(attr.name)
                } else if (attr.name === "fetch") {
                  // Kondisi khusus untuk components js
                  const HTML = new Dom.html();
                  let data = packageKey(attr.value);
                  node.id = attr.value;
                  // console.log(node.tagName)
                  if (node.tagName === "TABLE") {
                  } else {
                    HTML[data.model](data.fetch)[data.type]();
                  }
                } else if (attr.name === "content") {
                  // Kondisi khusus untuk components js
                  if (node.hasAttribute("key")) {
                    const HTML = new Dom.html();
                    if (node.attributes.expire) {
                      var expire = node.attributes.expire.value;
                    } else {
                      var expire = 60;
                    }
                    if (node.attributes.order) {
                      var order = Number(node.attributes.order.value);
                    } else {
                      var order = 5;
                    }
                    if (node.attributes.where) {
                      var where = node.attributes.where.value;
                    } else {
                      var where = "";
                    }
                    if (node.attributes.limit) {
                      var limit = node.attributes.limit.value;
                    } else {
                      var limit = false;
                    }
                    if (node.attributes.orderby) {
                      var orderby = node.attributes.orderby.value;
                    } else {
                      var orderby = "";
                    }
                    if (node.attributes.action) {
                      var action = node.attributes.action.value;
                    } else {
                      var action = "";
                    }
                    const hasSearch = node.hasAttribute("search");
                    const hasPagination = node.hasAttribute("pagination");
                    // Tentukan status berdasarkan kondisi
                    let type = "ES1"; // Default status
                    if (hasSearch && hasPagination) {
                      type = "ES3";
                    } else if (hasSearch) {
                      type = "ES2";
                    }
                    if (node.attributes.search) {
                      var search = node.attributes.search.value;
                    } else {
                      var search = "";
                    }
                    if (node.attributes.pagination) {
                      var pagination = node.attributes.pagination.value;
                    } else {
                      var pagination = "";
                    }
                    if (node.tagName === "TABLE") {
                      var row = {
                        endpoint: attr.value,
                        elementById: node.attributes.id.value,
                        content: node.attributes.key.value,
                        search: search,
                        action: action,
                        pagination: pagination,
                        order: order,
                        expire: expire,
                        data: {
                          where: where,
                          limit: limit,
                          order: orderby,
                          content: node.attributes.key.value,
                        },
                      };

                      HTML.Tabel(row).Content()[type]();
                    } else {
                      var row = {
                        endpoint: attr.value,
                        elementById: node.attributes.id.value,
                        content: node.attributes.key.value,
                        action: action,
                        search: search,
                        pagination: pagination,
                        order: order,
                        expire: expire,
                        data: {
                          where: where,
                          limit: limit,
                          order: orderby,
                          content: node.attributes.key.value,
                        },
                      };

                      HTML.Content(row)[type]();
                    }
                  }
                } else if (attr.name === "large") {
                  // Kondisi khusus untuk components js
                  if (node.hasAttribute("key")) {
                    if (node.attributes.expire) {
                      var expire = node.attributes.expire.value;
                    } else {
                      var expire = 60;
                    }
                    if (node.attributes.order) {
                      var order = Number(node.attributes.order.value);
                    } else {
                      var order = 5;
                    }
                    if (node.attributes.where) {
                      var where = node.attributes.where.value;
                    } else {
                      var where = "";
                    }
                    if (node.attributes.limit) {
                      var limit = node.attributes.limit.value;
                    } else {
                      var limit = "";
                    }
                    if (node.attributes.orderby) {
                      var orderby = node.attributes.orderby.value;
                    } else {
                      var orderby = "";
                    }

                    if (node.attributes.search) {
                      var search = node.attributes.search.value;
                    } else {
                      var search = "";
                    }
                    if (node.attributes.pagination) {
                      var pagination = node.attributes.pagination.value;
                    } else {
                      var pagination = "";
                    }

                    if (node.attributes.action) {
                      var action = node.attributes.action.value;
                    } else {
                      var action = "";
                    }

                    const hasSearch = node.hasAttribute("search");
                    const hasPagination = node.hasAttribute("pagination");
                    // Tentukan status berdasarkan kondisi
                    let type = "ES1"; // Default status
                    if (hasSearch && hasPagination) {
                      type = "ES3";
                    } else if (hasSearch) {
                      type = "ES2";
                    }

                    const HTML = new Dom.html();
                    if (node.tagName === "TABLE") {
                      var row = {
                        endpoint: attr.value,
                        elementById: node.attributes.id.value,
                        content: node.attributes.key.value,
                        search: search,
                        action: action,
                        pagination: pagination,
                        order: order,
                        expire: expire,
                        data: {
                          where: where,
                          limit: limit,
                          order: orderby,
                          content: node.attributes.key.value,
                        },
                      };
                      HTML.Tabel(row).Large()[type]();
                    } else {
                      var row = {
                        endpoint: attr.value,
                        elementById: node.attributes.id.value,
                        content: node.attributes.key.value,
                        search: search,
                        action: action,
                        pagination: pagination,
                        order: order,
                        expire: expire,
                        data: {
                          where: where,
                          limit: limit,
                          order: orderby,
                          content: node.attributes.key.value,
                        },
                      };
                      HTML.Large(row)[type]();
                    }
                  }
                } else if (attr.name === "import") {
                  // Kondisi khusus untuk components js
                  var myType = attr.value.split(".");
                  var foundFile = baseURL + findFile(allFiles, attr.value);
                  // console.log(foundFile);
                  if (myType[myType.length - 1] === "js") {
                    loadModuleFromUrl(foundFile)
                      .then((module) => {
                        // Akses fungsi atau variabel dari modul
                        if (typeof module.someFunction === "function") {
                          module.someFunction();
                        }
                      })
                      .catch((error) => {
                        // console.log(
                        //   "Modul " + attr.value + " tidak ditemukan "
                        // );
                      });
                  } else {
                    loadCssFromUrl(foundFile);
                  }
                } else if (attr.name === "textmore") {
                  // Kondisi khusus untuk textMore
                } else if (attr.name === "datepicker") {
                  // Kondisi khusus untuk textMore
                  $(node).datepicker({
                    dateFormat: attr.value,
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeMonth: true,
                    changeYear: true,
                  });
                } else if (attr.name === "scrollbar") {
                  // Kondisi khusus untuk size
                  // overflow:auto
                  $(node).css({ overflow: "auto" });
                  const Tds = new Dom.Components();
                  Tds.Scrollbar({
                    elementById: node.attributes.id.value,
                    maxHeight: attr.value,
                    type: "both", //both|Y|X
                  });
                } else if (attr.name === "size") {
                  // Kondisi khusus untuk size
                  var size = parseSize(attr.value);
                  $(node).css(size);
                } else if (attr.name === "src") {
                  // Kondisi khusus untuk atribut href
                  var matches = attr.value.match(/{(.*?)\.(.*?)}/g); // Cocokkan {kunci.properti}
                  if (matches) {
                    //console.log(matches)
                    matches.forEach(function (match) {
                      var matchParts = match.match(/{(.*?)\.(.*?)}/); // Ekstrak kunci dan properti
                      var uidKey = matchParts[1];
                      var key = matchParts[1] + "." + matchParts[2];
                      var property = matchParts[2];
                      if (uidKey === "uid") {
                        if (uid) {
                          attr.value = attr.value.replace(match, uid[property]);
                        } else {
                          attr.value = "";
                        }
                      } else {
                        var filename = key;
                        var filename = getFileUrl(key);
                        if (filename) {
                          attr.value = attr.value.replace(match, filename); // Ganti dengan nilai yang diinginkan
                        }
                      }
                    });
                  }
                } else {
                  // console.log(attr.value)

                  var matches = attr.value.match(/{(.*?)\.(.*?)}/g); // Cocokkan {kunci.properti}
                  // console.log(attr)
                  if (matches) {
                    matches.forEach(function (match) {
                      var matchParts = match.match(/{(.*?)\.(.*?)}/); // Ekstrak kunci dan properti
                      var key = matchParts[1];
                      var property = matchParts[2];
                      if (
                        dataset.hasOwnProperty(key) &&
                        dataset[key].hasOwnProperty(property)
                      ) {
                        attr.value = attr.value.replace(
                          match,
                          dataset[key][property][0]
                        ); // Ganti dengan nilai yang diinginkan
                      }
                    });
                  }
                }

                const routeSegmentID = routeSegmentById(window.location.href);
                replacePlaceholdersInElement(
                  document.getElementById(contenerNm),
                  routeSegmentID
                );
              });

              node.childNodes.forEach(routerIndex);
            }
            //saveLinkData();
            // feather.replace()
            //loadAssets()
          }
          saveLinkData();
          var clipboard = new Clipboard("#copy");
          clipboard.on("success", function (e) {
            console.log(e.text);
            localStorage.setItem("clipboard", JSON.stringify(e.text));
            $(e.trigger).css("color", "#FF5722");
          });
          clipboard.on("error", function (e) {
            $(e.trigger).css("color", "#F7DF1E");
          });
          var rootElement = document.querySelector(templateID);
          routerIndex(rootElement);
          // AND Style components
        })();
        // return page;
      },
      // BATAS Router
    };
  };
  // Return objek pustaka untuk digunakan oleh lingkungan lain
  return Ngorei;
});

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory())
    : typeof define === "function" && define.amd
    ? define(factory)
    : ((global = global || self), (global.DOM = factory()));
})(this, function () {
  "use strict";

  var objectToString = Object.prototype.toString;
  var isArray =
    Array.isArray ||
    function isArrayPolyfill(object) {
      return objectToString.call(object) === "[object Array]";
    };
  function isFunction(object) {
    return typeof object === "function";
  }
  /**
   * Jenis array penanganan string yang lebih tepat
   * yang biasanya mengembalikan typeof 'objek'
   */
  function typeStr(obj) {
    return isArray(obj) ? "array" : typeof obj;
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  function hasProperty(obj, propName) {
    return obj != null && typeof obj === "object" && propName in obj;
  }

  /**
   * Cara aman untuk mendeteksi apakah suatu benda primitif dan tidak
   * apakah ia memiliki properti yang diberikan
   */
  function primitiveHasOwnProperty(primitive, propName) {
    return (
      primitive != null &&
      typeof primitive !== "object" &&
      primitive.hasOwnProperty &&
      primitive.hasOwnProperty(propName)
    );
  }

  var regExpTest = RegExp.prototype.test;
  function testRegExp(re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }
  var attr = [];
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  function es6Html(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap(s) {
      return entityMap[s];
    });
  }
  var indexContent = "";
  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /@|\^|\/|>|\{|&|=|!/;
  function domTemplate(template, tags) {
    if (!template) return [];
    var lineHasNonSpace = false;
    var sections = []; // Tumpuk untuk menyimpan token bagian
    var tokens = []; // Buffer untuk menyimpan token
    var spaces = []; // Indeks token spasi pada baris saat ini
    var hasTag = false; // Apakah ada {{tag}} pada baris saat ini?
    var nonSpace = false; // Apakah ada karakter non-spasi di baris saat ini?
    var indentation = ""; // Melacak lekukan untuk tag yang menggunakannya
    var tagIndex = 0; // Menyimpan hitungan jumlah tag yang ditemui dalam satu baris

    // Menghapus semua array token spasi untuk baris saat ini
    // jika ada {{#tag}} di atasnya dan sebaliknya hanya spasi.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length) delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tagsToCompile) {
      if (typeof tagsToCompile === "string")
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error("Invalid tags: " + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + "\\s*");
      closingTagRe = new RegExp("\\s*" + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp(
        "\\s*" + escapeRegExp("}" + tagsToCompile[1])
      );
    }

    compileTags(tags || TdsDom.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
            indentation += chr;
          } else {
            nonSpace = true;
            lineHasNonSpace = true;
            indentation += " ";
          }

          tokens.push(["element", chr, start, start + 1]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === "\n") {
            stripSpace();
            indentation = "";
            tagIndex = 0;
            lineHasNonSpace = false;
          }
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe)) break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || "row";
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === "=") {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === "{") {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = "&";
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error("Unclosed tag at " + scanner.pos);

      if (type == ">") {
        token = [
          type,
          value,
          start,
          scanner.pos,
          indentation,
          tagIndex,
          lineHasNonSpace,
        ];
        // console.log(token)
      } else {
        token = [type, value, start, scanner.pos];
      }
      tagIndex++;
      tokens.push(token);

      if (type === "@" || type === "^") {
        sections.push(token);
      } else if (type === "/") {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error(
            'Unclosed section "' + openSection[1] + '" at ' + start
          );
      } else if (type === "row" || type === "{" || type === "&") {
        nonSpace = true;
      } else if (type === "=") {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    stripSpace();

    // Pastikan tidak ada bagian yang terbuka setelah kita selesai.
    openSection = sections.pop();

    if (openSection)
      throw new Error(
        'Unclosed section "' + openSection[1] + '" at ' + scanner.pos
      );

    return nestTokens(squashTokens(tokens));
  }
  /**
   * Menggabungkan nilai token teks berurutan dalam larik `tokens` yang diberikan
   * ke satu token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === "element" && lastToken && lastToken[0] === "element") {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }
    return squashedTokens;
  }
  /**
   * Membentuk larik `token` tertentu ke dalam struktur pohon bersarang di mana
   * token yang mewakili suatu bagian memiliki dua item tambahan: 1) array
   * semua token yang muncul di bagian itu dan 2) indeks aslinya
   * template yang mewakili akhir bagian itu.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];
      switch (token[0]) {
        // console.log(token[0])
        case "@":
        case "^":
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case "/":
          section = sections.pop();
          section[5] = token[2];
          collector =
            sections.length > 0
              ? sections[sections.length - 1][4]
              : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }
    // console.log(nestedTokens)

    return nestedTokens;
  }

  /**
   * Pemindai string sederhana yang digunakan oleh parser template untuk menemukannya
   * token dalam string templat.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos() {
    return this.tail === "";
  };

  /**
   * Mencoba mencocokkan ekspresi reguler yang diberikan pada posisi saat ini.
   * Mengembalikan teks yang cocok jika cocok, sebaliknya string kosong.
   */
  Scanner.prototype.scan = function scan(re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0) return "";

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Melewati semua teks hingga ekspresi reguler yang diberikan dapat dicocokkan. Kembali
   * senar yang dilewati, yaitu seluruh ekor jika tidak dapat dibuat kecocokan.
   */
  Scanner.prototype.scanUntil = function scanUntil(re) {
    var index = this.tail.search(re),
      match;
    switch (index) {
      case -1:
        match = this.tail;
        this.tail = "";
        break;
      case 0:
        match = "";
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Mewakili konteks rendering dengan membungkus objek tampilan dan
   * mempertahankan referensi ke konteks induk.
   */
  function Context(view, parentContext) {
    this.view = view;
    this.cache = { ".": this.view };
    this.parent = parentContext;
  }

  /**
   * Membuat konteks baru menggunakan tampilan yang diberikan dengan konteks ini
   * sebagai orang tua.
   */
  Context.prototype.push = function push(view) {
    return new Context(view, this);
  };

  /**
   * Mengembalikan nilai nama yang diberikan dalam konteks ini, melintasi
   * naikkan hierarki konteks jika nilainya tidak ada dalam tampilan konteks ini.
   */
  Context.prototype.lookup = function lookup(name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this,
        intermediateValue,
        names,
        index,
        lookupHit = false;

      while (context) {
        if (name.indexOf(".") > 0) {
          intermediateValue = context.view;
          names = name.split(".");
          index = 0;
          while (intermediateValue != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit =
                hasProperty(intermediateValue, names[index]) ||
                primitiveHasOwnProperty(intermediateValue, names[index]);

            intermediateValue = intermediateValue[names[index++]];
          }
        } else {
          intermediateValue = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit) {
          value = intermediateValue;
          break;
        }

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value)) value = value.call(this.view);

    return value;
  };

  /**
   * Seorang Penulis mengetahui cara mengambil aliran token dan merendernya ke a
   * string, diberi konteks. Itu juga memelihara cache templat untuk
   * menghindari kebutuhan untuk mengurai template yang sama dua kali.
   */
  function Writer() {
    this.templateCache = {
      _cache: {},
      set: function set(key, value) {
        this._cache[key] = value;
      },
      get: function get(key) {
        return this._cache[key];
      },
      clear: function clear() {
        this._cache = {};
      },
    };
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache() {
    if (typeof this.templateCache !== "undefined") {
      this.templateCache.clear();
    }
  };
  Writer.prototype.parse = function parse(template, tags) {
    var cache = this.templateCache;
    var cacheKey = template + ":" + (tags || TdsDom.tags).join(":");
    var isCacheEnabled = typeof cache !== "undefined";
    var tokens = isCacheEnabled ? cache.get(cacheKey) : undefined;

    if (tokens == undefined) {
      tokens = domTemplate(template, tags);
      isCacheEnabled && cache.set(cacheKey, tokens);
    }
    return tokens;
  };

  Writer.prototype.render = function render(template, view, attrs, config) {
    var tags = this.setTags(config);
    var tokens = this.parse(template, tags);
    var context = view instanceof Context ? view : new Context(view, undefined);

    return this.renderDom(tokens, context, attrs, template, config);
  };

  Writer.prototype.renderDom = function renderDom(
    tokens,
    context,
    attrs,
    originalTemplate,
    config
  ) {
    var buffer = "";
    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];
      if (symbol === "@")
        value = this.renderSection(
          token,
          context,
          attrs,
          originalTemplate,
          config
        );
      else if (symbol === "^")
        value = this.renderInverted(
          token,
          context,
          attrs,
          originalTemplate,
          config
        );
      else if (symbol === ">")
        value = this.renderPartial(token, context, attrs, config);
      else if (symbol === "&") value = this.unelValue(token, context);
      else if (symbol === "row")
        value = this.elValue(token, context, config, attrs);
      else if (symbol === "element") value = this.rawValue(token);

      if (value !== undefined) buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection(
    token,
    context,
    attrs,
    originalTemplate,
    config
  ) {
    var self = this;
    var buffer = "";
    var value = context.lookup(token[1]);
    function subRender(template) {
      return self.render(template, context, attrs, config);
    }
    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderDom(
          token[4],
          context.push(value[j]),
          attrs,
          originalTemplate,
          config
        );
      }
    } else if (
      typeof value === "object" ||
      typeof value === "string" ||
      typeof value === "number"
    ) {
      buffer += this.renderDom(
        token[4],
        context.push(value),
        attrs,
        originalTemplate,
        config
      );
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== "string")
        throw new Error(
          "Tidak dapat menggunakan bagian tingkat tinggi tanpa templat asli"
        );
      value = value.call(
        context.view,
        originalTemplate.slice(token[3], token[5]),
        subRender
      );

      if (value != null) buffer += value;
    } else {
      buffer += this.renderDom(
        token[4],
        context,
        attrs,
        originalTemplate,
        config
      );
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted(
    token,
    context,
    attrs,
    originalTemplate,
    config
  ) {
    var value = context.lookup(token[1]);
    if (!value || (isArray(value) && value.length === 0))
      return this.renderDom(token[4], context, attrs, originalTemplate, config);
  };

  Writer.prototype.indentPartial = function indentPartial(
    partial,
    indentation,
    lineHasNonSpace
  ) {
    var filteredIndentation = indentation.replace(/[^ \t]/g, "");
    var partialByNl = partial.split("\n");
    for (var i = 0; i < partialByNl.length; i++) {
      if (partialByNl[i].length && (i > 0 || !lineHasNonSpace)) {
        partialByNl[i] = filteredIndentation + partialByNl[i];
      }
    }
    return partialByNl.join("\n");
  };

  Writer.prototype.renderPartial = function renderPartial(
    token,
    context,
    attrs,
    config
  ) {
    if (!attrs) return;
    var tags = this.setTags(config);

    var value = isFunction(attrs) ? attrs(token[1]) : attrs[token[1]];
    if (value != null) {
      var lineHasNonSpace = token[6];
      var tagIndex = token[5];

      var indentation = token[4];
      var indentedValue = value;
      if (tagIndex == 0 && indentation) {
        indentedValue = this.indentPartial(value, indentation, lineHasNonSpace);
      }
      var tokens = this.parse(indentedValue, tags);
      return this.renderDom(tokens, context, attrs, indentedValue, config);
    }
  };

  Writer.prototype.unelValue = function unelValue(token, context) {
    var value = context.lookup(token[1]);
    if (value != null) return value;
  };

  Writer.prototype.elValue = function elValue(token, context, config, attr) {
    var escape = this.getConfigRdn(config) || TdsDom.escape;
    var props = token[1].split(".");
    // if (props[0]==attr.attributes.content.value) {
    if (props[0]) {
      var value = context.lookup(props[1]);
    } else {
      var value = token[1];
    }
    if (value != null)
      return typeof value === "number" && escape === TdsDom.escape
        ? String(value)
        : escape(value);
  };

  Writer.prototype.rawValue = function rawValue(token) {
    return token[1];
  };

  Writer.prototype.setTags = function setTags(config) {
    if (isArray(config)) {
      return config;
    } else if (config && typeof config === "object") {
      return config.tags;
    } else {
      return undefined;
    }
  };

  Writer.prototype.getConfigRdn = function getConfigRdn(config) {
    if (config && typeof config === "object" && !isArray(config)) {
      return config.escape;
    } else {
      return undefined;
    }
  };
  // console.log(getConfigRdn)
  var TdsDom = {
    name: "Ngorei",
    version: "v1.0.4",
    tags: ["{", "}"],
    clearCache: undefined,
    escape: undefined,
    parse: undefined,
    render: undefined,
    Scanner: undefined,
    Context: undefined,
    Writer: undefined,
    /**
     * Mendapatkan objek caching default atau yang diganti dari penulis default.
     */
    set templateCache(cache) {
      defaultWriter.templateCache = cache;
    },
    /**
     * Gets the default or overridden caching object from the default writer.
     */
    get templateCache() {
      return defaultWriter.templateCache;
    },
  };

  // Semua fungsi TdsDom.* tingkat tinggi menggunakan penulis ini.
  var defaultWriter = new Writer();
  /**
   * Menghapus semua templat yang di-cache di penulis default.
   */
  TdsDom.clearCache = function clearCache() {
    return defaultWriter.clearCache();
  };

  /**
   * Parsing dan cache template yang diberikan di penulis default dan kembalikan
   * array token yang dikandungnya. Melakukan hal ini sebelumnya akan menghindari kebutuhan untuk melakukannya
   * mengurai templat dengan cepat saat dirender.
   */
  TdsDom.parse = function parse(template, tags) {
    return defaultWriter.parse(template, tags);
  };
  TdsDom.render = function render(template, view, attrs, config) {
    //var natKey='row';
    //var natKey=attrs.attributes.content.value;
    //var dev = document.getElementById(natKey);
    //var localName=dev.localName;
    //var localName='div';
    if (typeof template !== "string") {
      throw new TypeError(
        'Templat tidak valid! Templat harus berupa "string" '
      );
    }
    // var newTemplate = template.replace('<'+localName+' id="'+natKey+'">', '{@'+natKey+'}');
    // newTemplate = newTemplate.replace('</'+localName+'>', '{/'+natKey+'}');
    return defaultWriter.render(template, view, attrs, config);
  };
  TdsDom.escape = es6Html;
  TdsDom.Scanner = Scanner;
  TdsDom.Context = Context;
  TdsDom.Writer = Writer;
  return TdsDom;
});
/*
|--------------------------------------------------------------------------
| Initializes TabelAdvanced 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node.js
    module.exports = factory();
  } else {
    // Browser
    root.TabelAdvanced = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  //         elementById: "tabelDinamis",
  // search      :"searchInput",
  // pagination  :"paginasi",
  function TabelAdvanced() {
    this.data = null;
    this.originalData = null;
    this.perPage = 2;
    this.currentPage = 1;
    this.sortDirection = {};

    this.init = function (config) {
      this.data = config;
      this.originalData = { ...config };
      this.buatTabel();
      this.setupPencarian();
      this.buatTombolEkspor();
    };

    // this.data.pagination
    this.buatTabel = function () {
      console.log(this.data.elementById);
      const container = document.getElementById(this.data.elementById);
      container.innerHTML = "";
      const table = document.createElement("table");
      table.className = "table " + this.data.tableClass;
      table.cellPadding = "2";
      table.cellSpacing = "2";
      table.style.tableLayout = "fixed";
      table.style.width = "100%";
      // Buat header tabel
      const thead = document.createElement("thead");
      const headerRow1 = document.createElement("tr");
      const headerRow2 = document.createElement("tr");

      this.data.headerRow.forEach((header) => {
        const th = document.createElement("th");
        th.innerHTML = header.title;
        th.colSpan = header.colspan;
        th.rowSpan = header.rowspan;
        th.style.verticalAlign = "middle";
        th.style.textAlign = header.align;
        th.style.width = header.width;

        if (header.field !== "gender") {
          th.classList.add("sortable");
          th.onclick = () => this.urutkanTabel(header.field);

          const sortIcon = document.createElement("i");
          sortIcon.className = "sort-icon fa fa-sort";
          th.appendChild(sortIcon);
        }

        headerRow1.appendChild(th);

        if (header.colspan > 1) {
          const subColumns = this.data.columns.slice(
            this.data.headerRow.findIndex((h) => h.field === header.field),
            this.data.headerRow.findIndex((h) => h.field === header.field) +
              header.colspan
          );
          subColumns.forEach((column) => {
            const subTh = document.createElement("th");
            subTh.textContent = column.title;
            subTh.style.verticalAlign = "top";
            subTh.style.textAlign = column.align;
            subTh.classList.add("sortable");
            subTh.onclick = () => this.urutkanTabel(column.field);
            subTh.style.width = column.width;

            const sortIcon = document.createElement("i");
            sortIcon.className = "sort-icon fa fa-sort";
            subTh.appendChild(sortIcon);

            headerRow2.appendChild(subTh);
          });
        }
      });

      thead.appendChild(headerRow1);
      thead.appendChild(headerRow2);
      table.appendChild(thead);

      // Buat body tabel
      const tbody = document.createElement("tbody");
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      const visibleData = this.data.data.slice(startIndex, endIndex);

      visibleData.forEach((rowData) => {
        const row = document.createElement("tr");
        this.data.columns.forEach((column) => {
          const td = document.createElement("td");
          td.textContent = rowData[column.field];
          td.style.verticalAlign = "top";
          td.style.textAlign = column.align;
          td.style.width = column.width;
          row.appendChild(td);
        });
        tbody.appendChild(row);
      });
      table.appendChild(tbody);

      container.appendChild(table);
      this.buatPaginasi();
      this.updateSortIcons();
    };

    this.urutkanTabel = function (columnField) {
      const direction = this.sortDirection[columnField] || "asc";
      const multiplier = direction === "asc" ? 1 : -1;

      this.data.data.sort((a, b) => {
        if (a[columnField] < b[columnField]) return -1 * multiplier;
        if (a[columnField] > b[columnField]) return 1 * multiplier;
        return 0;
      });

      this.sortDirection[columnField] = direction === "asc" ? "desc" : "asc";
      this.buatTabel();
    };

    this.updateSortIcons = function () {
      const headers = document.querySelectorAll(".sortable");
      headers.forEach((header) => {
        const icon = header.querySelector(".sort-icon");
        const field = header.textContent.trim().toLowerCase();
        if (this.sortDirection[field] === "asc") {
          icon.className = "sort-icon fa fa-angle-up";
        } else if (this.sortDirection[field] === "desc") {
          icon.className = "sort-icon fa fa-angle-down";
        } else {
          icon.className = "sort-icon fa fa-sort";
        }
      });
    };

    this.buatPaginasi = function () {
      const container = document.getElementById(this.data.pagination);
      container.innerHTML = "";
      const totalPages = Math.ceil(this.data.data.length / this.perPage);

      const ul = document.createElement("ul");
      ul.className = "pagination";
      // Tombol Previous
      const prevLi = document.createElement("li");
      prevLi.className = `page-item ${
        this.currentPage === 1 ? "disabled" : ""
      }`;
      const prevLink = document.createElement("a");
      prevLink.className = "page-link";
      prevLink.href = "#";
      prevLink.textContent = "Previous";
      prevLink.onclick = (e) => {
        e.preventDefault();
        if (this.currentPage > 1) {
          this.currentPage--;
          this.buatTabel();
        }
      };
      prevLi.appendChild(prevLink);
      ul.appendChild(prevLi);

      // Tombol halaman
      for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === this.currentPage ? "active" : ""}`;
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = i;
        a.onclick = (e) => {
          e.preventDefault();
          this.currentPage = i;
          this.buatTabel();
        };
        li.appendChild(a);
        ul.appendChild(li);
      }

      // Tombol Next
      const nextLi = document.createElement("li");
      nextLi.className = `page-item ${
        this.currentPage === totalPages ? "disabled" : ""
      }`;
      const nextLink = document.createElement("a");
      nextLink.className = "page-link";
      nextLink.href = "#";
      nextLink.textContent = "Next";
      nextLink.onclick = (e) => {
        e.preventDefault();
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.buatTabel();
        }
      };
      nextLi.appendChild(nextLink);
      ul.appendChild(nextLi);

      container.appendChild(ul);
    };

    this.setupPencarian = function () {
      const searchInput = document.getElementById(this.data.search);
      searchInput.addEventListener("input", () => {
        this.filterData(searchInput.value);
      });
    };

    this.filterData = function (searchText) {
      searchText = searchText.toLowerCase();
      this.data.data = this.originalData.data.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(searchText)
        )
      );
      this.currentPage = 1;
      this.buatTabel();
    };

    this.buatTombolEkspor = function () {
      const container = document.getElementById("exportButtons");
      const buttons = [
        { text: "XLSX", class: "btn btn-xs btn-success", action: "eksporXLSX" },
        { text: "PDF", class: "btn btn-xs btn-danger", action: "eksporPDF" },
        { text: "CSV", class: "btn btn-xs btn-info", action: "eksporCSV" },
        { text: "JSON", class: "btn btn-xs btn-warning", action: "eksporJSON" },
      ];

      buttons.forEach((button) => {
        const btn = document.createElement("button");
        btn.textContent = button.text;
        btn.className = `btn ${button.class} mr-1`;
        btn.onclick = () => this[button.action]();
        container.appendChild(btn);
      });
    };

    this.eksporXLSX = function () {
      const ws = XLSX.utils.json_to_sheet(this.data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${this.data.file}.xlsx`);
    };

    this.eksporPDF = function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text(this.data.title, 14, 16);
      doc.autoTable({
        startY: 20,
        head: [this.data.columns.map((col) => col.title)],
        body: this.data.data.map((row) =>
          this.data.columns.map((col) => row[col.field])
        ),
      });
      doc.save(`${this.data.file}.pdf`);
    };

    this.eksporCSV = function () {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        this.data.columns.map((col) => col.title).join(",") +
        "\n" +
        this.data.data
          .map((row) =>
            this.data.columns.map((col) => row[col.field]).join(",")
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${this.data.file}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    this.eksporJSON = function () {
      const jsonContent = JSON.stringify(this.data.data, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${this.data.file}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  }
  return TabelAdvanced;
});

/*
|--------------------------------------------------------------------------
| Initializes Pulldown 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.Pulldown = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  let globalMenuItems = [];

  function init(menuItems) {
    globalMenuItems = menuItems;
    setupGlobalClickHandler();
  }

  function getMenuItems() {
    return globalMenuItems;
  }

  function setupGlobalClickHandler() {
    document.addEventListener("click", function (event) {
      const dropdowns = document.querySelectorAll(".drdown-menu.show");
      dropdowns.forEach((menu) => {
        const dropdownContainer = menu.closest(".drdown");
        if (dropdownContainer && !dropdownContainer.contains(event.target)) {
          menu.classList.remove("show");
          const toggleButton =
            dropdownContainer.querySelector("[aria-expanded]");
          if (toggleButton) {
            toggleButton.setAttribute("aria-expanded", "false");
          }
        }
      });
    });
  }

  return {
    init: init,
    getMenuItems: getMenuItems,
  };
});
/*
|--------------------------------------------------------------------------
| Initializes BalloonTooltip 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/
(function (root, factory) {
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (typeof module === "object" && module.exports) {
          module.exports = factory();
        } else {
          root.BalloonTooltip = factory();
        }
      })(typeof self !== "undefined" ? self : this, function () {
        // Fungsi untuk mengatur gaya tooltips
        function setTooltipStyles(tooltip, tooltiptext, options) {
          tooltip.style.position = "relative";
          tooltip.style.display = "inline-block";
          tooltip.style.borderBottom = "1px dotted black";
          tooltip.style.cursor = "pointer";

          tooltiptext.style.visibility = "hidden";
          tooltiptext.style.width = "120px";
          tooltiptext.style.backgroundColor = options.backgroundColor;
          tooltiptext.style.color = options.textColor;
          tooltiptext.style.textAlign = "center";
          tooltiptext.style.borderRadius = "6px";
          tooltiptext.style.padding = "5px";
          tooltiptext.style.position = "absolute";
          tooltiptext.style.zIndex = "1";
          tooltiptext.style.opacity = "0";
          tooltiptext.style.transition = "opacity 0.3s";

          const arrow = document.createElement("div");
          arrow.style.position = "absolute";
          arrow.style.borderWidth = "5px";
          arrow.style.borderStyle = "solid";

          // Atur posisi tooltip dan panah berdasarkan opsi
          switch (options.position) {
            case "top":
              tooltiptext.style.bottom = "100%";
              tooltiptext.style.left = "50%";
              tooltiptext.style.marginLeft = "-60px"; // Setengah dari lebar
              tooltiptext.style.marginBottom = "5px";
              arrow.style.top = "100%";
              arrow.style.left = "50%";
              arrow.style.marginLeft = "-5px";
              arrow.style.borderColor = `${options.backgroundColor} transparent transparent transparent`;
              break;
            case "bottom":
              tooltiptext.style.top = "100%";
              tooltiptext.style.left = "50%";
              tooltiptext.style.marginLeft = "-60px"; // Setengah dari lebar
              tooltiptext.style.marginTop = "5px";
              arrow.style.bottom = "100%";
              arrow.style.left = "50%";
              arrow.style.marginLeft = "-5px";
              arrow.style.borderColor = `transparent transparent ${options.backgroundColor} transparent`;
              break;
            case "left":
              tooltiptext.style.top = "50%";
              tooltiptext.style.right = "100%";
              tooltiptext.style.marginTop = "-15px"; // Setengah dari tinggi perkiraan
              tooltiptext.style.marginRight = "5px";
              arrow.style.top = "50%";
              arrow.style.left = "100%";
              arrow.style.marginTop = "-5px";
              arrow.style.borderColor = `transparent transparent transparent ${options.backgroundColor}`;
              break;
            case "right":
              tooltiptext.style.top = "50%";
              tooltiptext.style.left = "100%";
              tooltiptext.style.marginTop = "-15px"; // Setengah dari tinggi perkiraan
              tooltiptext.style.marginLeft = "5px";
              arrow.style.top = "50%";
              arrow.style.right = "100%";
              arrow.style.marginTop = "-5px";
              arrow.style.borderColor = `transparent ${options.backgroundColor} transparent transparent`;
              break;
          }

          tooltiptext.appendChild(arrow);

          tooltip.addEventListener("mouseover", function () {
            tooltiptext.style.visibility = "visible";
            tooltiptext.style.opacity = "1";
          });

          tooltip.addEventListener("mouseout", function () {
            tooltiptext.style.visibility = "hidden";
            tooltiptext.style.opacity = "0";
          });
        }

        // Fungsi utama untuk inisialisasi tooltips
        function initBalloonTooltips(config) {
          const defaultOptions = {
            backgroundColor: "#555",
            textColor: "#fff",
            position: "top",
          };
          const options = { ...defaultOptions, ...config };

          // document.body.style.fontFamily = "Arial, sans-serif";
          // document.body.style.lineHeight = "1.6";
          // document.body.style.padding = "20px";

          document
            .querySelectorAll("[balloon-data]")
            .forEach(function (tooltip) {
              // Tambahkan kelas balloon-tooltip
              tooltip.classList.add("balloon-tooltip");

              let tooltiptext = document.createElement("span");
              tooltiptext.textContent = tooltip.getAttribute("balloon-data");
              tooltip.appendChild(tooltiptext);

              const tooltipOptions = {
                backgroundColor:
                  tooltip.getAttribute("color") || options.backgroundColor,
                textColor: options.textColor,
                position: tooltip.getAttribute("position") || options.position,
              };

              setTooltipStyles(tooltip, tooltiptext, tooltipOptions);
            });
        }

        // Mengembalikan objek publik
        return {
          init: initBalloonTooltips,
        };
      });
/*
|--------------------------------------------------------------------------
| Initializes Flyouts 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/

      (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
          define([], factory);
        } else if (typeof module === 'object' && module.exports) {
          module.exports = factory();
        } else {
          root.Flyouts = factory();
        }
      }(typeof self !== 'undefined' ? self : this, function () {

        let activeFlyout = null;

        class Flyout {
          constructor(element, options) {
            this.element = element;
            this.options = Object.assign(
              {
                title: "Judul Flyout",
                content: "Isi konten flyout.",
                placement: "auto",
              },
              options
            );
            this.flyout = null;
            this.isOpen = false;
            this.init();
          }

          init() {
            this.element.addEventListener("click", this.toggle.bind(this));
          }

          create() {
            const flyout = document.createElement("div");
            flyout.className = `flyout bs-flyout-${this.options.placement}`;
            flyout.innerHTML = `
              <div class="flyout-arrow"></div>
              <div class="flyout-header">${this.options.title}</div>
              <div class="flyout-body">${this.options.content}</div>
            `;
            document.body.appendChild(flyout);
            this.flyout = flyout;
            this.position();
          }

          position() {
            const elementRect = this.element.getBoundingClientRect();
            const flyoutRect = this.flyout.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const gap = 10;

            let placement = this.options.placement;
            let top, left;

            const calculatePosition = (forcedPlacement) => {
              switch (forcedPlacement) {
                case "top":
                  top = elementRect.top - flyoutRect.height - gap;
                  left =
                    elementRect.left +
                    elementRect.width / 2 -
                    flyoutRect.width / 2;
                  break;
                case "bottom":
                  top = elementRect.bottom + gap;
                  left =
                    elementRect.left +
                    elementRect.width / 2 -
                    flyoutRect.width / 2;
                  break;
                case "left":
                  top =
                    elementRect.top +
                    elementRect.height / 2 -
                    flyoutRect.height / 2;
                  left = elementRect.left - flyoutRect.width - gap;
                  break;
                case "right":
                  top =
                    elementRect.top +
                    elementRect.height / 2 -
                    flyoutRect.height / 2;
                  left = elementRect.right + gap;
                  break;
              }
            };

            const isInViewport = () => {
              return (
                top >= 0 &&
                left >= 0 &&
                top + flyoutRect.height <= viewportHeight &&
                left + flyoutRect.width <= viewportWidth
              );
            };

            if (
              placement === "auto" ||
              placement === "auto-start" ||
              placement === "auto-end"
            ) {
              const placements = ["top", "right", "bottom", "left"];
              for (let i = 0; i < placements.length; i++) {
                calculatePosition(placements[i]);
                if (isInViewport()) {
                  placement = placements[i];
                  break;
                }
              }
              if (!isInViewport()) {
                placement = "bottom";
                calculatePosition(placement);
              }
            } else {
              calculatePosition(placement);
            }

            if (top < gap) top = gap;
            if (left < gap) left = gap;
            if (top + flyoutRect.height > viewportHeight - gap) {
              top = viewportHeight - flyoutRect.height - gap;
            }
            if (left + flyoutRect.width > viewportWidth - gap) {
              left = viewportWidth - flyoutRect.width - gap;
            }

            this.flyout.style.top = `${top}px`;
            this.flyout.style.left = `${left}px`;

            this.flyout.className = `flyout bs-flyout-${placement}`;

            const arrow = this.flyout.querySelector(".flyout-arrow");
            switch (placement) {
              case "top":
                arrow.style.left = "50%";
                arrow.style.transform = "translateX(-50%)";
                arrow.style.bottom = "-0.6rem";
                break;
              case "bottom":
                arrow.style.left = "50%";
                arrow.style.transform = "translateX(-50%)";
                arrow.style.top = "-0.6rem";
                break;
              case "left":
                arrow.style.top = "50%";
                arrow.style.transform = "translateY(-50%)";
                arrow.style.right = "-0.6rem";
                break;
              case "right":
                arrow.style.top = "50%";
                arrow.style.transform = "translateY(-50%)";
                arrow.style.left = "-0.6rem";
                break;
            }
          }

          toggle(e) {
            e.stopPropagation();
            if (this.isOpen) {
              this.hide();
            } else {
              this.show();
            }
          }

          show() {
            if (activeFlyout && activeFlyout !== this) {
              activeFlyout.hide();
            }
            if (!this.flyout) {
              this.create();
            }
            this.flyout.style.display = "block";
            this.position();
            this.isOpen = true;
            activeFlyout = this;
            window.addEventListener("resize", this.position.bind(this));
            document.addEventListener(
              "click",
              this.outsideClickHandler.bind(this)
            );
            document.addEventListener("focusin", this.focusHandler.bind(this));
          }

          hide() {
            if (this.flyout) {
              this.flyout.style.display = "none";
              this.isOpen = false;
              if (activeFlyout === this) {
                activeFlyout = null;
              }
              window.removeEventListener("resize", this.position.bind(this));
              document.removeEventListener(
                "click",
                this.outsideClickHandler.bind(this)
              );
              document.removeEventListener(
                "focusin",
                this.focusHandler.bind(this)
              );
              this.flyout.remove();
              this.flyout = null;
            }
          }

          outsideClickHandler(e) {
            if (
              this.flyout &&
              e.target !== this.element &&
              !this.flyout.contains(e.target)
            ) {
              this.hide();
            }
          }

          focusHandler(e) {
            if (
              this.flyout &&
              e.target !== this.element &&
              !this.flyout.contains(e.target)
            ) {
              this.hide();
            }
          }
        }

        function Popovers(event, options) {
          const [placement, title, content] = options;
          const flyoutInstance = new Flyout(event.currentTarget, {
            title: title,
            content: content,
            placement: placement
          });
          flyoutInstance.toggle(event);
        }

        // Mengembalikan objek publik
        return {
          Flyout: Flyout,
          Popovers: Popovers
        };
      }));
/*
|--------------------------------------------------------------------------
| Initializes Drawer 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/

      (function (root, factory) {
        if (typeof define === "function" && define.amd) {
          // AMD. Register as an anonymous module.
          define([], factory);
        } else if (typeof module === "object" && module.exports) {
          // Node. Does not work with strict CommonJS, but
          // only CommonJS-like environments that support module.exports,
          // like Node.
          module.exports = factory();
        } else {
          // Browser globals (root is window)
          root.Drawer = factory();
        }
      })(typeof self !== "undefined" ? self : this, function () {
        function buatDrawerElement(config) {
          const drawerContainer = document.createElement("div");
          drawerContainer.className = "drawer-container";
          drawerContainer.id = "drawerContainer";

          const demoDrawer = document.createElement("div");
          demoDrawer.className = "drawer";
          demoDrawer.id = "demoDrawer";

          const drawerHeader = document.createElement("div");
          drawerHeader.className = "drawer-header";

          const drawerJudul = document.createElement("h5");
          drawerJudul.className = "drawer-judul";
          drawerJudul.textContent = "Drawer";

          const tombolTutup = document.createElement("button");
          tombolTutup.type = "button";
          tombolTutup.className = "tombol-tutup";
          tombolTutup.id = "tutupDrawer";
          tombolTutup.innerHTML = "&times;";

          const drawerIsi = document.createElement("div");
          drawerIsi.className = "drawer-isi";

          const isiParagraf = document.createElement("p");
          isiParagraf.textContent = config.konten;

          drawerHeader.appendChild(drawerJudul);
          drawerHeader.appendChild(tombolTutup);
          drawerIsi.appendChild(isiParagraf);
          demoDrawer.appendChild(drawerHeader);
          demoDrawer.appendChild(drawerIsi);
          drawerContainer.appendChild(demoDrawer);

          return drawerContainer;
        }

        function Drawer(config) {
          const drawerElement = buatDrawerElement(config);
          document.body.appendChild(drawerElement);

          const drawerContainer = document.getElementById("drawerContainer");
          const drawer = document.getElementById("demoDrawer");
          const tutupDrawer = document.getElementById("tutupDrawer");

          drawer.classList.add(config.flip);

          if (config.flip === "top" || config.flip === "bottom") {
            drawer.style.height = config.width;
          } else {
            drawer.style.width = config.width;
          }

          if (config.background) {
            drawer.style.backgroundColor = config.background;
          }

          function toggleDrawer() {
            requestAnimationFrame(() => {
              drawerContainer.classList.toggle("tampil");
              if (drawerContainer.classList.contains("tampil")) {
                drawer.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
                drawer.focus();
                drawerContainer.dispatchEvent(new CustomEvent("drawerOpen"));
              } else {
                drawer.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
                drawerContainer.dispatchEvent(new CustomEvent("drawerClose"));
              }
            });
          }

          drawerContainer.addEventListener("click", (e) => {
            if (e.target === drawerContainer) {
              toggleDrawer();
            }
          });

          tutupDrawer.addEventListener("click", toggleDrawer);

          document.addEventListener("keydown", function (e) {
            if (
              e.key === "Escape" &&
              drawerContainer.classList.contains("tampil")
            ) {
              toggleDrawer();
            }
          });

          return {
            open: toggleDrawer,
            close: toggleDrawer,
            ubahKonten: function (kontenBaru) {
              document.querySelector(".drawer-isi p").textContent = kontenBaru;
            },
          };
        }

        return Drawer;
      });

/*
|--------------------------------------------------------------------------
| Initializes Shortcut 
|--------------------------------------------------------------------------
| Develover Tatiye.Net 2020
| @Date 8/12/2024 2:31:01 PM
*/

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Shortcut = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  class Shortcut {
    constructor(options = {}) {
      this.shortcuts = {};
      this.isEnabled = options.enabled !== false;
      this.modifiers = new Set([
        "ctrlKey",
        "altKey",
        "shiftKey",
        "metaKey",
      ]);
      document.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    ctrl(config) {
      if (!Array.isArray(config.key) || config.key.length === 0) {
        throw new Error("Key harus berupa array dan tidak boleh kosong");
      }

      config.key.forEach((key) => {
        const shortcut = this.parseKeyCombo(key);
        this.shortcuts[shortcut.join("+")] = {
          component: config.component,
          callback: config.sendCallback,
        };
      });
    }

    parseKeyCombo(combo) {
      return combo.toLowerCase().split("+").sort();
    }

    handleKeyDown(event) {
      if (!this.isEnabled) return;

      const pressedKeys = [];
      this.modifiers.forEach((mod) => {
        if (event[mod])
          pressedKeys.push(mod.replace("Key", "").toLowerCase());
      });
      pressedKeys.push(event.key.toLowerCase());

      const shortcutKey = pressedKeys.sort().join("+");
      if (this.shortcuts[shortcutKey]) {
        event.preventDefault();
        this.triggerComponent(this.shortcuts[shortcutKey], shortcutKey);
      }
    }

    triggerComponent(shortcutInfo, key) {
      // console.log(
      //   `Membuka ${shortcutInfo.component} dengan shortcut ${key}...`
      // );
      // document.getElementById(
      //   "output"
      // ).textContent = `Membuka ${shortcutInfo.component} dengan shortcut ${key}...`;

      if (typeof shortcutInfo.callback === "function") {
        shortcutInfo.callback(key);
      }
      this.emit("shortcutTriggered", {
        component: shortcutInfo.component,
        key,
      });
    }

    setEnabled(enabled) {
      this.isEnabled = enabled;
    }

    emit(eventName, data) {
      const event = new CustomEvent(eventName, { detail: data });
      document.dispatchEvent(event);
    }
  }

  return Shortcut;
}));