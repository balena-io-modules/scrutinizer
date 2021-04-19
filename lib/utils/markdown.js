/*
 * Copyright 2020 balena
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

'use strict'

const unified = require('unified')
const remarkParse = require('remark-parse')
const remarkStringify = require('remark-stringify')
const remark2rehype = require('remark-rehype')
const raw = require('rehype-raw')
const rehype2remark = require('rehype-remark')

/**
 * @summary return if node is a heading
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isHeading = (node) => {
  return node.type === 'heading'
}

/**
 * @summary return if node is a paragraph
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isParagraph = (node) => {
  return node.type === 'paragraph'
}

/**
 * @summary return if node is an image
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isImage = (node) => {
  return node.type === 'image'
}

/**
 * @summary return if node is bold/strong
 * @function
 * @private
 *
 * @param {Object} node - markdown node
 * @returns {Boolean}
 *
 * @example
 * isHeading(node)
 */
const isBold = (node) => {
  return node.type === 'strong'
}

/**
 *@summary unify content as only markdown, converting html into md.
 *@function
 *@private
 *
 * @param {String} markdown - markdown content
 * @returns {Promise}
 *
 * @example
 * convertHtmlToMD(markdown).then(md => console.log(md))
 */
const convertHtmlToMD = async(markdown) => {
  return unified()
    .use(remarkParse, { gfm: true })
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(raw)
    .use(rehype2remark)
    .use(remarkStringify)
    .process(markdown)
}

/**
 * @summary Get section from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @param {String} heading - Section name
 * @returns {Object}
 *
 * @example
 * getMarkdownSection(readme, section)
 */
const getMarkdownSection = async(readme, heading) => {
  const convertedMarkdown = await convertHtmlToMD(readme)

  const mdast = unified()
    .use(remarkParse, { gfm: true })
    .parse(convertedMarkdown)

  const startIndex = mdast.children.findIndex((node) => {
    return (
      isHeading(node) &&
      node.children.some((childNode) => {
        return (
          childNode.value &&
          childNode.value.toLowerCase() === heading.toLowerCase()
        )
      })
    )
  })

  if (startIndex === -1) return ''

  const restTree = mdast.children.slice(startIndex + 1)

  let lastIndex = restTree.findIndex((node) => {
    return isHeading(node) && node.depth === mdast.children[startIndex].depth
  })

  if (lastIndex === -1) {
    lastIndex = restTree.length - 1
  }

  const tree = {
    type: 'root',
    children: mdast.children.slice(startIndex + 1, startIndex + lastIndex + 1)
  }

  return unified().use(remarkStringify).stringify(tree)
}

/**
 * @summary Get highlights from Readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getHighlights(readme)
 */
const getHighlights = async(readme) => {
  const content = await getMarkdownSection(readme, 'Highlights')

  const mdast = unified().use(remarkParse, { gfm: true }).parse(content)

  const listIndex = mdast.children.findIndex((node) => {
    return node.type === 'list'
  })

  if (listIndex === -1) {
    return ''
  }

  return mdast.children[listIndex].children
    .map((highlight) => {
      return {
        title: highlight.children[0].children[0],
        description: highlight.children[0].children[1]
      }
    })
    .map((highlight) => {
      return {
        title: unified().use(remarkStringify).stringify(highlight.title),
        description:
          unified().use(remarkStringify).stringify(highlight.description) || ''
      }
    })
    .map((highlight) => {
      return {
        title: highlight.title,
        description: highlight.description.startsWith(':')
          ? highlight.description.replace(':', '')
          : highlight.description
      }
    })
}

/**
 *
 * @summary Returns bold line after the first image(Logo) in the Markdown
 * @function
 * @private
 *
 * @param {String} readme - markdown file
 * @returns {Object}
 *
 * @example
 * getTagline(markdown)
 */
const getTagline = async(readme) => {
  const content = await convertHtmlToMD(readme)

  const mdast = unified().use(remarkParse, { gfm: true }).parse(content)

  const imageIndex = mdast.children.findIndex((node) => {
    return (
      isParagraph(node) &&
      node.children.some((childNode) => {
        return isImage(childNode)
      })
    )
  })

  if (imageIndex !== -1) {
    mdast.children = mdast.children.slice(imageIndex + 1, imageIndex + 2)
  }

  const taglineIndex = mdast.children.findIndex((node) => {
    return (
      isParagraph(node) &&
      node.children.some((childNode) => {
        return isBold(childNode)
      })
    )
  })

  if (taglineIndex !== -1) {
    return unified().use(remarkStringify).stringify(mdast)
  }

  return ''
}

/**
 * @summary Remove sections from readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @param {String[]} sections - List of sections to remove
 * @returns {Object}
 *
 * @example
 * getReadmeLeftover(readme,sections)
 */
const getLeftoverSections = async(readme, sections) => {
  const content = await convertHtmlToMD(readme)

  const mdast = unified().use(remarkParse, { gfm: true }).parse(content)

  sections.forEach((section) => {
    const startIndex = mdast.children.findIndex((node) => {
      return (
        isHeading(node) &&
        node.children.some((child) => {
          return (
            child.value && child.value.toLowerCase() === section.toLowerCase()
          )
        })
      )
    })

    if (startIndex === -1) {
      return
    }

    const header = mdast.children[startIndex]
    const rest = mdast.children.slice(startIndex + 1)
    let endIndex = rest.findIndex((node) => {
      return isHeading(node) && node.depth === header.depth
    })

    if (endIndex === -1) endIndex = rest.length - 1

    mdast.children.splice(startIndex, endIndex + 1)
  })

  const imageIndex = mdast.children.findIndex((node) => {
    return (
      isParagraph(node) &&
      node.children.some((childNode) => {
        return isImage(childNode)
      })
    )
  })

  if (imageIndex !== -1) {
    mdast.children.splice(imageIndex, 1)
  }

  const leftoverSections = []
  let startIndex = null
  let header = null
  let rest = null
  let endIndex = null
  while (startIndex !== -1) {
    startIndex = mdast.children.findIndex((node) => {
      return isHeading(node)
    })

    if (startIndex === -1) {
      break
    }
    header = mdast.children[startIndex]
    rest = mdast.children.slice(startIndex + 1)
    // eslint-disable-next-line no-loop-func
    endIndex = rest.findIndex((node) => {
      return isHeading(node) && node.depth === header.depth
    })

    if (endIndex === -1) endIndex = rest.length

    leftoverSections.push(mdast.children.splice(startIndex, endIndex + 1))
  }

  return leftoverSections.map((section) => {
    return unified()
      .use(remarkStringify)
      .stringify({ type: 'root', children: section })
  })
}

/**
 *
 * @summary Get installation steps from markdown
 * @function
 * @private
 *
 * @param {String} markdown - markdown file
 * @returns {Object}
 *
 * @example
 * getInstallationSteps(markdown)
 */
const getInstallationSteps = async(markdown) => {
  const content = await getMarkdownSection(markdown, 'Installation')

  if (!content) {
    return null
  }

  const mdast = unified().use(remarkParse, { gfm: true }).parse(content)

  let steps = []

  let footer = null

  const listIndex = mdast.children.findIndex((node) => {
    return node.type === 'list' && node.ordered
  })

  if (listIndex === -1) {
    return null
  }

  steps = mdast.children[listIndex].children.map((listNode) => {
    return unified()
      .use(remarkStringify)
      .stringify({ type: 'root', children: listNode.children })
  })

  footer = unified()
    .use(remarkStringify)
    .stringify({ type: 'root', children: mdast.children.slice(listIndex + 1) })

  return {
    headers: [],
    steps,
    footer
  }
}

/**
 * @summary Extracts leftover readme
 * @function
 * @private
 *
 * @param {String} readme - Readme file
 * @returns {Object}
 *
 * @example
 * getReadmeLeftover(readme,sections)
 */
const getLeftoverReadme = async(readme) => {
  const content = await convertHtmlToMD(readme)

  const mdast = unified().use(remarkParse, { gfm: true }).parse(content)
  let startIndex = null
  let header = null
  let rest = null
  let endIndex = null
  while (startIndex !== -1) {
    startIndex = mdast.children.findIndex((node) => {
      return isHeading(node)
    })

    header = mdast.children[startIndex]
    rest = mdast.children.slice(startIndex + 1)
    // eslint-disable-next-line no-loop-func
    endIndex = rest.findIndex((node) => {
      return isHeading(node) && node.depth === header.depth
    })

    if (endIndex === -1) endIndex = rest.length - 1

    mdast.children.splice(startIndex, endIndex + 1)
  }
  const imageIndex = mdast.children.findIndex((node) => {
    return (
      isParagraph(node) &&
      node.children.some((childNode) => {
        return isImage(childNode)
      })
    )
  })

  if (imageIndex !== -1) {
    mdast.children.splice(imageIndex, 1)
  }

  return unified().use(remarkStringify).stringify(mdast)
}

/**
 *@summary detects if deploy url exists in markdown
 *
 * @param {String} markdown - markdown
 * @param {String} deployUrl - deployUrl
 *
 * @returns {Boolean}
 * @example
 * hasDeployUrl(markdown, deployUrl)
 */
const hasDeployButton = (markdown, deployUrl) => {
  return markdown.includes(deployUrl)
}

module.exports = {
  getMarkdownSection,
  getHighlights,
  getLeftoverSections,
  getInstallationSteps,
  getTagline,
  hasDeployButton,
  getLeftoverReadme
}
