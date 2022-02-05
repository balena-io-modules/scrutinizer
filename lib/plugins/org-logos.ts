/*
 * Copyright 2019 balena
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Backend } from '../../typings/types';
import { getLogoFromUrl } from '../utils/image';

export default async (backend: Backend) => {
	let svgFullLogo = null;
	let svgLogoBrandmark = null;
	let pngFullLogo = null;
	let pngLogoBrandmark = null;

	svgFullLogo = (await getLogoFromUrl('logo_full.svg', backend, true)) || null;

	if (!svgFullLogo) {
		pngFullLogo =
			(await getLogoFromUrl('logo_full.png', backend, true)) || null;
	}

	svgLogoBrandmark = (await getLogoFromUrl('logo.svg', backend, true)) || null;

	if (!svgLogoBrandmark) {
		pngLogoBrandmark =
			(await getLogoFromUrl('logo.png', backend, true)) || null;
	}

	return {
		orgLogoFull: svgFullLogo || pngFullLogo || null,
		orgLogoBrandmark: svgLogoBrandmark || pngLogoBrandmark || null,
	};
};
