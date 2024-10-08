// copy on stackoverflow

function slugify(str) {
  return String(str)
    .replace(/Đ/g, "D") // Chuyển đổi Đ thành D
    .replace(/đ/g, "d") // Chuyển đổi đ thành d
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}
// example
// console.log(slugify("The Quick Brown Fox Jumps Over The Lazy Dog! "));
// // "the-quick-brown-fox-jumps-over-the-lazy-dog"

// console.log(slugify("söme stüff with áccènts"));
// // "some-stuff-with-accents"

export default slugify;
