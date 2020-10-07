var images = require("images");

exports.editImage = function (bigFile, smallFile, outputFile) {
    images(bigFile).draw(images(smallFile), 10, 10).save(outputFile);
    console.log("Edit Success!!");
}
