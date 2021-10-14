import path from 'path';
import { Backend } from '../../typings/types';
import { imageFileExtensions, mimeTypes } from './image';

export const isImagePath = (currentPath: string) => {
	return imageFileExtensions.some((ext) =>
		currentPath.toLowerCase().endsWith(ext),
	);
};

export const resolveRelativeToRoot = (
	currentPath: string,
	currentFolder?: string | string[],
): string => {
	if (!currentFolder) {
		return path.join(currentPath);
	}
	if (currentFolder instanceof Array) {
		return path.join(...currentFolder, currentPath);
	}
	return path.join(currentFolder, currentPath);
};
export type Entity = Entity[] | string | object | number | null;

export const injectImages = (backend: Backend) => {
	return async function replaceImagePathsToBase64(
		entity: Entity,
		currentFolder: string,
	): Promise<Entity> {
		if (typeof entity === 'string') {
			const relativePath = resolveRelativeToRoot(entity);
			if (isImagePath(relativePath)) {
				const fileContent = await backend.readFile(relativePath);
				const mimeType =
					// @ts-expect-error
					mimeTypes[relativePath.split('.').reverse()[0].toLowerCase()];
				return {
					base64: `data:${mimeType};base64,${fileContent}`,
				};
			}
			return relativePath;
		}
		if (entity instanceof Array) {
			const arrayEntity = [];
			for (const item of entity) {
				const replacedContent = await replaceImagePathsToBase64(
					item,
					currentFolder,
				);
				arrayEntity.push(replacedContent);
			}
			return arrayEntity;
		}
		if (entity instanceof Object) {
			let objectEntity = {};

			for (const item of Object.entries(entity)) {
				objectEntity = {
					...objectEntity,
					[item[0]]: await replaceImagePathsToBase64(item[1], currentFolder),
				};
			}
			return objectEntity;
		}
		return entity;
	};
};
