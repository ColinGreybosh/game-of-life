mod grid;
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    let mut world = grid::World::new(20, 20);
    for i in 0..20 {
        world.set(i, i, grid::Cell::Alive);
    }
    alert(&format!("Hello, World!\n{}", world.to_string()));
}
