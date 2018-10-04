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

    sl[idx] = (((red / range).floor() + 0.5) * range) as u8;
    sl[idx + 1] = (((green / range).floor() + 0.5) * range) as u8;
    sl[idx + 2] = (((blue / range).floor() + 0.5) * range) as u8;
  }
}
