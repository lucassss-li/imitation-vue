import { NodeTypes } from './ast'
import { helperMap, TO_DISPLAY_STRING } from './runtimeHelpers'

export function generate(ast) {
    const context = createCodegenContext()
    const { push } = context

    genFunctionPreamble(push, ast)

    const functionName = 'render'
    const args = ['_ctx', '_cache']
    const signature = args.join(', ')
    push(`function ${functionName}(${signature}){`)
    push(`return `)

    genNode(ast.codegenNode, context)

    push('}')

    return {
        code: context.code,
    }
}

function createCodegenContext() {
    const context = {
        code: '',
        push(source) {
            context.code += source
        },
        helper(key) {
            return `_${helperMap[key]}`
        },
    }
    return context
}

function genFunctionPreamble(push, ast) {
    const VueBinging = 'Vue'
    const aliasHelper = s => `${helperMap[s]}:_${helperMap[s]}`
    ast.helpers.length &&
        push(
            `const { ${ast.helpers
                .map(aliasHelper)
                .join(', ')} } = ${VueBinging}`,
        )
    push('\n')
    push('return ')
}

function genNode(node, context) {
    switch (node.type) {
        case NodeTypes.TEXT: {
            genText(node, context)
            break
        }
        case NodeTypes.INTERPOLATION: {
            genInterpolation(node, context)
            break
        }
        case NodeTypes.SIMPLE_EXPRESSION: {
            genExpression(node, context)
        }
    }
}

function genText(node, context) {
    const { push } = context
    push(`"${node.content}"`)
}
function genInterpolation(node, context) {
    const { push, helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(')')
}
function genExpression(node, context) {
    const { push } = context
    push(`_ctx.${node.content}`)
}
