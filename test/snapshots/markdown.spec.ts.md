# Snapshot report for `test/markdown.spec.ts`

The actual snapshot is saved in `markdown.spec.ts.snap`.

Generated by [AVA](https://avajs.dev).

## returns a table of content

> Snapshot 1

    [
      {
        content: `heading one␊
        `,
        depth: 1,
        id: 'heading-one',
        title: 'heading one',
      },
      {
        content: `heading two␊
        `,
        depth: 2,
        id: 'heading-two',
        title: 'heading two',
      },
      {
        content: `heading three␊
        `,
        depth: 3,
        id: 'heading-three',
        title: 'heading three',
      },
    ]

## lists all the level 2 sections

> Snapshot 1

    [
      {
        content: `We wanted to create an open source alternative to existing audio streaming commercial products that was not tied to a vendor or platform. balenaSound is the product of that. balenaSound is free, secure and fully customizable! You can pick the features that suit you and leave those that don't behind, resting asured that your device will keep on working no matter what.␊
        `,
        title: 'Why balenaSound?',
      },
      {
        content: '',
        title: 'Is balenaSound free? blank para test',
      },
      {
        content: `Yes! balenaSound requires you to sign up for a free [balenaCloud](https://dashboard.balena-cloud.com/signup) account. Your first 10 devices are always free and full-featured.␊
        `,
        title: 'Is balenaSound free?',
      },
      {
        content: `balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!␊
        ␊
        balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!␊
        `,
        title: 'Privacy: is balenaSound secure?',
      },
      {
        content: '',
        title: 'Does balenaSound need internet access?',
      },
    ]

## extracts metadata from markdown

> Snapshot 1

    {
      contents: `pre text␊
      ␊
      ## Why balenaSound?␊
      ␊
      We wanted to create an open source alternative to existing audio streaming commercial products that was not tied to a vendor or platform. balenaSound is the product of that. balenaSound is free, secure and fully customizable! You can pick the features that suit you and leave those that don't behind, resting asured that your device will keep on working no matter what.␊
      ␊
      ## Is balenaSound free? blank para test␊
      ␊
      ## Is balenaSound free?␊
      ␊
      Yes! balenaSound requires you to sign up for a free [balenaCloud](https://dashboard.balena-cloud.com/signup) account. Your first 10 devices are always␊
      free and full-featured.␊
      ␊
      ## Privacy: is balenaSound secure?␊
      ␊
      balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!␊
      ␊
      balenaSound does not not depend on any type of cloud service to deliver a great experience. Other than that, your device will be running balenaOS which does communicate with balenaCloud to get application updates. This can be disabled however and won't affect your experience. Both [balenaSound](https://github.com/balenalabs/balena-sound/) and [balenaOS](https://github.com/balena-os) are open source projects, so feel free to check the source code if you want to know more about how they work!␊
      ␊
      ## Does balenaSound need internet access?␊
      `,
      frontmatter: {
        date: '2021-12-06',
        list: [
          'item 1',
          'item 2',
        ],
        title: 'yes',
      },
    }
