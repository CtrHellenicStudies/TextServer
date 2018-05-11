import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import winston from 'winston';
import Work from '../../../models/work';

/**
 * filter out un-modified work items, and clear existing data for modified ones
 * @param {*} sourceFiles 
 * @param {*} sourceDir 
 */
const prepareModifiedSourceFiles = async (sourceFiles, sourceDir) => {
	
	// prepare work item objects
	const sourceObjs = await Promise.all(sourceFiles.map(async (sourceFileName) => {
		const filename = path.join(sourceDir, sourceFileName); // abs path of work item
		const sourceFileMD5 = crypto.createHash('md5').update(fs.readFileSync(filename, 'utf8')).digest('hex');
		let sourceFileModifiedFlag = false;

		// find all existing work by filename
		const existingWorkItems = await Work.findAll({
			attributes: ['filename', 'filemd5hash', 'id'],
			where: {
				filename: filename,
			},
			raw: true,
		});

		if (existingWorkItems.length > 0) {
			// remove modified ones
			await Promise.all(existingWorkItems.map(async (existingWorkItem) => {
				if (existingWorkItem.filemd5hash !== sourceFileMD5) {
					winston.info(' -- -- MD5 change detected for these source text, clearing ... ', existingWorkItem);
					await Work.destroy({
						where: {filemd5hash: existingWorkItem.filemd5hash},
					});
					sourceFileModifiedFlag = true;
				}
			}));
		} else {
			sourceFileModifiedFlag = true;
		}

		return {
			sourceFileName: sourceFileName,
			filename: filename,
			filemd5hash: sourceFileMD5,
			modified: sourceFileModifiedFlag,
		};
	}));
	
	// if a file is moved without content change
	// filepath will be different but md5 stays the same
	// TODO: update filepath for moved files

	// if a file is moved with content change
	// TODO: use workitem urn to id the workitem and update it
	// workItem urn contains postfix indicating translation/edition/etc.. 

	const sourceObjsModified = sourceObjs.filter(sourceObj => sourceObj.modified);
	// done and return array of filenames
	if (sourceObjsModified.length > 0) {
		winston.info(' -- -- Updating modified source text ...', sourceObjsModified.map(sourceObj => `${sourceObj.filename} MD5: ${sourceObj.filemd5hash}`));
	} else {
		winston.info(' -- -- No change in source text ...', sourceDir);
	}
	return sourceObjsModified.map(sourceObjModified => sourceObjModified.sourceFileName);
};

export { prepareModifiedSourceFiles };
