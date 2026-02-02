mod cell;
mod conway;
mod grid;
mod utils;

use crate::cell::Cellular;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    let mut game = conway::Game::new(20, 20);
    for i in 0..20 {
        game.set(i, i, cell::Cell::Alive);
    }
    alert(&format!("Hello, World!\n{}", game.to_string()));
}
