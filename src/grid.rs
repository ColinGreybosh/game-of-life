use crate::cell;

pub struct Grid {
    grid: Vec<cell::Cell>,
    width: usize,
    height: usize,
}

impl Grid {
    pub fn new(width: usize, height: usize) -> Grid {
        Grid {
            grid: vec![cell::Cell::Dead; width * height],
            width,
            height,
        }
    }

    fn linearize_coordinates(&self, x: isize, y: isize) -> usize {
        let (i, j) = (bounded(x, self.width), bounded(y, self.height));
        self.width * j + i
    }

    fn get_mut(&mut self, x: isize, y: isize) -> &mut cell::Cell {
        let index = self.linearize_coordinates(x, y);
        self.grid.get_mut(index).unwrap()
    }
}

impl cell::Cellular for Grid {
    fn get(&self, x: isize, y: isize) -> &cell::Cell {
        let index = self.linearize_coordinates(x, y);
        self.grid.get(index).unwrap()
    }

    fn set(&mut self, x: isize, y: isize, cell: cell::Cell) {
        let mut _current_cell = self.get_mut(x, y);
        *_current_cell = cell;
    }
}

impl Clone for Grid {
    fn clone(&self) -> Self {
        Grid {
            grid: self.grid.clone(),
            width: self.width,
            height: self.height,
        }
    }
}

impl std::fmt::Display for Grid {
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
    use crate::cell::Cellular;

    #[test]
    fn can_set_cell() {
        let mut grid = Grid::new(4, 4);
        grid.set(2, 2, cell::Cell::Alive);
        let cell = grid.get(2, 2);
        assert_eq!(*cell, cell::Cell::Alive);
    }

    #[test]
    fn can_use_negative_coordinates() {
        let mut grid = Grid::new(4, 4);
        grid.set(3, 3, cell::Cell::Alive);
        let cell = grid.get(-1, -1);
        assert_eq!(*cell, cell::Cell::Alive);
    }

    #[test]
    fn can_use_large_coordinates() {
        let mut grid = Grid::new(4, 4);
        grid.set(4, 4, cell::Cell::Alive);
        let cell = grid.get(0, 0);
        assert_eq!(*cell, cell::Cell::Alive);
    }
}
