// create fresh table, replace current table creating the illusion of animation
const createTable = (currPos, prevPos, tableData) => {
  const stackElem = document.querySelector(".stackyboi");
  let table = document.createElement("table");
  let tableBody = document.createElement("tbody");
  let cp = document.createElement("div");
  let pp = document.createElement("div");

  // print in reverse order
  tableData
    .slice()
    .reverse()
    .forEach(rowData => {
      let row = document.createElement("tr");
      rowData.forEach(cellData => {
        let cell = document.createElement("td");
        if (cellData === 0) {
          cell.appendChild(document.createTextNode(cellData));
        } else if (cellData === 1) {
          cell.style.background = "white";
        }
        row.appendChild(cell);
      });
      tableBody.appendChild(row);
    });

  table.appendChild(tableBody);
  pp.innerHTML = "prev: " + JSON.stringify(prevPos);
  cp.innerHTML = "curr: " + JSON.stringify(currPos);
  stackElem.innerHTML = "";
  stackElem.appendChild(pp);
  stackElem.appendChild(cp);
  stackElem.appendChild(table);
};

// create and retrurn 2D array stack
const createStack = ({ rows, columns }) => {
  return new Array(parseInt(rows))
    .fill(0)
    .map(i => Array(parseInt(columns)).fill(0));
};

// paint with required value
const paintCurrRow = (stack, currPos, value) => {
  for (let i = currPos.col; i < currPos.col + currPos.len; ++i) {
    stack[currPos.row][i] = value;
  }
};

export { createTable, createStack, paintCurrRow };
