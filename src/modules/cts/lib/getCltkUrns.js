import path from 'path';
import _s from 'underscore.string';


const getCltkCollectionUrn = (repoURL) => {
	let repoName = repoURL.substring(repoURL.lastIndexOf('/'));
	repoName = repoName.replace(path.extname(repoURL), '');
	repoName = _s.slugify(repoName);
	repoName = _s.camelize(repoName);

	return `urn:cts:${repoName}`;
};

const getCltkTextgroupUrn = (collectionUrn, textGroupAuthor) => `${collectionUrn}:${_s.camelize(_s.slugify(textGroupAuthor))}`;

const getCltkWorkUrn = (collectionUrn, textGroupAuthor, workTitle) => `${collectionUrn}:${_s.camelize(_s.slugify(textGroupAuthor))}.${_s.camelize(_s.slugify(workTitle))}`;

export { getCltkCollectionUrn, getCltkTextgroupUrn, getCltkWorkUrn };
