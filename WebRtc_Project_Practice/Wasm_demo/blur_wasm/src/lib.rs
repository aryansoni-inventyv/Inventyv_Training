use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn blur_image(data: &mut [u8], width: u32, height: u32) {
    let mut copy = data.to_vec();

    let w = width as usize;
    let h = height as usize;

    for y in 1..h - 1 {
        for x in 1..w - 1 {
            let mut r = 0;
            let mut g = 0;
            let mut b = 0;

            for ky in -1..=1 {
                for kx in -1..=1 {
                    let px = (x as isize + kx) as usize;
                    let py = (y as isize + ky) as usize;

                    let idx = (py * w + px) * 4;

                    r += copy[idx] as u32;
                    g += copy[idx + 1] as u32;
                    b += copy[idx + 2] as u32;
                }
            }

            let idx = (y * w + x) * 4;
            data[idx] = (r / 9) as u8;
            data[idx + 1] = (g / 9) as u8;
            data[idx + 2] = (b / 9) as u8;
        }
    }
}
