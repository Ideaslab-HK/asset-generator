const fse = require('fs-extra');
const jimp = require('jimp');
const glob = require('glob');
const path = require('path');

function ensureTrailingSlash(path) {
    return (path.endsWith('/') === false) ? path + "/" : path;
}

function resizeAndSave(factor, source, target) {
    jimp.read(source, function (err, image) {
        image.resize(image.bitmap.width * factor, jimp.AUTO);
        image.write(target, err => {
            if (err) {
                console.error(target + " ERROR: " + error);
            } else {
                console.log(target + " generated");
            }
        });
    });
}

function generate(files, targetAndroid, targetIos, scale) {
    for (let file of files) {
        let filename = path.basename(file);
        let filetype = filename.substr(filename.lastIndexOf('.'), filename.length);
        let effectiveScale = scale

        filename = filename.substr(0, filename.lastIndexOf('.'));
        if (filename.indexOf("@3x")!==-1) {
        	effectiveScale = 3;
            filename = filename.substr(0, filename.lastIndexOf('@'));
        }

        console.info("process " + filename + filetype);

        if (typeof targetAndroid !== "undefined") {
        	if (effectiveScale == 3) {
				resizeAndSave(0.5, file, targetAndroid + 'drawable-hdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(0.25, file, targetAndroid + 'drawable-ldpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(1 / 3, file, targetAndroid + 'drawable-mdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(2 / 3, file, targetAndroid + 'drawable-xhdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(1, file, targetAndroid + 'drawable-xxhdpi/' + filename.toLowerCase() + filetype);
        	} else {
   	            resizeAndSave(0.75 / 4, file, targetAndroid + 'drawable-ldpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(1 / 4, file, targetAndroid + 'drawable-mdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(1.5 / 4, file, targetAndroid + 'drawable-hdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(2 / 4, file, targetAndroid + 'drawable-xhdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(3 / 4, file, targetAndroid + 'drawable-xxhdpi/' + filename.toLowerCase() + filetype);
				resizeAndSave(1, file, targetAndroid + 'drawable-xxxhdpi/' + filename.toLowerCase() + filetype);
			}
        }

        if (typeof targetIos !== "undefined") {
        	if (effectiveScale == 3) {
				resizeAndSave(1/3, file, targetIos + filename + filetype);
				resizeAndSave(2/3, file, targetIos + filename + '@2x' + filetype);
				resizeAndSave(1, file, targetIos + filename + '@3x' + filetype);
        	} else {
				resizeAndSave(1 / 4, file, targetIos + filename + filetype);
				resizeAndSave(1 / 2, file, targetIos + filename + '@2x' + filetype);
				resizeAndSave(3 / 4, file, targetIos + filename + '@3x' + filetype);
        	}
        }
    }
}

module.exports = (q, targetAndroid, targetIos, scale) => {
    if (typeof targetAndroid !== "undefined") {
        targetAndroid = ensureTrailingSlash(targetAndroid);
        fse.ensureDirSync(targetAndroid + 'drawable-hdpi');
        fse.ensureDirSync(targetAndroid + 'drawable-ldpi');
        fse.ensureDirSync(targetAndroid + 'drawable-mdpi');
        fse.ensureDirSync(targetAndroid + 'drawable-xhdpi');
        fse.ensureDirSync(targetAndroid + 'drawable-xxhdpi');
//         if (typeof scale !== "undefined") {
// 	        fse.ensureDirSync(targetAndroid + 'drawable-xxxhdpi');
//         }
    }

    if (typeof targetIos !== "undefined") {
        targetIos = ensureTrailingSlash(targetIos);
        fse.ensureDirSync(targetIos);
    }

    if (q.length == 1 && q[0].indexOf("*") !== -1) {
        glob(q[0], {}, (er, files) => generate(files, targetAndroid, targetIos, scale));
    } else {
        generate(q, targetAndroid, targetIos, scale);
    }
}