import test from 'ava';

import { getTableOfContent } from '../lib/utils/markdown';

const content = `
# heading one

## heading two

### heading three
`;

test('returns a table of content', async (t) => {
	const result = await getTableOfContent(content);

	t.snapshot(result);
});
