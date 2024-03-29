# Snapshot report for `test/plugins/readme.spec.ts`

The actual snapshot is saved in `readme.spec.ts.snap`.

Generated by [AVA](https://avajs.dev).

## given a header extracts content until next header

> Snapshot 1

    `motivation para *one*␊
    ␊
    **Strong** content␊
    `

## given a header extracts content until the last line

> Snapshot 1

    `Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:␊
    ␊
    [![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)␊
    `

## extracts highlights as list of markdown

> Snapshot 1

    [
      {
        description: ` Stream audio from your favorite music services or directly from your smartphone/computer using bluetooth or UPnP.␊
        `,
        title: `**Bluetooth, Airplay, Spotify Connect and UPnP**␊
        `,
      },
      {
        description: ` Play perfectly synchronized audio on multiple devices all over your place.␊
        `,
        title: `**Multi-room synchronous playing**␊
        `,
      },
      {
        description: ` Upgrade your audio quality with one of our supported DACs␊
        `,
        title: `**Extended DAC support**␊
        `,
      },
    ]

## removes provided sections from markdown

> Snapshot 1

    [
      {
        description: `Running this project is as simple as deploying it to a balenaCloud application. You can do it in just one click by using the button below:␊
        ␊
        [![](https://balena.io/deploy.png)](https://dashboard.balena-cloud.com/deploy)␊
        `,
        title: `# Setup and configuration␊
        `,
      },
      {
        description: `Head over to our [docs](https://sound.balenalabs.io) for detailed installation and usage instructions, customization options and more!␊
        `,
        title: `# Documentation␊
        `,
      },
    ]

## extracts installation steps from markdown

> Snapshot 1

    {
      footer: `footer content of the installation␊
      `,
      headers: [],
      steps: [
        {
          text: `installation step 1␊
          `,
        },
        {
          text: `installation step 2␊
          `,
        },
        {
          text: `installation step 3␊
          `,
        },
      ],
    }

## extracts installation steps with code from markdown

> Snapshot 1

    {
      footer: '',
      headers: [],
      steps: [
        {
          code: 'cd project',
          text: `go to project directory␊
          `,
        },
        {
          code: 'landr build',
          text: `Run Landr␊
          `,
        },
        {
          code: 'netlfiy deploy',
          text: `Deploy the generated site␊
          `,
        },
      ],
    }

## extracts Tagline from markdown

> Snapshot 1

    `**Starter project enabling you to add multi-room audio streaming via Bluetooth, Airplay or Spotify Connect to any old speakers or Hi-Fi using just a Raspberry Pi.**␊
    `
