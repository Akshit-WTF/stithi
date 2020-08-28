/**
 * @file Log Handler
 * @author Akshit Kumar
 * @license MIT
 */

exports.info = (msg) => {
    console.log(`[INFO]: ${msg}`)
}

exports.error = (msg) => {
    console.log(`[ERROR]: ${msg}`)
}

exports.warn = (msg) => {
    console.log(`[WARN]: ${msg}`)
}

exports.stithi = (msg) => {
    console.log(`[STITHI]: ${msg}`)
}