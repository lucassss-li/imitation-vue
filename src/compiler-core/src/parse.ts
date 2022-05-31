import { NodeTypes } from './ast'

const enum TagType {
    START,
    END,
}

export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context, null))
}

function parseChildren(context, closeTag) {
    const nodes: any[] = []
    while (!isEnd(context, closeTag)) {
        let node
        if (context.source.startsWith('{{')) {
            node = parseInterpolation(context)
        } else if (context.source[0] === '<') {
            if (/[a-z]/i.test(context.source[1])) {
                node = parseElement(context)
            }
        }
        if (!node) {
            node = parseText(context)
        }
        nodes.push(node)
    }
    return nodes
}

function isEnd(context, closeTag) {
    const { source, ancestors } = context
    if (/<\/[a-z]+>/.test(source)) {
        for (let i = 0; i < ancestors.length; i++) {
            const tag = ancestors[i].tag
            if (startsWithEndTag(source, tag)) {
                return true
            }
        }
    }
    if (closeTag && source.startsWith(`</${closeTag}>`)) {
        return true
    }
    return !source
}

function startsWithEndTag(source, tag) {
    return (
        source.startsWith('</') &&
        source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
    )
}

function parseText(context) {
    let endIndex = context.source.length
    const endTokens = ['{{', '<']
    for (let i = endTokens.length - 1; i >= 0; i--) {
        const index = context.source.indexOf(endTokens[i])
        if (index !== -1) {
            endIndex = Math.min(index, endIndex)
        }
    }
    const content = parseTextData(context, endIndex)
    return {
        type: NodeTypes.TEXT,
        content,
    }
}

function parseTextData(context: any, length: number) {
    const content = context.source.slice(0, length)
    advanceBy(context, length)
    return content
}

function parseElement(context) {
    const element: any = parseTag(context, TagType.START)
    context.ancestors.push(element)
    element.children = parseChildren(context, element.tag)
    context.ancestors.pop()
    if (startsWithEndTag(context.source, element.tag)) {
        parseTag(context, TagType.END)
    } else {
        throw new Error('lack end tag')
    }
    return element
}

function parseTag(context, type: TagType) {
    const match: any = /^<\/?([a-z]+?)>/i.exec(context.source)
    const tag = match[1]
    advanceBy(context, tag.length + (type === TagType.START ? 2 : 3))
    if (type === TagType.END) return
    return {
        type: NodeTypes.ELEMENT,
        tag,
    }
}

function parseInterpolation(context) {
    const openDelimiter = '{{'
    const closeDelimiter = '}}'
    advanceBy(context, openDelimiter.length)
    const closeIndex = context.source.indexOf(closeDelimiter)
    const rawContent = parseTextData(context, closeIndex)
    const content = rawContent.trim()
    advanceBy(context, closeDelimiter.length)
    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content,
        },
    }
}

function createRoot(children) {
    return {
        children,
    }
}

function advanceBy(context, length: number) {
    context.source = context.source.slice(length)
}

function createParserContext(content: string) {
    return {
        source: content,
        ancestors: [],
    }
}
