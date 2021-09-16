import test from 'ava';

import { getTableOfContent } from '../lib/utils/markdown';

const content = `
# heading one

## heading two

### heading three
`;

test('returns a table of content', async (t) => {
	const result = await getTableOfContent(content);

	t.deepEqual(result, [
		{
			content: `[](#heading-one)

heading one
`,
			depth: 1,
			id: 'heading-one',
			title: 'heading one',
		},
		{
			content: `[](#heading-two)

heading two
`,
			depth: 2,
			id: 'heading-two',
			title: 'heading two',
		},
		{
			content: `[](#heading-three)

heading three
`,
			depth: 3,
			id: 'heading-three',
			title: 'heading three',
		},
	]);
});
