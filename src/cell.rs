use wasm_bindgen::prelude::*;

pub trait Cellular {
    fn get(&self, x: isize, y: isize) -> &Cell;

    fn set(&mut self, x: isize, y: isize, cell: Cell);
}

#[repr(u8)]
#[derive(Clone, Debug, PartialEq, Eq)]
#[wasm_bindgen]
pub enum Cell {
    Alive = 1,
    Dead = 0,
}

impl rand::distr::Distribution<Cell> for rand::distr::StandardUniform {
    fn sample<R: rand::Rng + ?Sized>(&self, rng: &mut R) -> Cell {
        match rng.random_range(0..=1) {
            0 => Cell::Dead,
            _ => Cell::Alive,
        }
    }
}

impl std::fmt::Display for Cell {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Cell::Alive => write!(f, "■"),
            Cell::Dead => write!(f, "□"),
        }
    }
}
