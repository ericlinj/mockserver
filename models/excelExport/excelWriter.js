var XLSX = require('xlsx');

function ExcelWriter(projectName , excelData) {
  this.projectName = projectName;
  this.data = excelData;
}

module.exports = ExcelWriter;

ExcelWriter.prototype.getWorkbook = function(prjname) {
  var ws_name = this.projectName;
  var data = this.data;
  var wb = new Workbook();


  var wscols = [{
    wch: 5
  }, {
    wch: 10
  }, {
    wch: 10
  }, {
    wch: 20
  }, {
    wch: 40
  }, {
    wch: 20
  }];

  var ws = sheet_from_array_of_arrays(data);
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;
  ws['!cols'] = wscols;

  return wb;
}

/* dummy workbook constructor */
function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

/* TODO: date1904 logic */
function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

/* convert an array of arrays in JS to a CSF spreadsheet */
function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      /* TEST: proper cell types and value handling */
      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';
      ws[cell_ref] = cell;
    }
  }

  /* TEST: proper range */
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}
