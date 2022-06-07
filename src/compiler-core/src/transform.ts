export function transform(root, options = {}) {
    const context = createTransformContext(root, options)
    traverseNode(root, context)
    createRootCodegen(root)
}

function createRootCodegen(root) {
    root.codegenNode = root.children[0]
}

function createTransformContext(root, options) {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
    }
    return context
}

function traverseNode(node, context) {
    const nodeTransforms = context.nodeTransforms
    for (let i = 0; i < nodeTransforms.length; i++) {
        nodeTransforms[i](node)
    }
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            traverseNode(node.children[i], context)
        }
    }
}
