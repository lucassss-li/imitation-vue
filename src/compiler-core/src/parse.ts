import { NodeTypes } from './ast'

const enum TagType {
    START,
    END,
}

export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context))
}

function parseChildren(context) {
    const nodes: any[] = []
    let node
    if (context.source.startsWith('{{')) {
        node = parseInterpolation(context)
    } else if (context.source[0] === '<') {
        if (/[a-z]/i.test(context.source[1])) {
            node = parseElement(context)
        }
    }
    nodes.push(node)
    return nodes
}

function parseElement(context) {
    const element = parseTag(context, TagType.START)
    parseTag(context, TagType.END)
    return element
}

function parseTag(context, type: TagType) {
    const match: any = /^<\/?([a-z]+?)>/i.exec(context.source)
    const tag = match[1]
    advanceBy(context, tag.length + 2)
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
    const rawContent = context.source.slice(0, closeIndex)
    const content = rawContent.trim()
    advanceBy(context, closeIndex + closeDelimiter.length)
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
    }
}
