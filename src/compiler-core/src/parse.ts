import { NodeTypes } from './ast'

export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context))
}

function parseChildren(context) {
    const nodes: any[] = []
    if (context.source.startsWith('{{')) {
        const node = parseInterpolation(context)
        nodes.push(node)
    }
    return nodes
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
