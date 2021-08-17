import { includes } from 'lodash';

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getOS(balenaEtcher-Portable-1.5.63.exe)
 */
const getOS = (str: any): string => {
	if (
		includes(str, 'darwin') ||
		includes(str, '.dmg') ||
		includes(str, 'mac')
	) {
		return 'macOS';
	} else if (
		includes(str, 'win32') ||
		includes(str, 'windows') ||
		includes(str, '.exe')
	) {
		return 'Windows';
	} else if (
		includes(str, 'linux') ||
		includes(str, '.AppImage') ||
		includes(str, '.deb') ||
		includes(str, '.rpm')
	) {
		return 'Linux';
	}

	return 'Unknown';
};

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getArch(balenaEtcher-Portable-1.5.63.exe)
 */
const getArch = (str: any): string => {
	if (
		includes(str, 'x64') ||
		includes(str, 'x86_64') ||
		includes(str, 'amd64') ||
		getOS(str) === 'macOS'
	) {
		return 'x64';
	}
	return 'x86';
};

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getArchString(balenaEtcher-Portable-1.5.63.exe)
 */
const getArchString = (str: any): string => {
	switch (getArch(str)) {
		case 'x86':
			return '(32-bit)';
		case 'x64':
			return '(64-bit)';
		default:
			return 'Unknown';
	}
};

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getInstallerType(balenaEtcher-Portable-1.5.63.exe)
 */
const getInstallerType = (str: any): string | null => {
	if (getOS(str) === 'macOS') {
		return null;
	}

	if (getOS(str) === 'Linux') {
		return '(AppImage)';
	}

	if (includes(str, 'portable')) {
		return '(Portable)';
	}

	return '(Installer)';
};

export { getArch, getArchString, getInstallerType, getOS };
