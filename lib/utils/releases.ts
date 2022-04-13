import { includes } from 'lodash';

const LINUX_ARCHS = [
	'x64',
	'aarch64',
	'armv5',
	'armv6',
	'armv7',
	'i386',
	'x86_64',
];

function isMacOs(str: string) {
	return (
		includes(str, 'darwin') || includes(str, '.dmg') || includes(str, 'mac')
	);
}

function isLinux(str: string) {
	const arch = getArch(str);
	return (
		includes(str, 'linux') ||
		includes(str, '.AppImage') ||
		includes(str, '.deb') ||
		includes(str, '.rpm') ||
		includes(LINUX_ARCHS, arch)
	);
}

function isWindows(str: string) {
	return (
		includes(str, 'win32') || includes(str, 'windows') || includes(str, '.exe')
	);
}

/**
 *
 * @param {String} str - The string to scrutinize
 * @returns {String}
 * @example
 * getOS(balenaEtcher-Portable-1.5.63.exe)
 */
const getOS = (str: string): string => {
	if (isMacOs(str)) {
		return 'macOS';
	}
	if (isWindows(str)) {
		return 'Windows';
	}
	if (isLinux(str)) {
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
const getArch = (str: string): string => {
	if (
		includes(str, 'x64') ||
		includes(str, 'x86_64') ||
		includes(str, 'amd64') ||
		isMacOs(str)
	) {
		return 'x64';
	}
	if (includes(str, 'aarch64')) {
		return 'aarch64';
	}
	if (includes(str, 'armv5')) {
		return 'armv5';
	}
	if (includes(str, 'armv6')) {
		return 'armv6';
	}
	if (includes(str, 'armv7')) {
		return 'armv7';
	}
	if (includes(str, 'i386')) {
		return 'i386';
	}
	if (includes(str, 'x86_64')) {
		return 'x86_64';
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
const getArchString = (str: string): string => {
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
const getInstallerType = (str: string): string | null => {
	if (includes(str, 'tar.gz')) {
		return null;
	}

	if (isMacOs(str)) {
		return null;
	}

	if (isLinux(str)) {
		return '(AppImage)';
	}

	if (includes(str, 'portable')) {
		return '(Portable)';
	}

	return '(Installer)';
};

export { getArch, getArchString, getInstallerType, getOS };
