use crate::cell;
use crate::cell::Cellular;
use crate::grid;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Game {
    current_grid: grid::Grid,
    next_grid: grid::Grid,
    width: isize,
    height: isize,
}

#[wasm_bindgen]
impl Game {
    pub fn new(width: usize, height: usize) -> Game {
        let mut current_grid = grid::Grid::new(width, height);
        for i in 0..width {
            for j in 0..height {
                current_grid.set(i.try_into().unwrap(), j.try_into().unwrap(), rand::random());
            }
        }
        let next_grid = current_grid.clone();
        Game {
            current_grid,
            next_grid,
            width: width.try_into().unwrap(),
            height: height.try_into().unwrap(),
        }
    }

    pub fn update(&mut self) {
        for i in 0..self.width {
            for j in 0..self.height {
                let current_cell = self.current_grid.get(i, j).clone();
                let live_neighbors = self.count_live_neighbors(i, j);
                let next_cell = match (current_cell, live_neighbors) {
                    (cell::Cell::Alive, ..2) => cell::Cell::Dead,
                    (cell::Cell::Alive, 4..) => cell::Cell::Dead,
                    (cell::Cell::Dead, 3) => cell::Cell::Alive,
                    (cell, _) => cell,
                };
                self.next_grid.set(i, j, next_cell);
            }
        }
        std::mem::swap(&mut self.current_grid, &mut self.next_grid)
    }

    pub fn render(&self) -> String {
        self.to_string()
    }

    pub fn cells(&self) -> Box<[cell::Cell]> {
        self.current_grid.cells()
    }

    fn count_live_neighbors(&self, x: isize, y: isize) -> usize {
        let mut count = 0;
        for i in -1..=1 {
            for j in -1..=1 {
                if (i, j) == (0, 0) {
                    continue;
                }
                match *self.current_grid.get(x + i, y + j) {
                    cell::Cell::Alive => count += 1,
                    cell::Cell::Dead => (),
                }
            }
        }
        count
    }
}

impl Cellular for Game {
    fn get(&self, x: isize, y: isize) -> &cell::Cell {
        self.current_grid.get(x, y)
    }

    fn set(&mut self, x: isize, y: isize, cell: cell::Cell) {
        self.current_grid.set(x, y, cell);
    }

    fn clear(&mut self) {
        self.current_grid.clear();
        self.next_grid.clear();
    }
}

#[wasm_bindgen]
impl Game {
    pub fn set_js(&mut self, x: isize, y: isize, cell: cell::Cell) {
        Cellular::set(self, x, y, cell);
    }

    pub fn clear_js(&mut self) {
        Cellular::clear(self);
    }

    pub fn reset(&mut self) {
        for i in 0..self.width {
            for j in 0..self.height {
                self.current_grid.set(i, j, rand::random());
                self.next_grid.set(i, j, rand::random());
            }
        }
    }
}

impl std::fmt::Display for Game {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.current_grid.to_string())
    }
}
