import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import winston from 'winston';
import Work from '../../../models/work';


const filterByModifiedSourceFile = async (sourceFiles, sourceDir) => {
	const sourceFilesWithPath = sourceFiles.map(sourceFile => path.join(sourceDir, sourceFile));

	// read existing workItem entries from DB filtered by param sourceFiles
	const existingSourceWork = await Work.findAll({
		attributes: ['filename', 'filemd5hash'],
		where: {
			filename: sourceFilesWithPath,
		},
		raw: true,
	});

	// parse file path, add md5 and build objects
	const sourceObjsWithMD5 = sourceFiles.map((sourceFile) => {
		const filename = path.join(sourceDir, sourceFile);
		return {
			sourcefile: sourceFile,
			filename: filename,
			filemd5hash: crypto.createHash('md5').update(fs.readFileSync(filename, 'utf8')).digest('hex'),
		};
	});

	// filter by changed ones based on md5
	const sourceObjsModified = sourceObjsWithMD5.filter((sourceObj) => {
		for (let i = 0; i < existingSourceWork.length; i += 1) {
			if (sourceObj.filemd5hash === existingSourceWork[i].filemd5hash) {
				winston.info(` -- -- MD5 not changed, skipping ${sourceObj.filename} `);
				return false;
			}
		}
		return true;
	});

	// done and return array of filenames
	return sourceObjsModified.map(sourceObjModified => sourceObjModified.sourcefile);
};

export {filterByModifiedSourceFile};
