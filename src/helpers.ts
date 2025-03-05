import { Block, Matrix, Coordinates, BoardSettings } from "./types";

function randomNumberInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min);
}

export function callForNeghbors(
  fn: (block: Block, coordinates: Coordinates) => void,
  matrix: Matrix,
  coordinates: Coordinates
) {
  const { x, y } = coordinates;
  // for (let nY = -1; nY <= 1; nY++) {
  //   for (let nX = -1; nX <= 1; nX++) {
  //     if (!matrix[nY]?.[nX] || (nY === y && nX === x)) {
  //       continue;
  //     }
  //     fn(matrix[nY][nX], { x: nX, y: nY });
  //   }
  // }
  if (matrix[y - 1]?.[x - 1]) fn(matrix[y - 1][x - 1], { x: x - 1, y: y - 1 });
  if (matrix[y - 1]?.[x]) fn(matrix[y - 1][x], { x, y: y - 1 });
  if (matrix[y - 1]?.[x + 1]) fn(matrix[y - 1][x + 1], { x: x + 1, y: y - 1 });
  if (matrix[y]?.[x - 1]) fn(matrix[y][x - 1], { x: x - 1, y });
  if (matrix[y]?.[x + 1]) fn(matrix[y][x + 1], { x: x + 1, y });
  if (matrix[y + 1]?.[x - 1]) fn(matrix[y + 1][x - 1], { x: x - 1, y: y + 1 });
  if (matrix[y + 1]?.[x]) fn(matrix[y + 1][x], { x, y: y + 1 });
  if (matrix[y + 1]?.[x + 1]) fn(matrix[y + 1][x + 1], { x: x + 1, y: y + 1 });
}

function setMinesCounts(matrix: Matrix) {
  return matrix.map((row, y) =>
    row.map((block, x) => {
      let neighborMinesCount = 0;
      callForNeghbors(
        (neighbor) => {
          neighborMinesCount += Number(neighbor.mine || 0);
        },
        matrix,
        { x, y }
      );

      return {
        ...block,
        neighborMinesCount,
      };
    })
  );
}

export function generateBlocks(
  x: number,
  y: number,
  minesCount: number,
  ignoreIndex?: { x: number; y: number }
) {
  const blocksCount = x * y;
  if (blocksCount * 0.3 < minesCount) {
    throw new Error("Too much mines!");
  }

  const matrix = Array(y)
    .fill(
      Array(x).fill({
        mine: false,
        flagged: false,
        opened: false,
        neighborMinesCount: 0,
      })
    )
    .map((xItem: Array<Block>) => xItem.map((yItem) => ({ ...yItem })));

  let placedMinesCount = 0;
  let tryCount = 0;
  while (placedMinesCount < minesCount && tryCount < 155) {
    tryCount++;
    const mineCoordinates = {
      x: randomNumberInRange(0, x - 1),
      y: randomNumberInRange(0, y - 1),
    };

    if (
      matrix[mineCoordinates.y][mineCoordinates.x].mine ||
      (mineCoordinates.x === ignoreIndex?.x &&
        mineCoordinates.y === ignoreIndex?.y)
    ) {
      continue;
    }
    if (ignoreIndex) {
      let isOneOfNeighbors = false;
      callForNeghbors(
        (_neighbor, coordinates) => {
          if (
            mineCoordinates.x === coordinates.x &&
            mineCoordinates.y === coordinates.y
          ) {
            isOneOfNeighbors = true;
          }
        },
        matrix,
        ignoreIndex
      );
      if (isOneOfNeighbors) {
        continue;
      }
    }
    matrix[mineCoordinates.y][mineCoordinates.x].mine = true;
    placedMinesCount++;
  }

  return setMinesCounts(matrix);
}

export function openNeghbors(
  newMatrix: Matrix,
  block: Block,
  coordinates: Coordinates,
  forceOpen?: boolean
) {
  if (
    (!forceOpen && newMatrix[coordinates.y][coordinates.x].opened) ||
    newMatrix[coordinates.y][coordinates.x].flagged
  ) {
    return;
  }
  newMatrix[coordinates.y][coordinates.x] = {
    ...newMatrix[coordinates.y][coordinates.x],
    opened: true,
  };
  newMatrix[coordinates.y] = [...newMatrix[coordinates.y]];
  if (!block.neighborMinesCount || forceOpen) {
    callForNeghbors(
      (...args) => openNeghbors(newMatrix, ...args),
      newMatrix,
      coordinates
    );
  }
}

export const boardSettingsEasy: BoardSettings = {
  width: 9,
  height: 9,
  count: 10,
};

export const boardSettingsMedium: BoardSettings = {
  width: 16,
  height: 16,
  count: 40,
};

export const boardSettingsHard: BoardSettings = {
  width: 30,
  height: 16,
  count: 99,
};
