pub struct World {
    grid: Vec<Cell>,
    width: usize,
    height: usize,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Cell {
    Alive,
    Dead,
}

impl std::fmt::Display for Cell {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Cell::Alive => write!(f, "■"),
            Cell::Dead => write!(f, "□"),
        }
    }
}

impl World {
    pub fn new(width: usize, height: usize) -> World {
        World {
            grid: vec![Cell::Dead; width * height],
            width,
            height,
        }
    }

    fn linearize_coordinates(&self, x: isize, y: isize) -> usize {
        let (i, j) = (bounded(x, self.width), bounded(y, self.height));
        self.width * j + i
    }

    pub fn get(&self, x: isize, y: isize) -> &Cell {
        let index = self.linearize_coordinates(x, y);
        self.grid.get(index).unwrap()
    }

    fn get_mut(&mut self, x: isize, y: isize) -> &mut Cell {
        let index = self.linearize_coordinates(x, y);
        self.grid.get_mut(index).unwrap()
    }

    pub fn set(&mut self, x: isize, y: isize, cell: Cell) {
        let mut _current_cell = self.get_mut(x, y);
        *_current_cell = cell;
    }
}

impl std::fmt::Display for World {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for (index, cell) in self.grid.iter().enumerate() {
            write!(f, "{} ", cell.to_string())?;
            if (index + 1) % self.width == 0 {
                write!(f, "\n")?
            }
        }
        Ok(())
    }
}

fn bounded(value: isize, max: usize) -> usize {
    let max = isize::try_from(max).unwrap();
    let mut bounded_value = value;
    while bounded_value < 0 {
        bounded_value += max;
    }
    (bounded_value % max).try_into().unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn can_set_cell() {
        let mut world = World::new(4, 4);
        world.set(2, 2, Cell::Alive);
        let cell = world.get(2, 2);
        assert_eq!(*cell, Cell::Alive);
    }

    #[test]
    fn can_use_negative_coordinates() {
        let mut world = World::new(4, 4);
        world.set(3, 3, Cell::Alive);
        let cell = world.get(-1, -1);
        assert_eq!(*cell, Cell::Alive);
    }

    #[test]
    fn can_use_large_coordinates() {
        let mut world = World::new(4, 4);
        world.set(4, 4, Cell::Alive);
        let cell = world.get(0, 0);
        assert_eq!(*cell, Cell::Alive);
    }
}
