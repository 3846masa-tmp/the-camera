use std::mem;
use std::os::raw::c_void;
use std::slice;

#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
  let mut buf = Vec::with_capacity(size);
  let ptr = buf.as_mut_ptr();
  mem::forget(buf);
  return ptr as *mut c_void;
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut c_void, size: usize) {
  unsafe {
    let _buf = Vec::from_raw_parts(ptr, 0, size);
  }
}

#[no_mangle]
pub fn posterize(pointer: *mut u8, bytesize: usize) {
  let sl = unsafe { slice::from_raw_parts_mut(pointer, bytesize) };
  let range = (255.0f32 / 5.0f32).ceil();

  for idx in (0..bytesize).step_by(4) {
    let red = sl[idx] as f32;
    let green = sl[idx + 1] as f32;
    let blue = sl[idx + 2] as f32;

    let rStep = (red / range).floor();
    let gStep = (green / range).floor();
    let bStep = (blue / range).floor();

    sl[idx] = ((rStep + 0.5) * range).min(255.0).max(0.0) as u8;
    sl[idx + 1] = ((gStep + 0.5) * range).min(255.0).max(0.0) as u8;
    sl[idx + 2] = ((bStep + 0.5) * range).min(255.0).max(0.0) as u8;
  }
}
